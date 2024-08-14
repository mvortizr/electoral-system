import { 
    IsNotEmpty, 
    IsString, 
 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DTOParty {
    @ApiProperty({ description: 'UID of the party' })
    @IsString()
    @IsNotEmpty()
    partyID!: string

    @ApiProperty({ description: 'Name of the party' })
    @IsString()
    @IsNotEmpty()
    partyName!: string

    constructor (
        partyID: string,
        partyName: string
    ) {
        this.partyID = partyID
        this.partyName = partyName
    }

}