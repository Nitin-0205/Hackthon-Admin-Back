import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class Problemdto{
    
    @ApiProperty()
    @IsString()
    problemStatementEasyId: string;

    @ApiProperty()
    @IsString()
    problemStatementModerateId: string;

    @ApiProperty()
    @IsString()
    problemStatementHardId: string;
}