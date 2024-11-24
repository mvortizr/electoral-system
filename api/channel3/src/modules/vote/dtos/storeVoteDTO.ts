import { 
    IsUUID, 
    IsOptional, 
    IsInt,
    Min,
    //Transform
} from 'class-validator';
import { Transform } from 'class-transformer';

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

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 1))
    multiplier?: number;



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