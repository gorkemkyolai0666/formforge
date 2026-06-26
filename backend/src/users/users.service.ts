import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { subscription: true },
    });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.avatar !== undefined) data.avatar = dto.avatar;
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { subscription: true },
    });

    const { password, ...result } = user;
    return result;
  }

  async getDashboardStats(userId: string) {
    const [formCount, totalResponses, publishedForms, recentResponses] = await Promise.all([
      this.prisma.form.count({ where: { userId } }),
      this.prisma.formResponse.count({ where: { form: { userId }, isComplete: true } }),
      this.prisma.form.count({ where: { userId, status: 'PUBLISHED' } }),
      this.prisma.formResponse.count({
        where: {
          form: { userId },
          isComplete: true,
          completedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return { formCount, totalResponses, publishedForms, recentResponses };
  }
}
