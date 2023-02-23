const path = require("path");
const fs = require("fs").promises;

const postBuild = async () => {
  const globalStylesFile = await fs.readFile(
    path.resolve(__dirname, "public", "styles.css"),
    { encoding: 'utf-8' },
  );
  await fs.writeFile(
    path.resolve(__dirname, "docs", "styles.css"),
    globalStylesFile,
    { encoding: 'utf-8' },
  );

  const fontDir = path.resolve(__dirname, "public", "fonts");
  let fontFileNames = await fs.readdir(
    fontDir,
    { withFileTypes: true, },
  );
  fontFileNames = fontFileNames.map((e) => e.name);

  const outFontsDir = path.resolve(__dirname, "docs", "fonts");
  await fs.mkdir(outFontsDir, { recursive: true });

  for (const fontFileName of fontFileNames) {
    const fontFile = await fs.readFile(
      path.resolve(fontDir, fontFileName),
    );
    await fs.writeFile(
      path.resolve(outFontsDir, fontFileName),
      fontFile,
    );
  }
};

postBuild().catch(err => {
  console.error('error => ', err);
});
