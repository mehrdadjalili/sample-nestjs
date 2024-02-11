import { Body, Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoteListDto } from './dtos/note-list.dto';
import { DeleteNoteDto } from './dtos/delete-note.dto';
import { Roles } from 'src/guards/api-auth-guard/api-auth.decorator';
import { UserRole } from '@prisma/client';
import { ApiAuthGuard } from 'src/guards/api-auth-guard/api-auth-guard.guard';

@Controller({
  path: 'admin/notes',
  version: '1',
})
@UseGuards(ApiAuthGuard)
@ApiBearerAuth('authorization')
@Roles(UserRole.ADMIN)
@ApiTags('admin notes')
export class AdminNoteController {
  constructor(private readonly service: NoteService) {}

  @Get()
  async list(@Body() body: NoteListDto) {
    return this.service.list(body);
  }

  @Get('/:id')
  async byId(@Param('id', ParseIntPipe) id: number) {
    return this.service.byId(id);
  }

  @Delete()
  async delete(@Body() body: DeleteNoteDto) {
    return this.service.delete(body);
  }
}
