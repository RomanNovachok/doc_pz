import { promises as fs } from 'node:fs';
import { basename } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { TemporaryFileStorage } from '../../business/interfaces/temporary-file-storage.interface';

@Injectable()
export class LocalTemporaryFileStorage implements TemporaryFileStorage {
  private readonly baseDirectory = 'tmp/uploads';

  async save(originalFileName: string, content: Buffer): Promise<string> {
    await fs.mkdir(this.baseDirectory, { recursive: true });
    const safeName = basename(originalFileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${this.baseDirectory}/${randomUUID()}-${safeName}`;
    await fs.writeFile(filePath, content);
    return filePath;
  }

  async remove(filePath: string): Promise<void> {
    await fs.rm(filePath, { force: true });
  }
}
