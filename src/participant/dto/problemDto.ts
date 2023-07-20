import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class Problemdto{
    
    @ApiProperty()
    @IsString()
    problemStatementEasy: string;

    @ApiProperty()
    @IsString()
    problemStatementModerate: string;

    @ApiProperty()
    @IsString()
    problemStatementHard: string;
}