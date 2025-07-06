import {
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform } from 'class-transformer';

@ValidatorConstraint({ name: 'PartyFieldsConsistency', async: false })
class PartyFieldsConsistency implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const { partyID, partyExtID, partyName } = args.object as any;
    const allPresent = partyID && partyExtID && partyName;
    const allEmpty = !partyID && !partyExtID && !partyName;
    return allPresent || allEmpty;
  }

  defaultMessage(_: ValidationArguments) {
    return 'If any of partyID, partyExtID, or partyName is provided, all three must be provided.';
  }
}

export class storeVoteDTO {
  // 1. Multiplier
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 1))
  multiplier?: number;

  // 2. Position
  @IsUUID()
  positionID!: string;

  @IsUUID()
  positionExtID!: string;

  @IsString()
  positionName!: string;

  // 3. Postulation
  @IsUUID()
  postulationID!: string;

  @IsUUID()
  postulationExtID!: string;

  // 4. Candidate
  @IsUUID()
  candidateID!: string;

  @IsUUID()
  candidateExtID!: string;

  @IsString()
  candidateFullName!: string;

  // 5. Party
  @IsOptional()
  @IsUUID()
  partyID?: string;

  @IsOptional()
  @IsUUID()
  partyExtID?: string;

  @IsOptional()
  @IsString()
  partyName?: string;

  // Validation logic
  @Validate(PartyFieldsConsistency)
  validatePartyFields!: any;

  constructor(
    multiplier: number | undefined,
    positionID: string,
    positionExtID: string,
    positionName: string,
    postulationID: string,
    postulationExtID: string,
    candidateID: string,
    candidateExtID: string,
    candidateFullName: string,
    partyID?: string,
    partyExtID?: string,
    partyName?: string,
  ) {
    this.multiplier = multiplier;
    this.positionID = positionID;
    this.positionExtID = positionExtID;
    this.positionName = positionName;
    this.postulationID = postulationID;
    this.postulationExtID = postulationExtID;
    this.candidateID = candidateID;
    this.candidateExtID = candidateExtID;
    this.candidateFullName = candidateFullName;
    this.partyID = partyID;
    this.partyExtID = partyExtID;
    this.partyName = partyName;
  }
}
