import { writeFileSync } from 'fs';
import { resolve } from 'path';

export function versionPlugin() {
  return {
    name: 'version-plugin',
    closeBundle() {
      const version = Date.now().toString();
      writeFileSync(
        resolve(__dirname, 'dist/version.json'),
        JSON.stringify({ version, timestamp: new Date().toISOString() })
      );
      console.log(`Generated version.json: ${version}`);
    }
  };
}
