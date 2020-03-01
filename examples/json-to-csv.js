const { Parser } = require("json2csv");
const fs = require("fs");
const fields = ["car", "price", "color2"];
const myCars = [
  {
    car: "Audi",
    price: 40000,
    color: "blue"
  },
  {
    car: "BMW",
    price: 35000,
    color: "black"
  },
  {
    car: "Porsche",
    price: 60000,
    color: "green"
  }
];

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(myCars);

var path = "./" + Date.now() + ".csv";
fs.writeFile(path, csv, function(err, data) {});

console.log(csv);
