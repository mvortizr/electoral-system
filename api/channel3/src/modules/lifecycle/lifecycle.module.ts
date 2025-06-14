import { Module } from '@nestjs/common';
import { LifecycleController } from './lifecycle.controller';
import { LifecycleService } from './lifecycle.service';
import { SuperAdminService } from 'src/fabric/superadmin.service';

@Module({
  imports: [],
  controllers: [LifecycleController],
  providers: [SuperAdminService, LifecycleService],
})
export class LifecycleModule {}
