import { IsNotEmpty } from 'class-validator';

export class DTOElectionConfig {
    @IsNotEmpty()
    body!: string;
}