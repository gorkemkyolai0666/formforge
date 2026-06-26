import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateFormDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  themeColor?: string;

  @IsString()
  @IsOptional()
  bgColor?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  thankYouTitle?: string;

  @IsString()
  @IsOptional()
  thankYouMsg?: string;
}
