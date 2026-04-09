import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type OutputMode = 'console' | 'kafka';

type RawOutputConfig = {
  mode?: string;
  kafka?: {
    brokers?: string[];
    topic?: string;
    clientId?: string;
    messageKey?: string;
  };
};

export type OutputConfig = {
  mode: OutputMode;
  kafka: {
    brokers: string[];
    topic: string;
    clientId: string;
    messageKey?: string;
  };
};

const defaultConfig: OutputConfig = {
  mode: 'console',
  kafka: {
    brokers: [],
    topic: 'amazon-marketplace.import-summary',
    clientId: 'amazon-marketplace-lab4',
    messageKey: undefined,
  },
};

export function loadOutputConfig(): OutputConfig {
  const configPath = resolve(process.cwd(), 'config', 'output.config.json');
  const fileConfig = existsSync(configPath)
    ? (JSON.parse(readFileSync(configPath, 'utf8')) as RawOutputConfig)
    : undefined;

  const mode = normalizeMode(process.env.OUTPUT_MODE ?? fileConfig?.mode ?? defaultConfig.mode);
  const brokers = readBrokerList(process.env.KAFKA_BROKERS, fileConfig?.kafka?.brokers ?? defaultConfig.kafka.brokers);
  const topic = process.env.KAFKA_TOPIC ?? fileConfig?.kafka?.topic ?? defaultConfig.kafka.topic;
  const clientId = process.env.KAFKA_CLIENT_ID ?? fileConfig?.kafka?.clientId ?? defaultConfig.kafka.clientId;
  const messageKey = process.env.KAFKA_MESSAGE_KEY ?? fileConfig?.kafka?.messageKey ?? defaultConfig.kafka.messageKey;

  return {
    mode,
    kafka: {
      brokers,
      topic,
      clientId,
      messageKey: messageKey?.trim() ? messageKey : undefined,
    },
  };
}

function normalizeMode(value: string): OutputMode {
  return value === 'kafka' ? 'kafka' : 'console';
}

function readBrokerList(envValue: string | undefined, fileValue: string[]): string[] {
  if (envValue && envValue.trim()) {
    return envValue
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return fileValue.map((entry) => entry.trim()).filter(Boolean);
}
