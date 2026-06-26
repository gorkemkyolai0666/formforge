import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('analytics/global')
  getGlobal(@Req() req: any) {
    return this.analyticsService.getGlobalAnalytics(req.user.id);
  }

  @Get('forms/:formId/analytics')
  getFormAnalytics(@Param('formId') formId: string, @Req() req: any) {
    return this.analyticsService.getFormAnalytics(formId, req.user.id);
  }

  @Get('forms/:formId/analytics/fields')
  getFieldAnalytics(@Param('formId') formId: string, @Req() req: any) {
    return this.analyticsService.getFieldAnalytics(formId, req.user.id);
  }

  @Get('forms/:formId/analytics/funnel')
  getFunnel(@Param('formId') formId: string, @Req() req: any) {
    return this.analyticsService.getFunnelData(formId, req.user.id);
  }
}
