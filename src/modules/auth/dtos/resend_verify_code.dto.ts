import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

export class ResendCodeDto {
    @IsString()
    @ApiProperty()
    @IsUUID()
    verifyToken: string
}