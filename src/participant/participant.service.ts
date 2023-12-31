import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import * as xlsx from 'xlsx';
import * as xlsxPopulate from 'xlsx-populate';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Problemdto } from '../problem-statement/dto/problemDto';
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
      if (!file || !eventId) {
        throw new HttpException("Please provide file and event id", HttpStatus.BAD_REQUEST);
      }
      const jsonData = await this.convertTojson(file);
      const groupedData = await this.mergeArrayByTeamName(jsonData);
      console.log(groupedData);

      const teamPayload = Object.keys(groupedData).map((key): TeamDto => {
        const teampayload = new TeamDto();
        teampayload.teamName = key;
        teampayload.teamId = uuidv4();
        teampayload.eventId = eventId;
        teampayload.problemStatementEasy = "";
        teampayload.problemStatementModerate = "";
        teampayload.problemStatementHard = "";
        return teampayload;
      });

      const team = await this.prisma.team.createMany({
        data: teamPayload,
        skipDuplicates: true,
      });


      if (team) {
        const participantPayload = teamPayload.map((row) => {
          const eachparticipant = groupedData[row.teamName].map((item) => {
            const participant = new CreateParticipantDto();
            participant.participantId = uuidv4();
            participant.firstname = item.firstname;
            participant.lastname = item.lastname;
            participant.aadhar = item.aadhar.toString();
            participant.email = item.email;
            participant.phone = item.phone.toString();
            participant.telegram_userId = item.telegram_userId.toString();
            participant.telegram_chat_id = item.telegram_chat_id.toString();
            participant.teamId = row['teamId'];
            return participant;
          });
          return eachparticipant;
        });

        // console.log(participantPayload);
        const participant = participantPayload.forEach(async (item) => {
          console.log("items :", item);
          const part = await this.prisma.participants.createMany({
            data: item,
            skipDuplicates: true,
          });
          console.log(part);
        });
      }
      // return { message: "Participant created successfully" }
      throw new HttpException("Participant created successfully", HttpStatus.OK);


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
    if (teams.length === 0) {
      return { message: "No team found" }
    }

    return teams;
  }

  async findAll(teamId) {
    const allParticipant = await this.prisma.participants.findMany({
      where: {
        teamId: teamId
      }
    });
    if (allParticipant.length === 0) {
      return { message: "No participant found" }
    }
    const result = { ...allParticipant };
    result["teamMembers"] =[...allParticipant];
    const team = await this.prisma.team.findUnique({
      where: {
        teamId: teamId
      },
      select: {
        problemStatementEasy: true,
        problemStatementModerate: true,
        problemStatementHard: true
      }
    });
    const problemStatementEasy = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: team.problemStatementEasy
      }
    });
    const problemStatementModerate = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: team.problemStatementModerate
      }
    });
    const problemStatementHard = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: team.problemStatementHard
      },

    });

    result['problemStatementEasy'] = problemStatementEasy;
    result['problemStatementModerate'] = problemStatementModerate;
    result['problemStatementHard'] = problemStatementHard;

    if (allParticipant.length === 0) {
      return { message: "No participant found" }
    }
    return result;
  }



  async updateParticipant(participantId: string, updateParticipantDto: UpdateParticipantDto) {
    if (!participantId) {
      throw new HttpException("Please provide participant id", HttpStatus.BAD_REQUEST);
    }
    const participant = await this.prisma.participants.findUnique({
      where: {
        participantId: participantId
      }
    });
    if (!participant) {
      throw new HttpException("Participant not found", HttpStatus.NOT_FOUND);
    }
    if (updateParticipantDto.aadhar) {
      participant.aadhar = updateParticipantDto.aadhar;
    }
    if (updateParticipantDto.email) {
      participant.email = updateParticipantDto.email;
    }
    if (updateParticipantDto.firstname) {
      participant.firstname = updateParticipantDto.firstname;
    }
    if (updateParticipantDto.lastname) {
      participant.lastname = updateParticipantDto.lastname;
    }
    if (updateParticipantDto.phone) {
      participant.phone = updateParticipantDto.phone;
    }
    if (updateParticipantDto.telegram_chat_id) {
      participant.telegram_chat_id = updateParticipantDto.telegram_chat_id;
    }
    if (updateParticipantDto.telegram_userId) {
      participant.telegram_userId = updateParticipantDto.telegram_userId;
    }
    const updateparticipant = await this.prisma.participants.update({
      where: {
        participantId: participantId
      },
      data: participant
    });
    if (!updateparticipant) {
      throw new HttpException("Participant not updated", HttpStatus.BAD_REQUEST);
    }
    return { message: "Problemstatement provided successfully" }
  }


  // findOne(id: number) {
  //   return `This action returns a #${id} participant`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} participant`;
  // }
}
