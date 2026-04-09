import { OutputStrategy } from './output-strategy.interface';

type KafkaProducer = {
  connect(): Promise<void>;
  send(input: { topic: string; messages: Array<{ key?: string; value: string }> }): Promise<void>;
  disconnect(): Promise<void>;
};

type KafkaFactory = {
  producer(input?: { createPartitioner?: unknown }): KafkaProducer;
};

type KafkaModule = {
  Kafka: new (config: {
    clientId: string;
    brokers: string[];
    enforceRequestTimeout?: boolean;
  }) => KafkaFactory;
  Partitioners?: {
    DefaultPartitioner?: unknown;
    LegacyPartitioner?: unknown;
  };
};

export class KafkaOutputStrategy implements OutputStrategy {
  constructor(
    private readonly brokers: string[],
    private readonly topic: string,
    private readonly clientId = 'amazon-marketplace-lab4',
    private readonly messageKey?: string,
  ) {}

  async write(lines: string[]): Promise<void> {
    if (this.brokers.length === 0) {
      throw new Error('Kafka output requires at least one broker in the configuration.');
    }

    process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';
    const kafkaModule = (await loadKafkaModule()) as KafkaModule;
    const kafka = new kafkaModule.Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      enforceRequestTimeout: false,
    });
    const producer = kafka.producer({
      createPartitioner: kafkaModule.Partitioners?.DefaultPartitioner,
    });

    await producer.connect();

    try {
      await this.sendWithRetry(producer, lines);
    } finally {
      await producer.disconnect();
    }
  }

  private async sendWithRetry(producer: KafkaProducer, lines: string[]): Promise<void> {
    const messages = [
      {
        key: this.messageKey,
        value: lines.join('\n'),
      },
    ];

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await producer.send({
          topic: this.topic,
          messages,
        });
        return;
      } catch (error) {
        if (!isRetriableTopicMetadataError(error) || attempt === 3) {
          throw error;
        }

        await delay(1000 * attempt);
      }
    }
  }
}

async function loadKafkaModule(): Promise<unknown> {
  const dynamicImport = new Function('moduleName', 'return import(moduleName);') as (
    moduleName: string,
  ) => Promise<unknown>;

  try {
    return await dynamicImport('kafkajs');
  } catch (error) {
    throw new Error(
      'Kafka output strategy requires the "kafkajs" package. Install it before using mode="kafka".',
      {
        cause: error,
      },
    );
  }
}

function isRetriableTopicMetadataError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('This server does not host this topic-partition');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
