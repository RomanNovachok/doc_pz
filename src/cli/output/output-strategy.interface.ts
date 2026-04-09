export interface OutputStrategy {
  write(lines: string[]): Promise<void>;
}
