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



    constructor(
        postulationID: string,
        electorID: string
    ) {
        this.postulationID = postulationID
        this.electorID = electorID
    }
}