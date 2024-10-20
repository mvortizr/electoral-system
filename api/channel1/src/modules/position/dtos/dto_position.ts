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
import { TiebreakerConfigItem } from './tiebreaker';



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

    @ApiProperty({ description: 'Tiebreaker comparator configuration' })
    @IsOptional()
    @ValidateIf(o => o.tiebreakerConfig !== null)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TiebreakerConfigItem)
        tiebreakerConfig: TiebreakerConfigItem[]  | null;

    constructor(
        positionID: string,
        positionName: string,
        vacancies: number,
        tiebreakerConfig: TiebreakerConfigItem[] | null
    ) {
        this.positionID = positionID
        this.positionName = positionName
        this.vacancies = vacancies
        this.tiebreakerConfig = tiebreakerConfig
        
    }

}