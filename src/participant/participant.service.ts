import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import * as xlsx from 'xlsx';
import * as xlsxPopulate from 'xlsx-populate';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParticipantService {
  constructor(private readonly prisma: PrismaService) { }
  async convertTojson(file:any) {
    // const workbook = xlsx.readFile(file.path);
    // const xlsxFile = await xlsx.readFile("./uploads/1689750297801.xlsx");
    // console.log("xlsxfile",xlsxFile);
    const workbook = await xlsxPopulate.fromFileAsync(file.path);
    const worksheet = workbook.sheet(1);
    const jsonData = worksheet.usedRange().value();
    const header = jsonData[0];
    const data = jsonData.slice(1);

    const result = data.map((row) => {
      const rowData = {};
      header.forEach((column, index) => {
        rowData[column] = row[index];
      });
      return rowData;
    });
    return result;
  }
  async create(file: any,eventName : string) {
    // try{
      const jsonData = await this.convertTojson(file);
    // console.log(jsonData);

    const result = jsonData.map((row) => {
      console.log(row)

      const rowData = {};
      rowData['OrderDate'] = row['OrderDate'].toString();
      rowData['Region'] = row['Region'];
      rowData['Rep'] = row['Rep'];
      rowData['Item'] = row['Item'];
      rowData['Units'] = row['Units'];
      rowData['Unit_Cost'] = row['Unit Cost'];
      rowData['Total'] = row['Total'];

      // rowData['name'] = row['Name'];
      // rowData['email'] = row['Email'];
      // rowData['phone'] = row['Phone'];
      // rowData['address'] = row['Address'];
      // rowData['city'] = row['City'];
      // rowData['state'] = row['State'];
      // rowData['zip'] = row['Zip'];
      // rowData['country'] = row['Country'];

      return rowData;
    });
    // console.log(result);
    const participant = await this.prisma.test.createMany({
      data: result,
      skipDuplicates: true,
    });
    console.log(participant);
    if (participant) {
      return { message: 'success' };
    }
    return participant;
  //   }catch(err){
  //   console.log(err);
  //   return {message:err.message}
  // }
  }

  findAll() {
    const allParticipant = this.prisma.test.findMany();
    return allParticipant;
    return `This action returns all participant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
