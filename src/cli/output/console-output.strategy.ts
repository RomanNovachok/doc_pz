import { Injectable } from '@nestjs/common';
import { OutputStrategy } from './output-strategy.interface';

@Injectable()
export class ConsoleOutputStrategy implements OutputStrategy {
  async write(lines: string[]): Promise<void> {
    for (const line of lines) {
      console.log(line);
    }
  }
}
