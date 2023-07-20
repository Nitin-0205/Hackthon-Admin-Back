import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Problemdto } from './dto/problemDto';
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) { }

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
    const jsonData = this.participantService.create(file,eventId);
    return jsonData;
  }

  
  @Get("getTeamMembers/:teamId")
  find(@Param("teamId") teamId: string){
    return this.participantService.findAll(teamId);
  }

@Patch('problemstatement/:teamid')
  provideProblem(@Param('teamid') teamid: string, @Body() problemdto: Problemdto) {
    return this.participantService.provideProblem(teamid, problemdto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantService.findOne(+id);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantService.remove(+id);
  }
}
