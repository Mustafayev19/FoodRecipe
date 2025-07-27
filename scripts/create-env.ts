// scripts/create-env.ts
import { writeFileSync } from 'fs';
import { mkdirSync } from 'fs';

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: true,
  sponacularApi: 'https://api.spoonacular.com/recipes',
  spoonacularApiKey: '${process.env['SPOONACULAR_KEY']}'
};
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envConfigFile);
