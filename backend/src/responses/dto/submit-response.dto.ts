import { IsString, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsString()
  fieldId: string;

  @IsString()
  value: string;
}

export class SubmitResponseDto {
  @IsString()
  @IsOptional()
  respondentEmail?: string;

  @IsString()
  @IsOptional()
  respondentName?: string;

  @IsDateString()
  @IsOptional()
  startedAt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
