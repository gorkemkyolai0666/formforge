import { Controller, Get, Post, Body, Param, Req, UseGuards, Headers, Ip } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponsesService } from './responses.service';
import { SubmitResponseDto } from './dto/submit-response.dto';

@Controller()
export class ResponsesController {
  constructor(private responsesService: ResponsesService) {}

  @Post('forms/:formId/responses')
  submit(
    @Param('formId') formId: string,
    @Body() dto: SubmitResponseDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.responsesService.submit(formId, dto, ip, userAgent);
  }

  @Get('forms/:formId/responses')
  @UseGuards(AuthGuard('jwt'))
  findByForm(@Param('formId') formId: string, @Req() req: any) {
    return this.responsesService.findByForm(formId, req.user.id);
  }

  @Get('responses/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.responsesService.findById(id, req.user.id);
  }
}
