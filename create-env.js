// create-env.js (Angular 20+ üçün DÜZGÜN versiya)
const fs = require("fs");
const path = require("path");

const apiKey = process.env.NG_APP_SPOONACULAR_API_KEY;

if (!apiKey) {
  console.error(
    "ERROR: Environment variable NG_APP_SPOONACULAR_API_KEY is not set."
  );
  process.exit(1);
}

const environmentFileContent = `
export const environment = {
  production: true,
  sponacularApi: 'https://api.spoonacular.com/recipes',
  spoonacularApiKey: '${apiKey}'
};
`;

// DİQQƏT: Hədəf faylı düzgün olaraq 'environment.ts'-dir
const targetPath = path.join(__dirname, "src/environments/environment.ts");
fs.writeFileSync(targetPath, environmentFileContent);

console.log(
  "Successfully created environment.ts file with API key for production."
);
