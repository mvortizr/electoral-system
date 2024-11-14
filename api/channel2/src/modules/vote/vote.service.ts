import { Injectable } from '@nestjs/common';

@Injectable()
export class VoteService {
    async postData(url: string, data: any): Promise<any> {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });      
      
        return response.json();  
      
      }
}
