import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFormDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const formCount = await this.prisma.form.count({ where: { userId } });
    const maxForms = user?.subscription?.maxForms || 3;

    if (formCount >= maxForms && user?.plan === 'FREE') {
      throw new ForbiddenException(
        `Ücretsiz planda en fazla ${maxForms} form oluşturabilirsiniz. Pro plana yükseltin.`,
      );
    }

    const form = await this.prisma.form.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        themeColor: dto.themeColor,
        bgColor: dto.bgColor,
      },
      include: { fields: true },
    });

    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Yeni Form Oluşturuldu',
        body: `"${form.title}" formu başarıyla oluşturuldu.`,
        type: 'form_created',
        link: `/forms/${form.id}/edit`,
      },
    });

    return form;
  }

  async findAllByUser(userId: string) {
    return this.prisma.form.findMany({
      where: { userId },
      include: {
        fields: { select: { id: true } },
        _count: { select: { responses: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string, userId?: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        fields: { orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { responses: true } },
      },
    });

    if (!form) throw new NotFoundException('Form bulunamadı');
    return form;
  }

  async findPublicForm(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        fields: {
          orderBy: { order: 'asc' },
          include: {
            logicRules: true,
          },
        },
      },
    });

    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.status !== 'PUBLISHED') throw new NotFoundException('Bu form henüz yayınlanmamış');

    await this.prisma.form.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      id: form.id,
      title: form.title,
      description: form.description,
      themeColor: form.themeColor,
      bgColor: form.bgColor,
      logoUrl: form.logoUrl,
      thankYouTitle: form.thankYouTitle,
      thankYouMsg: form.thankYouMsg,
      fields: form.fields,
    };
  }

  async update(id: string, userId: string, dto: UpdateFormDto) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.userId !== userId) throw new ForbiddenException('Bu formu düzenleme yetkiniz yok');

    return this.prisma.form.update({
      where: { id },
      data: dto,
      include: { fields: { orderBy: { order: 'asc' } } },
    });
  }

  async publish(id: string, userId: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: { fields: true },
    });
    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.userId !== userId) throw new ForbiddenException('Bu formu yayınlama yetkiniz yok');

    if (form.fields.length === 0) {
      throw new ForbiddenException('Form yayınlamak için en az bir alan ekleyin');
    }

    return this.prisma.form.update({
      where: { id },
      data: { status: 'PUBLISHED' },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
  }

  async duplicate(id: string, userId: string) {
    const original = await this.prisma.form.findUnique({
      where: { id },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
    if (!original) throw new NotFoundException('Form bulunamadı');
    if (original.userId !== userId) throw new ForbiddenException('Bu formu kopyalama yetkiniz yok');

    const newForm = await this.prisma.form.create({
      data: {
        userId,
        title: `${original.title} (Kopya)`,
        description: original.description,
        themeColor: original.themeColor,
        bgColor: original.bgColor,
        logoUrl: original.logoUrl,
        thankYouTitle: original.thankYouTitle,
        thankYouMsg: original.thankYouMsg,
      },
    });

    for (const field of original.fields) {
      await this.prisma.field.create({
        data: {
          formId: newForm.id,
          type: field.type,
          label: field.label,
          description: field.description,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options as any,
          validation: field.validation as any,
          order: field.order,
        },
      });
    }

    return this.prisma.form.findUnique({
      where: { id: newForm.id },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(id: string, userId: string) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.userId !== userId) throw new ForbiddenException('Bu formu silme yetkiniz yok');

    await this.prisma.form.delete({ where: { id } });
    return { message: 'Form başarıyla silindi' };
  }
}
