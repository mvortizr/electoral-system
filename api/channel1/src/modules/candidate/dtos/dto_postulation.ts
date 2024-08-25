import { 
    IsUUID, 
    IsOptional, 
    IsArray, 
    ValidateNested, 
} from 'class-validator';
import { Type } from 'class-transformer';
import { TiebreakerValueDTO } from './dto_tiebreaker_value';

export class PostulationDTO {

    @IsUUID()
    postulationID!: string

    @IsUUID()
    @IsOptional()
    postulationExternalID?: string

    @IsOptional()
    partyID?: string | null;

    @IsUUID()
    positionID: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TiebreakerValueDTO)
    tiebreakerValues?: TiebreakerValueDTO[];

    constructor(
        postulationID: string,
        positionID: string,
        partyID?: string | null,
        tiebreakerValues?: TiebreakerValueDTO[],
        postulationExternalID?: string
    ) {
        this.postulationID = postulationID
        this.positionID = positionID;
        this.partyID = partyID ?? null;  // Set to null if undefined
        this.tiebreakerValues = tiebreakerValues ?? [];
        this.postulationExternalID = postulationExternalID; // Initialize as an empty array if undefined
    }
}