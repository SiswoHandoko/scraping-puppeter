const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ devtools: false, headless: false });
  const page = await browser.newPage();

  await page.goto("https://mitra.bukalapak.com/login", {
    waitUntil: "networkidle0",
    timeout: 90000
  });

  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  await page.waitFor("#user_session_username");
  await page.$eval("#user_session_username", el => (el.value = "081316577015"));

  await page.waitFor("#user_session_password");
  await page.$eval(
    "#user_session_password",
    el => (el.value = "bukalapakmitra123")
  );

  /** Login */
  await page.click('button[type="submit"]');

  /** Kirim SMS */
  await page.waitFor(".js-tfa-form-field__button");
  await page.click(".js-tfa-form-field__button");

  // grabbing team data
  const productList = await page.evaluate(() => {
    return true;
  });

  console.log(productList);

  //   await browser.close();
  //   await openNewTab();
})();

async function openNewTab() {
  const page2 = await browser.newPage();
  await page2.goto("https://mitra.bukalapak.com/login", {
    waitUntil: "networkidle0",
    timeout: 90000
  });
}
