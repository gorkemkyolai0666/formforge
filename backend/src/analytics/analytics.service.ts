import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private async verifyFormAccess(formId: string, userId: string) {
    const form = await this.prisma.form.findUnique({ where: { id: formId } });
    if (!form) throw new NotFoundException('Form bulunamadı');
    if (form.userId !== userId) throw new ForbiddenException('Erişim yetkiniz yok');
    return form;
  }

  async getFormAnalytics(formId: string, userId: string) {
    const form = await this.verifyFormAccess(formId, userId);

    const totalResponses = await this.prisma.formResponse.count({
      where: { formId, isComplete: true },
    });

    const totalViews = form.viewCount;
    const conversionRate = totalViews > 0 ? ((totalResponses / totalViews) * 100).toFixed(1) : '0';

    const avgDuration = await this.prisma.formResponse.aggregate({
      where: { formId, isComplete: true, duration: { not: null } },
      _avg: { duration: true },
    });

    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentResponses = await this.prisma.formResponse.count({
      where: { formId, isComplete: true, completedAt: { gte: last7Days } },
    });

    const dailyResponses = await this.prisma.formResponse.groupBy({
      by: ['completedAt'],
      where: {
        formId,
        isComplete: true,
        completedAt: { gte: last7Days },
      },
      _count: true,
    });

    return {
      totalResponses,
      totalViews,
      conversionRate: parseFloat(conversionRate as string),
      avgDuration: Math.round(avgDuration._avg.duration || 0),
      recentResponses,
      dailyTrend: dailyResponses,
    };
  }

  async getFieldAnalytics(formId: string, userId: string) {
    await this.verifyFormAccess(formId, userId);

    const fields = await this.prisma.field.findMany({
      where: { formId },
      orderBy: { order: 'asc' },
    });

    const fieldStats = await Promise.all(
      fields.map(async (field) => {
        const answerCount = await this.prisma.answer.count({
          where: { fieldId: field.id },
        });

        const totalResponses = await this.prisma.formResponse.count({
          where: { formId, isComplete: true },
        });

        const completionRate = totalResponses > 0
          ? ((answerCount / totalResponses) * 100).toFixed(1)
          : '0';

        let topAnswers: any[] = [];
        if (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'DROPDOWN', 'RATING', 'NPS'].includes(field.type)) {
          const answers = await this.prisma.answer.groupBy({
            by: ['value'],
            where: { fieldId: field.id },
            _count: true,
            orderBy: { _count: { value: 'desc' } },
            take: 5,
          });
          topAnswers = answers.map((a) => ({ value: a.value, count: a._count }));
        }

        return {
          id: field.id,
          label: field.label,
          type: field.type,
          order: field.order,
          answerCount,
          completionRate: parseFloat(completionRate),
          dropOffRate: parseFloat((100 - parseFloat(completionRate)).toFixed(1)),
          topAnswers,
        };
      }),
    );

    return fieldStats;
  }

  async getFunnelData(formId: string, userId: string) {
    await this.verifyFormAccess(formId, userId);

    const fields = await this.prisma.field.findMany({
      where: { formId },
      orderBy: { order: 'asc' },
    });

    const totalStarts = await this.prisma.formResponse.count({ where: { formId } });

    const funnelSteps = await Promise.all(
      fields.map(async (field) => {
        const answeredCount = await this.prisma.answer.count({
          where: {
            fieldId: field.id,
            response: { formId },
          },
        });

        return {
          fieldId: field.id,
          label: field.label,
          order: field.order,
          answered: answeredCount,
          percentage: totalStarts > 0 ? parseFloat(((answeredCount / totalStarts) * 100).toFixed(1)) : 0,
        };
      }),
    );

    return {
      totalStarts,
      completions: await this.prisma.formResponse.count({ where: { formId, isComplete: true } }),
      steps: funnelSteps,
    };
  }

  async getGlobalAnalytics(userId: string) {
    const [totalForms, totalResponses, publishedForms, totalViews] = await Promise.all([
      this.prisma.form.count({ where: { userId } }),
      this.prisma.formResponse.count({ where: { form: { userId }, isComplete: true } }),
      this.prisma.form.count({ where: { userId, status: 'PUBLISHED' } }),
      this.prisma.form.aggregate({ where: { userId }, _sum: { viewCount: true } }),
    ]);

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyResponses = await this.prisma.formResponse.count({
      where: { form: { userId }, isComplete: true, completedAt: { gte: last30Days } },
    });

    const topForms = await this.prisma.form.findMany({
      where: { userId },
      select: { id: true, title: true, responseCount: true, viewCount: true, status: true },
      orderBy: { responseCount: 'desc' },
      take: 5,
    });

    return {
      totalForms,
      totalResponses,
      publishedForms,
      totalViews: totalViews._sum.viewCount || 0,
      monthlyResponses,
      topForms,
    };
  }
}
