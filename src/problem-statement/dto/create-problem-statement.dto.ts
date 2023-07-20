import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateProblemStatementDto {
    @ApiProperty()
    @IsOptional()
    problemStatementId: string;

    @IsString()
    @ApiProperty()
    problemStatementEasy: string;

    @IsString()
    @ApiProperty()
    problemStatementModerate: string;

    @IsString()
    @ApiProperty()
    problemStatementHard: string;

    @IsString()
    @ApiProperty()
    eventId: string;

    @IsString()
    @ApiProperty()
    teamId: string;
}
