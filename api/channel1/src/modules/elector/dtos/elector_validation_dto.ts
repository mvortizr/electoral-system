import { 
    IsNotEmpty, 
    IsUUID
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class ElectorPreVoteValidationDTO {
   
    @IsUUID()
    @IsNotEmpty()
    electorID!: string;

    @IsUUID()
    @IsNotEmpty()
    postulationID!: string;

    @IsUUID()
    @IsNotEmpty()
    candidateID!: string;

    constructor(
       electorID: string,
       postulationID: string, 
       candidateID: string
    ) {
        this.electorID = electorID
        this.postulationID = postulationID
        this.candidateID = candidateID
    }

}