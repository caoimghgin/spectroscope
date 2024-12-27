import Color, { Coords } from "npm:colorjs.io@0.5.2";
import { appendFileSync } from "node:fs";

if (import.meta.main) {

  let collection: Color[] = [];
  const metrics = { count: collection.length, tries: 0, added: [0, 0, 0], seconds: 0 };
  let startDate = new Date();
  collection = await populateCollection();
  // console.log(collection)

  while (true) {
    startDate = new Date();
    const values = randomLabValues();
    const color = new Color("lab-d65", values as Coords);
    const result = findInsignificantDifference(collection, color);
    if (!result) {
      collection.push(color);
      appendFileSync("collection.txt", `${values.join("\t")}\r`);
      
      const now = new Date();
const formattedTime = now.toLocaleTimeString();
      var endDate  = new Date();
      var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
      metrics.seconds = seconds

      console.log( {formattedTime, ...metrics});
      metrics.added = values;
      metrics.count = collection.length;
      metrics.tries = 0;
    } else {
      metrics.count = collection.length;
      metrics.tries = metrics.tries + 1;
      metrics.added = values;
    }
  }
}

async function populateCollection() {
  const result: Color[] = []
  const contents = await Deno.readTextFile("collection.txt");
  const items = contents.split("\r\n");
  items.forEach((item) => {
    const values = item.split("\t") as Array<T>;
    if (values.length === 3) {
      const color = new Color("lab-d65", values as Coords);
      result.push(color)
    }
  });
  return result
}

function findInsignificantDifference(collection: Color[], color: Color) {
  let result: null | Color = null;
  for (const item of collection) {
    const deltaE = item.deltaE(color, "2000");
    if (deltaE <= 2.3) {
      result = item;
      break;
    }
  }
  return result;
}

function randomLabValues() {
  return [
    randomNumber(0, 100),
    randomNumber(-125, 125),
    randomNumber(-125, 125),
  ];
}

function randomNumber(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(3));
}
