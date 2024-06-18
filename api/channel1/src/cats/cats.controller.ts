import { Controller, Get, Param } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCats(): string[] {
    return this.catsService.getCats();
  }

  @Get(':name')
  getCatByName(@Param('name') name: string): string {
    if (name.toLowerCase() === 'garfield') {
      return 'You found Garfield! Congratulations! 🎉';
    }
    return `Meow! Here's ${name}, your cute cat.`;
  }
}
