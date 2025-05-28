import {
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  Length,
  IsOptional,
} from 'class-validator';

export enum StartingOption {
  Scratch = 'scratch',
  Placement = 'placement',
}

export class OnboardingDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  @Length(3)
  displayName!: string;

  @IsString()
  selectedLanguageId!: string;

  @IsOptional()
  @IsString()
  nativeLanguageId?: string;

  @IsArray()
  @IsString({ each: true })
  learningReasons!: string[];

  @IsInt()
  @Min(5)
  @Max(120)
  routineMinutes!: number;

  @IsEnum(StartingOption)
  startingOption!: StartingOption;
}
