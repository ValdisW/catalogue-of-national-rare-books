import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
