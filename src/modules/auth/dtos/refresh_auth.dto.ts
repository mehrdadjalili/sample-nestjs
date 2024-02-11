import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class RefreshAuthDto {
    @IsString()
    @ApiProperty()
    token: string
}