import { IsEmail, IsOptional, IsString } from 'class-validator';

export class IdentifyContactDto {
  @IsEmail()
  @IsOptional()
  email: string | null;

  @IsString()
  @IsOptional()
  phoneNumber: string | null;
}
