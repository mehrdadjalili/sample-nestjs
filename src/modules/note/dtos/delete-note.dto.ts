import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNumber } from "class-validator"

export class DeleteNoteDto {
    @IsNumber({},{each: true})
    @ApiProperty()
    ids: number[]
}