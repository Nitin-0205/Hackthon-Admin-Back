import { PartialType } from '@nestjs/swagger';
import { CreateProblemStatementDto } from './create-problem-statement.dto';

export class UpdateProblemStatementDto extends PartialType(CreateProblemStatementDto) {}
