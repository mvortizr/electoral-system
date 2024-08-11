import {  IsNotEmpty,  IsString, IsEnum, IsOptional } from 'class-validator';


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
    @IsString()
    @IsNotEmpty()
    tiebreakerID!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;
  
    @IsEnum(Datatype)
    @IsNotEmpty()
    datatype!: Datatype;
  
    @IsEnum(Comparator)
    @IsNotEmpty()
    comparator!: Comparator;

     // Add this new property
     @IsString()
     @IsOptional()
     tiebreakerExternalID?: string;
}