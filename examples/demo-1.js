const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ devtools: true });
  const page = await browser.newPage();

  await page.goto("https://scrapethissite.com/pages/forms/");

  //enable console.log on page.evaluate()
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  // grabbing team data
  const teams = await page.evaluate(() => {
    const grabFromRow = (row, classname) =>
      row
        .querySelector(`td.${classname}`) // grab the TD
        .innerText // grab the text
        .trim(); // remove spaces
    console.log("===============================================");
    debugger;
    console.log(grabFromRow);
    console.log("===============================================");
    // defining selector
    const TEAM_ROW_SELECTOR = "tr.team";

    // array to store data
    const data = [];

    const teamRows = document.querySelectorAll(TEAM_ROW_SELECTOR);

    // looping over each team row
    for (const tr of teamRows) {
      data.push({
        name: grabFromRow(tr, "name"),
        year: grabFromRow(tr, "year"),
        wins: grabFromRow(tr, "wins"),
        losses: grabFromRow(tr, "losses")
      });
    }
    // console.log(data);
    return data;
  });
  console.log(teams);
  // saving the data as JSON
  //   const fs = require("fs");

  //   fs.writeFile("./teams.json", JSON.stringify(teams, null, 2));

  await browser.close();
})();
