const puppeteer = require("puppeteer");
const { Parser } = require("json2csv");
const fs = require("fs");
const fields = [
  "productName",
  "productBasePrice",
  "productFinalPrice",
  "stock",
  "labelMeasurement",
  "pictUrl"
];

/** Set Chrome endpoint using this command on terminal : /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir') */
const wsChromeEndpointurl =
  "ws://127.0.0.1:9222/devtools/browser/690b09eb-f7a4-44c9-9d00-c2221bf4c297";

(async () => {
  const browser = await puppeteer.connect({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    browserWSEndpoint: wsChromeEndpointurl,
    devtools: false,
    headless: false
  });
  const page = await browser.newPage();
  const searchWord = "air";
  await page.setViewport({
    width: 1200,
    height: 800
  });

  await page.goto(
    "https://mitra.bukalapak.com/grosir?search_keyword=&from=homepage",
    {
      waitUntil: "networkidle0",
      timeout: 90000
    }
  );

  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  // /** Click Search Bar */
  await page.focus(".c-input-text");
  await page.keyboard.type(searchWord);

  await page.setViewport({
    width: 1200,
    height: 800
  });

  await scrollByElement(page);

  // grabbing team data
  const productList = await page.evaluate(() => {
    let arrayData = [];
    let productNames = document.querySelectorAll(".c-product-item__name");
    let productBasePrices = document.querySelectorAll(
      ".qa-grosir-page__product--label_base-price_search"
    );
    let productFinalPrices = document.querySelectorAll(
      ".qa-grosir-page__product--label_price_search"
    );
    let labelMeasurements = document.querySelectorAll(
      ".qa-grosir-page__product--label_measurement-unit_search"
    );
    let pictUrls = document.querySelectorAll(
      "div.c-product-item__real-image>picture>img"
    );
    let checkStock = document.querySelectorAll(
      ".o-layout--bleed>.c-product-item>.c-product-item__image"
    );

    for (let i = 0; i < productNames.length; i++) {
      arrayData.push({
        productName: productNames[i].innerText.trim(),
        productBasePrice:
          productBasePrices[i].innerText.trim() === ""
            ? "Rp. 0"
            : productBasePrices[i].innerText.trim(),
        productFinalPrice: productFinalPrices[i].innerText.trim(),
        stock:
          checkStock[i].innerHTML.search("c-product-item__empty-label") > -1
            ? "Stock Habis"
            : "Stock Ada",
        labelMeasurement: labelMeasurements[i].innerText.trim(),
        pictUrl: pictUrls[i].getAttribute("src").trim()
      });
    }
    return arrayData;
  });

  console.log(productList);
  console.log(productList.length);

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(productList);

  var path = "./" + "Product List " + searchWord + " BukaLapak" + ".csv";
  fs.writeFile(path, csv, function(err, data) {});
  // await browser.close();
  // await openNewTab();
})();

async function scrollByElement(page) {
  const scrollable_section = ".c-search-modal-body";
  await page.waitForSelector(".o-layout--bleed");

  await page.evaluate(async selector => {
    const scrollableSection = document.querySelector(selector);
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 800;
      var scrollHeight = document.getElementsByClassName(
        "c-search-modal-body"
      )[0].scrollHeight;

      /** Loop Scroll */
      var timer = setInterval(async () => {
        scrollableSection.scrollTop = totalHeight;
        totalHeight += distance;
        scrollHeight = document.getElementsByClassName("c-search-modal-body")[0]
          .scrollHeight;
        console.log("totalHeight:" + totalHeight);
        console.log("scrollHeight:" + scrollHeight);

        /** Check loop already arive at the bottom of div */
        let sample = document.querySelector(".u-pad-bottom--0").innerText;
        if (sample === "Semua produk sudah ditampilkan") {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  }, scrollable_section);
  console.log("Scroll Is Done");
}
