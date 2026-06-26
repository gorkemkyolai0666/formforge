import {
  Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Controller('forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: any, @Body() dto: CreateFormDto) {
    return this.formsService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: any) {
    return this.formsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.formsService.findById(id);
  }

  @Get(':id/public')
  findPublic(@Param('id') id: string) {
    return this.formsService.findPublicForm(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateFormDto) {
    return this.formsService.update(id, req.user.id, dto);
  }

  @Post(':id/publish')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  publish(@Param('id') id: string, @Req() req: any) {
    return this.formsService.publish(id, req.user.id);
  }

  @Post(':id/duplicate')
  @UseGuards(AuthGuard('jwt'))
  duplicate(@Param('id') id: string, @Req() req: any) {
    return this.formsService.duplicate(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    return this.formsService.remove(id, req.user.id);
  }
}
