import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProblemStatementService } from './problem-statement.service';
import { CreateProblemStatementDto } from './dto/create-problem-statement.dto';
import { UpdateProblemStatementDto } from './dto/update-problem-statement.dto';

@Controller('problem-statement')
export class ProblemStatementController {
  constructor(private readonly problemStatementService: ProblemStatementService) {}

  @Post()
  create(@Body() createProblemStatementDto: CreateProblemStatementDto) {
    return this.problemStatementService.create(createProblemStatementDto);
  }

  @Get()
  findAll() {
    return this.problemStatementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemStatementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProblemStatementDto: UpdateProblemStatementDto) {
    return this.problemStatementService.update(+id, updateProblemStatementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemStatementService.remove(+id);
  }
}
