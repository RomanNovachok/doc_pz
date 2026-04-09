import { Module } from '@nestjs/common';
import { BusinessModule } from './business/business.module';
import { OUTPUT_STRATEGY } from './business/interfaces/tokens';
import { ConsoleOutputStrategy } from './cli/output/console-output.strategy';
import { ImportSummaryFormatter } from './cli/output/import-summary.formatter';
import { ImportSummaryReporter } from './cli/output/import-summary.reporter';
import { KafkaOutputStrategy } from './cli/output/kafka-output.strategy';
import { loadOutputConfig } from './cli/output/output-config';
import { DataAccessModule } from './data-access/data-access.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [DataAccessModule, BusinessModule, PresentationModule],
  providers: [
    ImportSummaryFormatter,
    ImportSummaryReporter,
    {
      provide: OUTPUT_STRATEGY,
      useFactory: () => {
        const config = loadOutputConfig();

        if (config.mode === 'kafka') {
          return new KafkaOutputStrategy(
            config.kafka.brokers,
            config.kafka.topic,
            config.kafka.clientId,
            config.kafka.messageKey,
          );
        }

        return new ConsoleOutputStrategy();
      },
    },
  ],
})
export class AppModule {}
