import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './action.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}

  getAllActions() {
    return this.actionRepository.find({ select: ['id', 'name', 'type'] });
  }
}
