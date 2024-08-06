import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/checkHealth')
  checkHealth(@Res() res: Response): object {
    return res.status(200).json({ statusCode: 200, message: 'success' });
  }

  
}
