import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function getMySQLUsernameAndPassword() {
  return {
    username: fs
      .readFileSync(path.resolve(os.homedir(), '.mysql', 'username'))
      .toString(),
    password: fs
      .readFileSync(path.resolve(os.homedir(), '.mysql', 'password'))
      .toString(),
  };
}

export function getCipher() {
  return fs
    .readFileSync(path.resolve(os.homedir(), '.cipher', 'rarebib'))
    .toString();
}
