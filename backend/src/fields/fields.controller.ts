import {
  Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ReorderFieldsDto } from './dto/reorder-fields.dto';

@Controller()
export class FieldsController {
  constructor(private fieldsService: FieldsService) {}

  @Post('forms/:formId/fields')
  @UseGuards(AuthGuard('jwt'))
  create(
    @Param('formId') formId: string,
    @Req() req: any,
    @Body() dto: CreateFieldDto,
  ) {
    return this.fieldsService.create(formId, req.user.id, dto);
  }

  @Get('forms/:formId/fields')
  @UseGuards(AuthGuard('jwt'))
  findByForm(@Param('formId') formId: string) {
    return this.fieldsService.findByForm(formId);
  }

  @Patch('fields/:id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateFieldDto) {
    return this.fieldsService.update(id, req.user.id, dto);
  }

  @Patch('forms/:formId/fields/reorder')
  @UseGuards(AuthGuard('jwt'))
  reorder(
    @Param('formId') formId: string,
    @Req() req: any,
    @Body() dto: ReorderFieldsDto,
  ) {
    return this.fieldsService.reorder(formId, req.user.id, dto);
  }

  @Delete('fields/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    return this.fieldsService.remove(id, req.user.id);
  }
}
