import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateParticipantDto{
    @ApiProperty()
    @IsOptional()
    @IsString()
    firstname: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    lastname: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    aadhar: string;  
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    email: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    telegram_userId: string
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    telegram_chat_id :string
}

