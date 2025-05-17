import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  uid!: string;
}
