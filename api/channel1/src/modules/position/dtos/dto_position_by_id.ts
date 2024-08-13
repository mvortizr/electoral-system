import { 
    IsInt, 
    IsNotEmpty, 
    IsPositive, 
    IsString, 
    Max, 
    Min,
    IsArray,
    ValidateNested,
    IsOptional,
    ValidateIf
 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class DTOPositionByExtID {
   
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