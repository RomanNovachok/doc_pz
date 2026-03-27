import { AmazonCsvGenerator } from './amazon-csv.generator';

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const outputPath = getArg('--output') ?? 'data/amazon_marketplace_seed.csv';
  const rows = Number(getArg('--rows') ?? '1200');

  const generator = new AmazonCsvGenerator();
  const result = await generator.generate(outputPath, Number.isFinite(rows) ? rows : 1200);

  console.log(`CSV file generated: ${result.outputPath}`);
  console.log(`Rows written: ${result.rowCount}`);
}

void main();
