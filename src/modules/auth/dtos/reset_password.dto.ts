import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsStrongPassword, IsUUID } from "class-validator"

export class ResetPasswordDto {
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    @IsUUID()
    verifyToken: string

    @IsString()
    @ApiProperty()
    verifyCode: string

    @IsString()
    @ApiProperty()
    @IsStrongPassword()
    password: string
}