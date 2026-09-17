// Apenas codificação WebP: preserva pixels, enquadramento e conteúdo das fotos.
const fs = require('node:fs');
const {chromium} = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage();
  for (const name of ['hero','about','clinic','lecture']) {
    const source = fs.readFileSync(`assets/img/${name}-clean.png`);
    const encoded = await page.evaluate(async src => {
      const photo = new Image();
      photo.src = src;
      await photo.decode();
      const canvas = document.createElement('canvas');
      canvas.width = photo.naturalWidth;
      canvas.height = photo.naturalHeight;
      canvas.getContext('2d').drawImage(photo,0,0);
      return canvas.toDataURL('image/webp',.88).split(',')[1];
    }, 'data:image/png;base64,'+source.toString('base64'));
    const output = Buffer.from(encoded,'base64');
    fs.writeFileSync(`assets/img/${name}-clean.webp`,output);
    console.log(`${name}: ${source.length} → ${output.length} bytes`);
  }
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
