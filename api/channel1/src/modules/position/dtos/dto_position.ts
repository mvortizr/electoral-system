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
    ValidateIf,
    IsUUID
 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class DTOPosition {
   
    @ApiProperty({ description: 'UID of the position that is going to be elected' })
    @IsUUID()
    @IsNotEmpty()
    positionID!: string;

    @ApiProperty({ description: 'Name of the position' })
    @IsString()
    @IsNotEmpty()
    positionName!: string;

    @ApiProperty({ description: 'Number of vacancies' })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    @Max(99)
    vacancies!: number;

    constructor(
        positionID: string,
        positionName: string,
        vacancies: number,
    ) {
        this.positionID = positionID
        this.positionName = positionName
        this.vacancies = vacancies
        
    }

}