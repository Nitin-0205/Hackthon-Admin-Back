import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import * as xlsx from 'xlsx';
import * as xlsxPopulate from 'xlsx-populate';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Problemdto } from './dto/problemDto';
import { TeamDto } from './dto/teamDto';
@Injectable()
export class ParticipantService {
  constructor(private readonly prisma: PrismaService) { }

  async convertTojson(file: any) {
    // const workbook = xlsx.readFile(file.path);
    const xlsxFile = await xlsx.readFile(file.path);
    const worksheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    console.log(jsonData);
    return jsonData;

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

  async mergeArrayByTeamName(arr: any) {
    const groupedData = {};  
    for (const item of arr) {
      const propValue = item['teamName'];
      if (propValue) {
        if (!groupedData[propValue]) {
          groupedData[propValue] = [];
        }
        groupedData[propValue].push(item);
      }
    }
  
    return groupedData;
  }

  async create(file: any, eventId: string) {
    try {
      if(!file || !eventId){
        throw new HttpException("Please provide file and event id",HttpStatus.BAD_REQUEST);
      }
      const jsonData = await this.convertTojson(file);
      const groupedData = await this.mergeArrayByTeamName(jsonData);
      // console.log(groupedData);

      const teamPayload = Object.keys(groupedData).map((key):TeamDto => {
        const teampayload = new TeamDto();
        teampayload.teamName = key;
        teampayload.teamId = uuidv4();
        teampayload.eventId = eventId;
        teampayload.problemStatementEasy= "";
        teampayload.problemStatementModerate= "";
        teampayload.problemStatementHard= "";
        return teampayload;
      });

      const team = await this.prisma.team.createMany({
        data:teamPayload,
        skipDuplicates: true,
      });


      if(team){
        const participantPayload =  teamPayload.map((row) => {
          const eachparticipant = groupedData[row.teamName].map((item) => {
            const participant = new CreateParticipantDto();
            participant.name = item.name;
            participant.email = item.email;
            participant.phone = item.phone.toString();
            participant.address = item.address;
            participant.teamId = row['teamId'];
            return participant;
          });
          return eachparticipant;
        });

        // console.log(participantPayload);
        const participant = participantPayload.forEach(async(item) => {
          console.log("items :",item);
          const part = await  this.prisma.participants.createMany({
            data: item,
            skipDuplicates: true,
          });
          console.log(part);
        });
      }
      return { message: "Participant created successfully" }
      throw new HttpException("Participant created successfully",HttpStatus.OK);
    } catch (err) {
      console.log(err);
      return { message: err.message }
    }
  }

  async findTeams(eventId: string) {
    const teams = await this.prisma.team.findMany({
      where: {
        eventId: eventId
      }
    });
    if(teams.length === 0){
      return {message:"No team found"}
    }
    return teams;
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
    const { problemStatementEasyId, problemStatementModerateId, problemStatementHardId } = problemDto;

    const easy = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: problemStatementEasyId,
        problemStatementDifficulty: "EASY"
      }
    });
    if(!easy){
      return {message:"No easy problem statement found"}
    }
    const moderate = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: problemStatementModerateId,
        problemStatementDifficulty: "MODERATE"
      }
    });
    if(!moderate){
      return {message:"No moderate problem statement found"}
    }

    const hard = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: problemStatementHardId,
        problemStatementDifficulty: "HARD"
      }
    });

    if(!hard){
      return {message:"No hard problem statement found"}
    }
    const upd = await this.prisma.team.update({
      where: {
        teamId: teamid
      },
      data: {
        problemStatementEasy: problemStatementHardId,
        problemStatementModerate: problemStatementHardId,
        problemStatementHard: problemStatementHardId
      }
    })
    if(!upd){
      throw new HttpException("Problem statement not provided successfully",HttpStatus.BAD_REQUEST);
    }
    return {message:"Problemstatement provided successfully"}

  }

  // update(upd){
  //   return {message:"Problemstatement provided successfully"}
  // }


  // findOne(id: number) {
  //   return `This action returns a #${id} participant`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} participant`;
  // }
}
