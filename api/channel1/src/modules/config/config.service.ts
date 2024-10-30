import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ConfigService {
    
    validateVotingDates(startVotingDate: string, closeVotingDate: string): void {
        const today = new Date();
        const startDate = new Date(startVotingDate);
        const endDate = new Date(closeVotingDate);
    
        // Check if start date is in the future
        if (startDate <= today) {
            throw new BadRequestException('The start date must be greater than today.');
        }
    
        // Check if end date is after start date
        if (endDate <= startDate) {
            throw new BadRequestException('The end date must be greater than the start date.');
        }
    }

}
