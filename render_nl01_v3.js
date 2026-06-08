const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 627 });
  await page.goto('file:///tmp/newsletter01_v3.html');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/newsletter01_v3.png', clip: { x: 0, y: 0, width: 1200, height: 627 } });
  await browser.close();
  console.log('done');
})();
