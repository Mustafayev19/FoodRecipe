const fs = require("fs");

const envConfig = `
export const environment = {
  production: true,
  spoonacularApiKey: '${process.env.SPOON_API_KEY}'
};
`;

fs.writeFile("./src/environments/environment.ts", envConfig, (err) => {
  if (err) {
    console.error("API açarı daxil edilə bilmədi:", err);
  } else {
    console.log("✅ environment.ts Netlify üçün uğurla yaradıldı!");
  }
});
