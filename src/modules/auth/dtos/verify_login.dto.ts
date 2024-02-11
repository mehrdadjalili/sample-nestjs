import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsUUID } from "class-validator"

export class VerifyLoginDto {
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string

    @IsString()
    @ApiProperty()
    @IsUUID()
    verifyToken: string

    @IsString()
    @ApiProperty()
    verifyCode: string
}