import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateImportJobDto {
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'processing', 'completed', 'failed'])
  status?: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;
}
