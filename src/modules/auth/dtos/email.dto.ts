import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class EmailDto {
    @IsEmail()
    @ApiProperty()
    email: string
}