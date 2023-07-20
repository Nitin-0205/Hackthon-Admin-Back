import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateProblemStatementDto {
    @ApiProperty()
    @IsOptional()
    problemStatementId: string;

    @IsString()
    @ApiProperty()
    problemStatementTitle: string;

    @IsString()
    @ApiProperty()
    problemStatementDescription: string;

    @IsString()
    @ApiProperty()
    problemStatementDifficulty: string;

    @IsString()
    @ApiProperty()
    eventId: string;
}
