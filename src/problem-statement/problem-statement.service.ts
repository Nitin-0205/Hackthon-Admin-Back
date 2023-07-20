import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProblemStatementDto } from './dto/create-problem-statement.dto';
import { UpdateProblemStatementDto } from './dto/update-problem-statement.dto';
import * as xlsx from 'xlsx';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Problemdto } from './dto/problemDto';
@Injectable()
export class ProblemStatementService {
  constructor(private prisma: PrismaService) { }

  async convertTojson(file: any) {
    // const workbook = xlsx.readFile(file.path);
    const xlsxFile = await xlsx.readFile(file.path);
    const worksheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    return jsonData;

  }
  async create(file, eventId: string) {
    if (!file || !eventId) {
      throw new HttpException("Please provide file and event id", HttpStatus.BAD_REQUEST);
    }
    const jsonData = await this.convertTojson(file);


    const format = jsonData.map((item) => {
      console.log(item);
      const problems = new CreateProblemStatementDto();
      problems.problemStatementId = uuidv4(),
        problems.problemStatementTitle = item['title'],
        problems.problemStatementDescription = item['description'],
        problems.problemStatementDifficulty = item['difficulty'].toUpperCase(),
        problems.eventId = eventId
      return problems;
    })

    console.log(format);
    const problempayload = await this.prisma.problemStatement.createMany({
      data: format,
      skipDuplicates: true
    });

    if (!problempayload) {
      throw new HttpException("Problem statement not created successfully", HttpStatus.BAD_REQUEST);
    }

    return 'This action adds a new problemStatement';
  }

  async findAll(eventid: string) {
    const problem = await this.prisma.problemStatement.findMany({
      where: {
        eventId: eventid
      }
    })
    if (problem.length == 0) {
      throw new HttpException("No problem statement Created Yet", HttpStatus.NOT_FOUND);
    }

    return problem;
  }

  async provideProblem() {
    try {

      const easy = await this.prisma.problemStatement.findMany({
        where: {
          problemStatementDifficulty: "EASY"
        }
      });
      if (!easy) {
        return { message: "No easy problem statement found" }
      }
      const moderate = await this.prisma.problemStatement.findMany({
        where: {
          problemStatementDifficulty: "MODERATE"
        }
      });
      if (!moderate) {
        return { message: "No moderate problem statement found" }
      }
      const hard = await this.prisma.problemStatement.findMany({
        where: {
          problemStatementDifficulty: "HARD"
        }
      });
      if (!hard) {
        return { message: "No hard problem statement found" }
      }
      const teams = await this.prisma.team.findMany();
      if (!teams) {
        return { message: "No teams found" }
      }
      for (const team of teams) {
        const problemStatementEasyId = easy[Math.floor(Math.random() * easy.length)].problemStatementId;
        const problemStatementModerateId = moderate[Math.floor(Math.random() * moderate.length)].problemStatementId;
        const problemStatementHardId = hard[Math.floor(Math.random() * hard.length)].problemStatementId;

        if (!problemStatementEasyId || !problemStatementModerateId || !problemStatementHardId) {
          throw new HttpException("Problem statement not provided successfully", HttpStatus.BAD_REQUEST);
        }
        const checkproblem = await this.prisma.team.findUnique({
          where: {
            teamId: team.teamId
          },
          select: {
            problemStatementEasy: true,
            problemStatementModerate: true,
            problemStatementHard: true
          }
        })
        if (checkproblem.problemStatementEasy || checkproblem.problemStatementModerate || checkproblem.problemStatementHard) {
          console.log("Already provided");
          continue;
        }
        console.log("Providing problem statement");
        const upd = await this.prisma.team.update({
          where: {
            teamId: team.teamId
          },
          data: {

            problemStatementEasy: problemStatementEasyId,
            problemStatementModerate: problemStatementModerateId,
            problemStatementHard: problemStatementHardId
          }
        })
        if (!upd) {
          throw new HttpException("Problem statement not provided successfully", HttpStatus.BAD_REQUEST);
        }
      }
      return { message: "Problemstatement provided successfully" }
    } catch (err) {
      console.log(err);
      throw new HttpException("Problem statement not provided successfully", HttpStatus.BAD_REQUEST);
    }



  }

  findOne(problemStatementId: string) {
    const problem = this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: problemStatementId
      }
    })
    if (!problem) {
      throw new HttpException("Problem Statement Not Found", HttpStatus.NOT_FOUND);
    }
    return problem;

  }

  async update(problemStatId: string, updateProblemStatementDto: UpdateProblemStatementDto) {
    if (!problemStatId) {
      throw new HttpException("Please provide problem statement id", HttpStatus.BAD_REQUEST);
    }
    const prob = await this.prisma.problemStatement.findUnique({
      where: {
        problemStatementId: problemStatId
      }
    })
    if (!prob) {
      throw new HttpException("Problem Statement Not Found", HttpStatus.NOT_FOUND);
    }

    if (updateProblemStatementDto.problemStatementTitle) {
      prob.problemStatementTitle = updateProblemStatementDto.problemStatementTitle;
    }
    if (updateProblemStatementDto.problemStatementDescription) {
      prob.problemStatementDescription = updateProblemStatementDto.problemStatementDescription;
    }
    if (updateProblemStatementDto.problemStatementDifficulty && (updateProblemStatementDto.problemStatementDifficulty.toUpperCase() == "EASY" || updateProblemStatementDto.problemStatementDifficulty.toUpperCase() == "MODERATE" || updateProblemStatementDto.problemStatementDifficulty.toUpperCase() == "HARD")) {
      prob.problemStatementDifficulty = updateProblemStatementDto.problemStatementDifficulty.toUpperCase();
    } else {
      throw new HttpException("Please provide valid difficulty (EASY / MODERATE/ HARD )", HttpStatus.BAD_REQUEST);
    }
    const problem = await this.prisma.problemStatement.update({
      where: {
        problemStatementId: problemStatId
      },
      data: prob
    })

    if (!problem) {
      throw new HttpException("Problem Statement Not Found", HttpStatus.NOT_FOUND);
    }

    return problem;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} problemStatement`;
  // }
}
