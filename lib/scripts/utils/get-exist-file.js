import { existsSync } from 'fs';
import path, { join } from 'path';

export default function getExistFile({ cwd, files, returnRelative }) {
  for (const file of files) {
    const absFilePath = join(cwd, file);
    if (existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
}