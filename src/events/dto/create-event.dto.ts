import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { v4 as uuidv4 } from 'uuid';

export class CreateEventDto {
    @IsString()
    @IsOptional()
    eventId: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    location: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    date: string;
}
    
