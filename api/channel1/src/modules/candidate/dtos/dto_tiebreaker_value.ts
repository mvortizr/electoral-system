import { 
    IsUUID, 
} from 'class-validator';


export class TiebreakerValueDTO {
    @IsUUID()
    tiebreakerID!: string;
  
    tiebreakerValue?: number | Date;
}
  