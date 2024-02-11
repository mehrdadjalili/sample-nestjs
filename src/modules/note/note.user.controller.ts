import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoteListDto } from './dtos/note-list.dto';
import { DeleteNoteDto } from './dtos/delete-note.dto';
import { CreateNoteDto } from './dtos/create-note.dto';
import { ApiAuthGuard } from 'src/guards/api-auth-guard/api-auth-guard.guard';
import { Roles } from 'src/guards/api-auth-guard/api-auth.decorator';
import { UserRole } from '@prisma/client';

@Controller({
  path: 'user/notes',
  version: '1',
})
@ApiTags('user notes')
@Roles(UserRole.USER)
@UseGuards(ApiAuthGuard)
@ApiBearerAuth('authorization')
export class UserNoteController {
  constructor(private readonly service: NoteService) {}

  @Post()
  async create(@Body() body: CreateNoteDto, @Request() req) {
    const userId = req.user.id;
    return this.service.create(body, userId);
  }

  @Put('/:id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe)
    id: number,
    @Body() body: CreateNoteDto,
  ) {
    const userId = req.user.id;
    return this.service.update(body, id, userId);
  }

  @Get()
  async list(@Body() body: NoteListDto, @Request() req) {
    const userId = req.user.id;
    return this.service.list(body, userId);
  }

  @Get('/:id')
  async byId(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.service.byId(id, userId);
  }

  @Delete()
  async delete(@Body() body: DeleteNoteDto, @Request() req) {
    const userId = req.user.id;
    return this.service.delete(body, userId);
  }
}
