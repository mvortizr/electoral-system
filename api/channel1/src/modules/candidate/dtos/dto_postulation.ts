import { 
    IsUUID, 
    IsOptional, 
    IsArray, 
    ValidateNested, 
} from 'class-validator';
import { Type } from 'class-transformer';

export class PostulationDTO {

    @IsUUID()
    postulationID: string

    @IsUUID()
    @IsOptional()
    postulationExternalID?: string

    @IsOptional()
    @IsUUID()
    partyID?: string | null;

    @IsOptional()
    @IsUUID()
    partyExternalID?: string | null;

    @IsUUID()
    positionID?: string;

    @IsUUID()
    @IsOptional()
    positionExternalID?: string;


    constructor(
        postulationID: string,
        positionID: string,
        partyID?: string | null,
        postulationExternalID?: string
    ) {
        this.postulationID = postulationID
        this.positionID = positionID;
        this.partyID = partyID ?? null;  // Set to null if undefined
        this.postulationExternalID = postulationExternalID; // Initialize as an empty array if undefined
    }
}