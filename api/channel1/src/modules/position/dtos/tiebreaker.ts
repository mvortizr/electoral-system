import {  IsNotEmpty,  IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Datatype {
    DATE = 'date',
    NUMBER = 'number',
}
  
enum Comparator {
    GREATER = 'greater',
    LESSER = 'lesser',
    LESSER_OR_EQUAL = 'lesserOrEqual',
    GREATER_OR_EQUAL = 'greaterOrEqual',
}

export class TiebreakerConfigItem {
    
    @ApiProperty({ description: 'Tiebreaker ID' })
    @IsString()
    @IsNotEmpty()
    tiebreakerID!: string;

    @ApiProperty({ description: 'Tiebreaker name' })
    @IsString()
    @IsNotEmpty()
    name!: string;
  
    @ApiProperty({ description: 'Tiebreaker datatype' })
    @IsEnum(Datatype)
    @IsNotEmpty()
    datatype!: Datatype;
  
    @ApiProperty({ description: 'Tiebreaker comparator' })
    @IsEnum(Comparator)
    @IsNotEmpty()
    comparator!: Comparator;

     // Add this new property
     @IsString()
     @IsOptional()
     tiebreakerExternalID?: string;
}