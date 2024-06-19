import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  
  @Injectable()
  export class ApiKeyGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
  
      const apiKey = request.headers['Authorization']; 
      console.log(process.env.API_KEY);
      
  
      if (!apiKey) {
        throw new UnauthorizedException('API key is missing.');
      }
  
      
      if (apiKey !== process.env.API_KEY) {
        
        throw new UnauthorizedException('Invalid API key.');
      }
  
      return true;
    }
  }