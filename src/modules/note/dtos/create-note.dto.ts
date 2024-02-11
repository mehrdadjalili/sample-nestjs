import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length } from "class-validator"

export class CreateNoteDto {
    @IsString()
    @ApiProperty()
    @Length(3, 50)
    title: string

    @IsString()
    @ApiProperty()
    @Length(3, 2000)
    content: string
}