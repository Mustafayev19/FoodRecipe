const fs = require("fs");
const path = require("path");

// Qovluğun mövcudluğunu yoxla, yoxdursa yarat
const envDir = path.join(__dirname, "src/environments");

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
  console.log("src/environments qovluğu yaradıldı");
}

const apiKey = process.env.SPOON_API_KEY;

if (!apiKey) {
  console.error("API açarı daxil edilməyib!");
  process.exit(1);
}

const content = `
export const environment = {
  production: true,
  spoonacularApiKey: '${apiKey}'
};
`;

fs.writeFileSync(path.join(envDir, "environment.ts"), content);

console.log("environment.ts Netlify üçün uğurla yaradıldı!");
