const puppeteer = require("puppeteer");
const { Parser } = require("json2csv");
const fs = require("fs");
const fields = [
  "productName",
  "productFinalPrice",
  "discounts",
  "productRealPrice",
  "vendor",
  "location",
  "rate"
];

(async () => {
  const browser = await puppeteer.launch({ devtools: false, headless: false });
  const page = await browser.newPage();

  await page.goto("https://ralali.com/c/makanan-instant-hl1196", {
    executablePath: "/Applications/Google Chrome.app",
    waitUntil: "networkidle0",
    timeout: 90000
  });

  await page.setViewport({
    width: 1200,
    height: 800
  });

  await autoScroll(document.querySelector(".c-search-modal-body"));

  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  // grabbing team data
  const productList = await page.evaluate(() => {
    let productNames = document.querySelectorAll('div[ng-bind-html="v.name"]');
    let productFinalPrices = document.querySelectorAll("div.price>b");
    let discounts = document.querySelectorAll(".discount-percentage");
    let productRealPrices = document.querySelectorAll(
      ".discount .price,ng-binding"
    );
    let vendors = document.querySelectorAll("div.vendor>a");
    let locations = document.querySelectorAll(".location,ng-binding");
    let rates = document.querySelectorAll(".vendor>div");
    let arrayData = [];

    for (let i = 0; i < productNames.length; i++) {
      arrayData.push({
        productName: productNames[i].innerText.trim(),
        productFinalPrice: productFinalPrices[i].innerText.trim(),
        discounts:
          discounts[i].innerText.trim() === ""
            ? "0%"
            : discounts[i].innerText.trim(),
        productRealPrice:
          productRealPrices[i].innerText.trim() === ""
            ? productFinalPrices[i].innerText.trim()
            : productRealPrices[i].innerText.trim(),
        vendor: vendors[i].innerText.trim(),
        location: locations[i].innerText.trim(),
        rate: rates[i].getAttribute("title")
      });
    }

    return arrayData;
  });

  console.log(productList);
  console.log(productList.length);
  await browser.close();

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(productList);

  var path = "./" + "Product List Makanan Instant Ralali" + ".csv";
  fs.writeFile(path, csv, function(err, data) {});
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
