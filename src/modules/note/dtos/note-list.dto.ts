import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsNumber, IsString, Min } from "class-validator"

export class NoteListDto {
    @IsString()
    @ApiProperty()
    @IsIn(['asc', 'desc'])
    sort: any

    @IsString()
    @ApiProperty()
    search?: string

    @IsNumber()
    @ApiProperty()
    @Min(1)
    page: number

    @IsNumber()
    @ApiProperty()
    @Min(20)
    limit: number
}