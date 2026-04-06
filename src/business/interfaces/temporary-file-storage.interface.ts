export interface TemporaryFileStorage {
  save(originalFileName: string, content: Buffer): Promise<string>;
  remove(filePath: string): Promise<void>;
}
