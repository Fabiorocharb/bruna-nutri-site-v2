const {chromium,expect} = require('@playwright/test');
const {pathToFileURL} = require('node:url');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async()=>{
  fs.mkdirSync('.work/qa',{recursive:true});
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(process.cwd()+'/index.html').href);
  await page.evaluate(()=>document.fonts.ready);
  for(const width of [1440,1280,1024,994,768,700,390,320]) {
    await page.setViewportSize({width,height:1000});
    await page.screenshot({path:`.work/qa/desktop-${width}.png`,fullPage:true});
    const state=await page.evaluate(()=>({
      width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      brokenImages:[...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src),
      brokenIcons:[...document.querySelectorAll('use')].filter(use=>!document.querySelector(use.getAttribute('href'))).length,
      hiddenOverlays:document.querySelectorAll('[data-baked-overlay]').length,
      height:document.body.scrollHeight
    }));
    assert.equal(state.width,state.scrollWidth,'Horizontal overflow');
    assert.equal(state.brokenImages.length,0,'Image missing');
    assert.equal(state.brokenIcons,0,'SVG missing');
    assert.equal(state.hiddenOverlays,0,'Baked overlay workaround still present');
    console.log(state);
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.main-nav')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-toggle')).toBeFocused();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
  await page.locator('.menu-toggle').click();
  await page.locator('.main-nav a[href="#sobre"]').click();
  await expect(page.locator('.main-nav')).not.toHaveClass(/open/);
  const service = page.locator('[data-detail="neuro"]');
  await service.click();
  await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('#detail-title')).toHaveText('Neuronutrição no TEA e TDAH');
  await page.screenshot({path:'.work/qa/service-dialog.png'});
  await page.keyboard.press('Escape');
  await expect(service).toBeFocused();
  await expect(page.locator('dialog')).not.toBeVisible();
  const instagramLecture = page.locator('.lecture-cover-1');
  await expect(instagramLecture).toHaveAttribute('href','https://www.instagram.com/stories/highlights/17947115456878079/');
  await expect(instagramLecture).toHaveAttribute('target','_blank');
  await expect(instagramLecture).not.toHaveAttribute('data-talk');
  const instagramPost = page.locator('.lecture-cover-2');
  await expect(instagramPost).toHaveAttribute('href','https://www.instagram.com/p/DI7UqiJRHHS/?img_index=1');
  await expect(instagramPost).toHaveAttribute('target','_blank');
  await expect(instagramPost).not.toHaveAttribute('data-talk');
  const instagramCongress = page.locator('.lecture-cover-3');
  await expect(instagramCongress).toHaveAttribute('href','https://www.instagram.com/p/DPhvp1WjJ6e/?img_index=7');
  await expect(instagramCongress).toHaveAttribute('target','_blank');
  await expect(instagramCongress).not.toHaveAttribute('data-talk');
  await expect(page.locator('.lecture-card').nth(2)).toContainText('Aprendizado no Congresso Espectro 2025');
  // Com as fotos ocultas, todos os textos, links e componentes continuam reais.
  await page.setViewportSize({width:1440,height:1000});
  await page.addStyleTag({content:'img { visibility:hidden !important }'});
  await page.screenshot({path:'.work/qa/site-without-photos.png',fullPage:true});
  await expect(page.locator('.hero-note')).toContainText('mais saudáveis');
  await expect(page.locator('.care-content h3')).toContainText('Atendimento');
  // Valida o caminho configurado sem abrir contato externo nem enviar mensagens.
  await page.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{}, {once:true})});
  const configuredPage=await browser.newPage();
  await configuredPage.route('**/js/config.js',route=>route.fulfill({contentType:'application/javascript',body:'window.SITE_CONFIG={whatsapp:"5511999999999",email:"teste@example.com",address:"Endereço de teste",videos:{}};'}));
  await configuredPage.goto(pathToFileURL(process.cwd()+'/index.html').href);
  await expect(configuredPage.locator('[data-whatsapp-row]')).toBeVisible();
  await expect(configuredPage.locator('[data-contact-main]')).toHaveAttribute('href',/wa\.me\/5511999999999/);
  await expect(configuredPage.locator('[data-location]')).toHaveAttribute('href',/google\.com\/maps\/search/);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: menu, Escape, foco, serviços, palestras, ícones, contato configurado e layout sem fotos.');
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
