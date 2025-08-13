// create-env.js (Yekun və Ən Stabil Versiya)
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

const targetPath = path.join(__dirname, "src/environments/environment.ts");

// === YENİ ƏLAVƏ OLUNAN HİSSƏ ===
// Faylı yazacağımız qovluğun adını götürürük
const targetDir = path.dirname(targetPath);

// Həmin qovluğun mövcud olub-olmadığını yoxlayırıq
if (!fs.existsSync(targetDir)) {
  // Əgər mövcud deyilsə, onu özümüz yaradırıq
  fs.mkdirSync(targetDir, { recursive: true });
}
// ===============================

// İndi faylı arxayınlıqla yaza bilərik
fs.writeFileSync(targetPath, environmentFileContent);

console.log("Successfully created environment.ts file for production.");
