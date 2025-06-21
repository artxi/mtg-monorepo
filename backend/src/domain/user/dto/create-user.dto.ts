import { IsString, IsEmail, MinLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
