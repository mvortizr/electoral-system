import { 
    IsUUID, 
    IsOptional, 
    IsInt,
    Min,
    Transform
} from 'class-validator';
import { Type } from 'class-transformer';

export class storeVoteDTO {

    @IsUUID()
    postulationID!: string

    @IsUUID()
    candidateID!: string

    @IsUUID()
    partyID!: string

    @IsUUID()
    postulationExtID!: string

    @IsUUID()
    candidateExtID!: string

    @IsUUID()
    partyExtID!: string

    @IsInt()
    @Min(1)
    @IsOptional()
    @Transform(({ value }) => value !== undefined ? value : 1)
    multiplier?: number = 1;



    constructor(
        postulationID: string,
        candidateID: string,
        partyID: string,
        postulationExtID: string,
        candidateExtID: string,
        partyExtID: string,
        multiplier?: number
      ) {
        this.postulationID = postulationID;
        this.candidateID = candidateID;
        this.partyID = partyID;
        this.postulationExtID = postulationExtID;
        this.candidateExtID = candidateExtID;
        this.partyExtID = partyExtID;
        this.multiplier = multiplier;
      }
}