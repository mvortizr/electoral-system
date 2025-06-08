import { 
    IsUUID, 
    IsOptional, 
    IsInt,
    Min,
    IsString,
    //Transform
} from 'class-validator';
import { Transform } from 'class-transformer';

export class storeVoteDTOSA {

    @IsUUID()
    positionID!: string

    @IsUUID()
    positionExtID!: string

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

    @IsString()
    tlscert!: string 
    
    @IsString()
    keydir!: string 

    @IsString()
    certDir!: string 

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
        tlscert: string,
        keydir: string,
        certDir: string,
        multiplier?: number
      ) {
        this.postulationID = postulationID;
        this.candidateID = candidateID;
        this.partyID = partyID;
        this.postulationExtID = postulationExtID;
        this.candidateExtID = candidateExtID;
        this.partyExtID = partyExtID;
        this.tlscert = tlscert;
        this.keydir = keydir;
        this.certDir = certDir;
        this.multiplier = multiplier;
      }
}