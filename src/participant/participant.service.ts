import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import * as xlsx from 'xlsx';
import * as xlsxPopulate from 'xlsx-populate';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Problemdto } from './dto/problemDto';
@Injectable()
export class ParticipantService {
  constructor(private readonly prisma: PrismaService) { }

  async convertTojson(file: any) {
    // const workbook = xlsx.readFile(file.path);
    const xlsxFile = await xlsx.readFile("./uploads/1689750297801.xlsx");
    const worksheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    console.log(jsonData)
    return jsonData;

    // console.log("xlsxfile",xlsxFile);

    // const workbook = await xlsxPopulate.fromFileAsync(file.path);
    // const worksheet = workbook.sheet(0);
    // const jsonData = worksheet.usedRange().value();
    // const header = jsonData[0];
    // const data = jsonData.slice(1);

    // const result = data.map((row) => {
    //   const rowData = {};
    //   var teamname = row[0];
    //   header.forEach((column, index) => {
    //       rowData[column] = row[index]
    //   });
    //   return rowData;
    // });
    // return result;
  }



  async create(file: any, eventId: string) {
    try {
      const jsonData = await this.convertTojson(file);

      // const teamPayload = jsonData.map((row) => {
      //   const teampayload = {};
      //   teampayload['teamName'] = row['teamName'];
      //   teampayload['teamId'] = uuidv4();
      //   teampayload['eventId'] = eventId;
      //   teampayload['problemStatementEasy']= "";
      //   teampayload['problemStatementModerate']= "";
      //   teampayload['problemStatementHard']= "";

      //   return teampayload;
      // });
      // const team = await this.prisma.team.createMany({
      //   data: teamPayload,
      //   skipDuplicates: true,
      // });

      // const participantPayload = jsonData.map((row) => {
      //   const participant = {};
      //   participant["memberName"] = "";
      //   participant['name'] = row['name'];
      //   participant['email'] = row['email'];
      //   participant['phone'] = row['phone'].toString();
      //   participant['address'] = row['address'];
      //   participant['teamId'] = row['teamId'];

      //   return participant;
      // });

      // const participant = await this.prisma.participants.createMany({
      //   data: participantPayload,
      //   skipDuplicates: true,
      // });
      // if (participant) {
      //   return { message: 'success' };
      // }


      // console.log(jsonData);
      // const result = jsonData.map((row) => {
      //   console.log(row)
      //   const rowData = {};

      //   // rowData['name'] = row['Name'];
      //   // rowData['email'] = row['Email'];
      //   // rowData['phone'] = row['Phone'];
      //   // rowData['address'] = row['Address'];
      //   // rowData['city'] = row['City'];
      //   // rowData['state'] = row['State'];
      //   // rowData['zip'] = row['Zip'];
      //   // rowData['country'] = row['Country'];

      //   return rowData;
      // });
      // console.log(result);
      // const participant = await this.prisma.test.createMany({
      //   data: result,
      //   skipDuplicates: true,
      // });
      // console.log(participant);
      // if (participant) {
      //   return { message: 'success' };
      // }
      // return participant;
    } catch (err) {
      console.log(err);
      return { message: err.message }
    }
  }

  async findAll(teamId) {
    const allParticipant = await this.prisma.participants.findMany({
      where: {
        teamId: teamId
      }
    });
    if(allParticipant.length === 0){
      return {message:"No participant found"}
    }
    return allParticipant;
  }

  async provideProblem(teamid: string, problemDto: Problemdto) {
    const { problemStatementEasy, problemStatementModerate, problemStatementHard } = problemDto;
    const upd = await this.prisma.team.update({
      where: {
        teamId: teamid
      },
      data: {
        problemStatementEasy: problemStatementEasy,
        problemStatementModerate: problemStatementModerate,
        problemStatementHard: problemStatementHard
      }
    })
  }

  if(upd){
    return {message:"Problemstatement provided successfully"}
  }
  

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
