import { 
    IsUUID, 
    IsOptional, 
    IsArray, 
    ValidateNested, 
} from 'class-validator';
import { Type } from 'class-transformer';

export class VoteInfoDTO {

    @IsUUID()
    postulationID!: string

    @IsUUID()
    electorID!: string

    @IsUUID()
    candidateID!: string



    constructor(
        postulationID: string,
        electorID: string,
        candidateID: string
    ) {
        this.postulationID = postulationID
        this.electorID = electorID
        this.candidateID = candidateID
    }
}