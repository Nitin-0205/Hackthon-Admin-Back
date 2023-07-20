import { Injectable } from '@nestjs/common';
import { CreateProblemStatementDto } from './dto/create-problem-statement.dto';
import { UpdateProblemStatementDto } from './dto/update-problem-statement.dto';

@Injectable()
export class ProblemStatementService {
  create(createProblemStatementDto: CreateProblemStatementDto) {
    return 'This action adds a new problemStatement';
  }

  findAll() {
    return `This action returns all problemStatement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} problemStatement`;
  }

  update(id: number, updateProblemStatementDto: UpdateProblemStatementDto) {
    return `This action updates a #${id} problemStatement`;
  }

  remove(id: number) {
    return `This action removes a #${id} problemStatement`;
  }
}
