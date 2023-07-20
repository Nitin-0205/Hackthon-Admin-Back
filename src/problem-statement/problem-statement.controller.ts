import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpException, HttpStatus, UploadedFile } from '@nestjs/common';
import { ProblemStatementService } from './problem-statement.service';
import { CreateProblemStatementDto } from './dto/create-problem-statement.dto';
import { UpdateProblemStatementDto } from './dto/update-problem-statement.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('problem-statement')
@ApiTags('Problem Statement') 
export class ProblemStatementController {
  constructor(private readonly problemStatementService: ProblemStatementService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({

    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        eventId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'
    , {
      storage: diskStorage({
        destination: './uploads',
        fileFilter: (req, file, cb) => {
          const ext = extname(file.originalname);
           console.log(ext);  
          if (ext !== '.xlsx') {
           throw new HttpException('Only xlsx files are allowed', HttpStatus.BAD_REQUEST);
          }
          cb(null, true);
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}${extname(file.originalname)}`);
        }

      })
    }
  ))
  create(@UploadedFile() file:any, @Body("eventId") eventId: string) {
    console.log(file,eventId);
    const jsonData = this.problemStatementService.create(file,eventId);
    return jsonData;
  }

  @Get("getProblemStatement/:eventId")
  findAll(@Param("eventId") eventId: string){
    return this.problemStatementService.findAll(eventId);
  }

  @Get(':problemStatId')
  findOne(@Param('problemStatId') problemStatId: string) {
    return this.problemStatementService.findOne(problemStatId);
  }

  @Patch(':problemStatId')
  update(@Param('problemStatId') problemStatId: string, @Body() updateProblemStatementDto: UpdateProblemStatementDto) {
    return this.problemStatementService.update(problemStatId, updateProblemStatementDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.problemStatementService.remove(+id);
  // }
}
