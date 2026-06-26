import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FieldType } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ReorderFieldsDto } from './dto/reorder-fields.dto';

@Injectable()
export class FieldsService {
  constructor(private prisma: PrismaService) {}

  private async verifyFormOwnership(formId: string, userId: string) {
    const form = await this.prisma.form.findUnique({ where: { id: formId } });
    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.userId !== userId) throw new ForbiddenException('Bu forma erişim yetkiniz yok');
    return form;
  }

  async create(formId: string, userId: string, dto: CreateFieldDto) {
    await this.verifyFormOwnership(formId, userId);

    const maxOrder = await this.prisma.field.aggregate({
      where: { formId },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.field.create({
      data: {
        formId,
        type: dto.type as FieldType,
        label: dto.label,
        description: dto.description,
        placeholder: dto.placeholder,
        required: dto.required ?? false,
        options: dto.options as any,
        validation: dto.validation as any,
        order: nextOrder,
      },
    });
  }

  async findByForm(formId: string) {
    return this.prisma.field.findMany({
      where: { formId },
      orderBy: { order: 'asc' },
      include: { logicRules: true },
    });
  }

  async update(id: string, userId: string, dto: UpdateFieldDto) {
    const field = await this.prisma.field.findUnique({
      where: { id },
      include: { form: true },
    });
    if (!field) throw new NotFoundException('Alan bulunamadı');
    if (field.form.userId !== userId) throw new ForbiddenException('Bu alanı düzenleme yetkiniz yok');

    return this.prisma.field.update({
      where: { id },
      data: {
        type: dto.type as FieldType,
        label: dto.label,
        description: dto.description,
        placeholder: dto.placeholder,
        required: dto.required,
        options: dto.options as any,
        validation: dto.validation as any,
      },
    });
  }

  async reorder(formId: string, userId: string, dto: ReorderFieldsDto) {
    await this.verifyFormOwnership(formId, userId);

    const operations = dto.fieldOrders.map((item) =>
      this.prisma.field.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(operations);

    return this.prisma.field.findMany({
      where: { formId },
      orderBy: { order: 'asc' },
    });
  }

  async remove(id: string, userId: string) {
    const field = await this.prisma.field.findUnique({
      where: { id },
      include: { form: true },
    });
    if (!field) throw new NotFoundException('Alan bulunamadı');
    if (field.form.userId !== userId) throw new ForbiddenException('Bu alanı silme yetkiniz yok');

    await this.prisma.field.delete({ where: { id } });
    return { message: 'Alan başarıyla silindi' };
  }
}
