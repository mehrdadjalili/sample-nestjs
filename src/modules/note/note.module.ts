import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { AdminNoteController } from './note.admin.controller';
import { UserNoteController } from './note.user.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [NoteService],
  controllers: [AdminNoteController, UserNoteController],
  imports: [DatabaseModule]
})
export class NoteModule {}
