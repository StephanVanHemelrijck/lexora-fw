import { IsNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  uid!: string;

  @IsNumber()
  dailyMinutes!: number;
}
