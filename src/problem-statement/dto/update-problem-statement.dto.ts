import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateProblemStatementDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    problemStatementTitle: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    problemStatementDescription: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    problemStatementDifficulty: string;

}
