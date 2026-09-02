import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { brandCatalogSnapshotSchema, type BrandCatalogSnapshot } from '@vehicle-cost/contracts';

export class BrandCatalogCacheFile {
  constructor(readonly filePath: string) {}

  async read(): Promise<BrandCatalogSnapshot> {
    const contents = await readFile(this.filePath, 'utf8');
    return brandCatalogSnapshotSchema.parse(JSON.parse(contents));
  }

  async write(snapshot: BrandCatalogSnapshot): Promise<void> {
    const validatedSnapshot = brandCatalogSnapshotSchema.parse(snapshot);
    const directory = dirname(this.filePath);
    const temporaryPath = join(
      directory,
      `.${basename(this.filePath)}.${process.pid}.${randomUUID()}.tmp`,
    );

    await mkdir(directory, { recursive: true });

    try {
      await writeFile(temporaryPath, `${JSON.stringify(validatedSnapshot, null, 2)}\n`, {
        encoding: 'utf8',
        flag: 'wx',
      });
      await rename(temporaryPath, this.filePath);
    } catch (error) {
      await rm(temporaryPath, { force: true });
      throw error;
    }
  }
}
