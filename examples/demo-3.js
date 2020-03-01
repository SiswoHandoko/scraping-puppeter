const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ devtools: false, headless: false });
  const page = await browser.newPage();

  // await page.goto("https://news.ycombinator.com/", {
  //   waitUntil: "networkidle0"
  // });
  await page.goto("https://ralali.com/c/makanan-instant-hl1196", {
    waitUntil: "networkidle0",
    timeout: 90000
  });

  // await page.setViewport({
  //   width: 1200,
  //   height: 800
  // });

  // await autoScroll(page);

  //enable console.log on page.evaluate()
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  // const test = await page.$eval('div[ng-bind-html="v.name"]', e => e.innerText);
  // grabbing team data
  const teams = await page.evaluate(() => {
    console.log("===============================================");
    console.log("PROCESS INSIDE PAGE EVALUATE");
    console.log("===============================================");

    let titleNodeList = document.querySelectorAll('div[ng-bind-html="v.name"]');
    let arrayData = [];
    for (let i = 0; i < titleNodeList.length; i++) {
      arrayData.push(titleNodeList[i].innerText);
    }
    return arrayData;
  });
  console.log(teams);
  console.log(teams.length);
  await browser.close();
})();

// async function autoScroll(page) {
//   await page.evaluate(async () => {
//     await new Promise((resolve, reject) => {
//       var totalHeight = 0;
//       var distance = 100;
//       var timer = setInterval(() => {
//         var scrollHeight = document.body.scrollHeight;
//         window.scrollBy(0, distance);
//         totalHeight += distance;

//         if (totalHeight >= scrollHeight) {
//           clearInterval(timer);
//           resolve();
//         }
//       }, 100);
//     });
//   });
// }
