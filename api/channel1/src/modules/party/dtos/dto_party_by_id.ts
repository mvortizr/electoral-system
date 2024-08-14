import {  
    IsNotEmpty, 
    IsString
 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class DTOPartyByExtID {
   
    @ApiProperty({ description: 'ID to query' })
    @IsNotEmpty()
    @IsString()
    queryID!: string;

    
    constructor(
        queryID: string,
    ) {
        this.queryID = queryID
    }

}