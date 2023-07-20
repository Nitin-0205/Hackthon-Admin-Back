import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createEventDto: CreateEventDto) {
   try{
    createEventDto.eventId = uuidv4();
    const addEvent = await this.prisma.events.create({
      data:createEventDto
    })

    return 'This action adds a new event';
   }catch(e){
     console.log(e)
   }
  }

  async findAll() {
    const events = await this.prisma.events.findMany();
    if(events.length == 0){
      throw new HttpException("No events Created Yet",HttpStatus.NOT_FOUND);
    }
    return events
    
  }

  async findEventById(eventid:string) {
    const event =  await this.prisma.events.findUnique({
      where:{
        eventId:eventid
      }
    })  
    if(!event){
      throw new HttpException("No event found with this id",HttpStatus.NOT_FOUND);
    }
    return event;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} event`;
  // }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} event`;
  // }
}
