import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SubmitResponseDto } from './dto/submit-response.dto';

@Injectable()
export class ResponsesService {
  constructor(private prisma: PrismaService) {}

  async submit(formId: string, dto: SubmitResponseDto, ip?: string, userAgent?: string) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      include: { fields: true, user: { include: { subscription: true } } },
    });

    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.status !== 'PUBLISHED') throw new ForbiddenException('Bu form yanıt kabul etmiyor');

    const currentMonthResponses = await this.prisma.formResponse.count({
      where: {
        form: { userId: form.userId },
        isComplete: true,
        completedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const maxResponses = form.user.subscription?.maxResponses || 100;
    if (currentMonthResponses >= maxResponses && form.user.plan === 'FREE') {
      throw new ForbiddenException('Bu formun aylık yanıt limiti dolmuş');
    }

    const duration = dto.startedAt
      ? Math.floor((Date.now() - new Date(dto.startedAt).getTime()) / 1000)
      : null;

    const response = await this.prisma.formResponse.create({
      data: {
        formId,
        respondentEmail: dto.respondentEmail,
        respondentName: dto.respondentName,
        ipAddress: ip,
        userAgent: userAgent,
        isComplete: true,
        completedAt: new Date(),
        duration,
        answers: {
          create: dto.answers.map((a) => ({
            fieldId: a.fieldId,
            value: String(a.value),
          })),
        },
      },
      include: { answers: true },
    });

    await this.prisma.form.update({
      where: { id: formId },
      data: { responseCount: { increment: 1 } },
    });

    await this.prisma.notification.create({
      data: {
        userId: form.userId,
        title: 'Yeni Form Yanıtı',
        body: `"${form.title}" formuna yeni bir yanıt geldi.`,
        type: 'new_response',
        link: `/forms/${formId}/edit`,
      },
    });

    return { message: 'Yanıtınız başarıyla kaydedildi', id: response.id };
  }

  async findByForm(formId: string, userId: string) {
    const form = await this.prisma.form.findUnique({ where: { id: formId } });
    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.userId !== userId) throw new ForbiddenException('Bu yanıtlara erişim yetkiniz yok');

    const responses = await this.prisma.formResponse.findMany({
      where: { formId },
      include: {
        answers: {
          include: {
            field: { select: { label: true, type: true } },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    return responses;
  }

  async findById(id: string, userId: string) {
    const response = await this.prisma.formResponse.findUnique({
      where: { id },
      include: {
        form: { select: { userId: true, title: true } },
        answers: {
          include: {
            field: { select: { label: true, type: true } },
          },
        },
      },
    });

    if (!response) throw new NotFoundException('Yanıt bulunamadı');
    if (response.form.userId !== userId) throw new ForbiddenException('Bu yanıta erişim yetkiniz yok');

    return response;
  }
}
