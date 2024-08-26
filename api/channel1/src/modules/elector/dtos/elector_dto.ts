import { IsUUID, IsString, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ElectorDTO {
  @IsUUID()
  @IsNotEmpty()
  electorID!: string;

  @IsUUID()
  @IsOptional()
  electorExternalID?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => value !== undefined ? value : 1)
  multiplier?: number = 1;

  @IsString()
  @IsNotEmpty()
  electorFirstName!: string;

  @IsString()
  @IsOptional()
  electorSecondName?: string;

  @IsString()
  @IsNotEmpty()
  electorFirstLastName!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  electorSecondLastName?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  positionsToVote!: string[];
}