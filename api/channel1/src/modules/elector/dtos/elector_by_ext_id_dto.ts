import {  
    IsNotEmpty, 
    IsString
 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class DTOElectorByExtID {
   
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