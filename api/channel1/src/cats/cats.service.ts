import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  getCats(): string[] {
    return ['Siamese', 'Persian', 'Maine Coon', 'Sphynx'];
  }
}
