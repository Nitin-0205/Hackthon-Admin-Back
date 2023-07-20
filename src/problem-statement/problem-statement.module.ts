import { Module } from '@nestjs/common';
import { ProblemStatementService } from './problem-statement.service';
import { ProblemStatementController } from './problem-statement.controller';

@Module({
  controllers: [ProblemStatementController],
  providers: [ProblemStatementService]
})
export class ProblemStatementModule {}
