import { Inject, Injectable } from '@nestjs/common';
import { OUTPUT_STRATEGY } from '../../business/interfaces/tokens';
import { ImportSummaryModel } from '../../business/models/import-summary.model';
import { ImportSummaryFormatter } from './import-summary.formatter';
import { OutputStrategy } from './output-strategy.interface';

@Injectable()
export class ImportSummaryReporter {
  constructor(
    private readonly formatter: ImportSummaryFormatter,
    @Inject(OUTPUT_STRATEGY) private readonly outputStrategy: OutputStrategy,
  ) {}

  async report(summary: ImportSummaryModel): Promise<void> {
    const lines = this.formatter.format(summary);
    await this.outputStrategy.write(lines);
  }
}
