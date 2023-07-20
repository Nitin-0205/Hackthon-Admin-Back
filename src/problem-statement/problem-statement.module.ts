import { Module } from '@nestjs/common';
import { ProblemStatementService } from './problem-statement.service';
import { ProblemStatementController } from './problem-statement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProblemStatementController],
  providers: [ProblemStatementService]
})
export class ProblemStatementModule {}
