import { IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateCollectionCardDto {
  @IsString()
  scryfallId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  condition?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  language?: string;

  @IsString()
  finish: string;
}
