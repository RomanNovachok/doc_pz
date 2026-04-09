import { Injectable } from '@nestjs/common';
import { ImportSummaryModel } from '../../business/models/import-summary.model';

@Injectable()
export class ImportSummaryFormatter {
  format(summary: ImportSummaryModel): string[] {
    return ['Import completed successfully.', JSON.stringify(summary, null, 2)];
  }
}
