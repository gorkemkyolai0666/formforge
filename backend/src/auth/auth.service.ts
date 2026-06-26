import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Bu e-posta adresi zaten kayıtlı');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    await this.prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        credits: 5,
        maxForms: 3,
        maxResponses: 100,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        title: 'FormForge\'a Hoş Geldiniz!',
        body: 'Hesabınız başarıyla oluşturuldu. İlk formunuzu oluşturmaya başlayabilirsiniz.',
        type: 'welcome',
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { subscription: true },
    });

    if (!user) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        aiCredits: user.aiCredits,
        subscription: user.subscription,
      },
      access_token: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    const formCount = await this.prisma.form.count({ where: { userId } });
    const totalResponses = await this.prisma.formResponse.count({
      where: { form: { userId } },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: user.plan,
      aiCredits: user.aiCredits,
      subscription: user.subscription,
      stats: { formCount, totalResponses },
      createdAt: user.createdAt,
    };
  }
}
