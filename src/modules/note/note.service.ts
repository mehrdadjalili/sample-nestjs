import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dtos/create-note.dto';
import { DatabaseService } from 'src/database/database.service';
import { NoteListDto } from './dtos/note-list.dto';
import { DeleteNoteDto } from './dtos/delete-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateNoteDto, userId: number) {
    const note = await this.db.note.create({
      data: {
        userId,
        ...data,
      },
    });

    return note;
  }

  async update(data: CreateNoteDto, id: number, userId: number) {
    await this.db.note.findUniqueOrThrow({
      where: { id, userId },
    });

    const note = await this.db.note.update({
      where: { id, userId },
      data: { ...data },
    });

    return note;
  }

  async byId(id: number, userId?: number) {
    var filter = { id };
    if (userId != null) {
      filter['userId'] = userId;
    }

    const note = await this.db.note.findUniqueOrThrow({
      where: filter,
    });

    return note;
  }

  async list(data: NoteListDto, userId?: number) {
    var filter = {};
    if (userId != null) {
      filter['userId'] = userId;
    }

    if (data.search != null) {
      filter['OR'] = [
        { title: { contains: data.search } },
        { content: { contains: data.search } },
      ];
    }

    const notes = await this.db.note.findMany({
      where: filter,
      orderBy: { id: data.sort },
      skip: (data.page - 1) * data.limit,
      take: data.limit,
    });

    const total = await this.db.note.count({
      where: filter,
    });

    return {
      total,
      notes,
    };
  }

  async delete(data: DeleteNoteDto, userId?: number) {
    var filter = { id: { in: data.ids } };
    if (userId != null) {
      filter['userId'] = userId;
    }

    await this.db.note.deleteMany({
      where: filter,
    });

    return 'ok';
  }
}
