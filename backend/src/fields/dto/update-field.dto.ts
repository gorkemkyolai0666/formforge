import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateFieldDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  label?: string;

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
