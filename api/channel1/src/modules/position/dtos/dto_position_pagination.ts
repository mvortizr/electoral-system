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



export class DTOPositionPagination {
   
    @ApiProperty({ description: 'pagesize' })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100)
    pageSize!: number;

    @ApiProperty({ description: 'bookmark of page, can be an empty string' })
    @IsString()
    bookmark!: string;

    
    constructor(
        pageSize: number,
        bookmark: string,
    ) {
        this.pageSize = pageSize
        this.bookmark = bookmark
    }

}