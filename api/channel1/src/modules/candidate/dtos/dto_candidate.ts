import { IsUUID, IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsDate, IsISO8601, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PostulationDTO } from './dto_postulation';

export class CandidateDTO {
  @IsUUID()
  candidateID!: string;

  @IsString()
  candidateFirstName!: string;

  @IsString()
  candidateSecondName!: string;

  @IsString()
  candidateFirstLastName!: string;

  @IsString()
  candidateSecondLastName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostulationDTO)
  postulations!: PostulationDTO[];
}
