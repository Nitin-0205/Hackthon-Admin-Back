import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TelegramService{
  constructor(private readonly configService: ConfigService,
    private prisma:PrismaService) {}
  private readonly baseUrl = `${process.env.TELEGRAM_BASE_URL}`;
  private readonly token = "6323315006:AAFlh5zPZjBw8Wuzfn52kVDNee3hBe0hkIE";

  async sendMessage(chatId: string, text: string): Promise<any> {
    const url = `${this.baseUrl}${this.token}/sendMessage`;
    console.log(url)
    const data = {
      chat_id: chatId,
      text,
    };

    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to send message to Telegram.');
    }
  }

  async sendProblem(){
    const participants = await this.prisma.participants.findMany()
  // console.log(participants)
  for(const participant of participants){
    const teams = await this.prisma.team.findMany({
      where:{
        teamId:participant.teamId
      }
    })
    // console.log(teams)
    teams.forEach(async (team)=>{
      const problems = await this.prisma.problemStatement.findMany({
        where:{
          OR:[
            {
              problemStatementId:team.problemStatementEasy
            },
            {
              problemStatementId:team.problemStatementModerate
            },
            {
              problemStatementId:team.problemStatementHard
            }
          ]
        }
      })
      console.log(problems)
      for(const problem of problems){
        try{
          // console.log(problem)
          
        const text = `Problem Statement Difficulty: ${problem.problemStatementDifficulty}\n\nProblem Statement: ${problem.problemStatementTitle}\n\nProblem Statement Description: ${problem.problemStatementDescription}`
        await this.sendMessage(participant.telegram_chat_id,text)
        }catch(err){
          console.log(err)
          throw new Error("Failed to send message to Telegram.")
        }
      }
    })
  }
  }

  async sendProblemStatement(teamId){
    const team = await this.prisma.team.findUnique({
      where:{
        teamId:teamId
      }
    })
    if(!team){
      throw new Error("Team not found")
    }
    const participant = await this.prisma.participants.findMany({
      where:{
        teamId:teamId
      }
    })
    if(!participant){
      throw new Error("Participant not found")
    }

    
    participant.forEach(async (item)=>{
      try{
        const problems = await this.prisma.problemStatement.findMany({
          where:{
            OR:[
              {
                problemStatementId:team.problemStatementEasy
              },
              {
                problemStatementId:team.problemStatementModerate
              },
              {
                problemStatementId:team.problemStatementHard
              }
            ]
          }

        })
        problems.forEach(async (problem)=>{
          const text = `Problem Statement Difficulty: ${problem.problemStatementDifficulty}\n\nProblem Statement: ${problem.problemStatementTitle}\n\nProblem Statement Description: ${problem.problemStatementDescription}`
        await this.sendMessage(item.telegram_chat_id,text)
        })
      }catch(err){
        console.log(err)
        throw new Error("Failed to send message to Telegram.")
      }
    })
  }


}
// export class TelegramService {
//   private readonly baseUrl = `https://api.telegram.org/bot6358226590:AAE394MjEtH0NIAtFGTC9ZUZdU7Jrjgm0TE`;

//   async sendMessage(chatId: number, text: string): Promise<void> {
//     const url = `${this.baseUrl}/sendMessage`;
//     await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ chat_id: chatId, text }),
//     });
//   }
// }

