import { IsString, IsOptional, IsBoolean, IsEnum, IsObject } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  type: string;

  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  placeholder?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsObject()
  @IsOptional()
  options?: any;

  @IsObject()
  @IsOptional()
  validation?: any;
}
