import express from "express";
import { readFileSync } from "fs";

const app = express();
const port = 3001;
let requests = 0;

const big = readFileSync("./content-big.json");
const small = readFileSync("./content-small.json");
app.get("/projects", async (req, res) => {
  requests++;
  res.send(req.query.small ? small : big);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

function format(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    value
  );
}
setInterval(() => {
  process.stdout.write(
    `\rMem: ${format(
      process.memoryUsage().rss / 1_000_000
    )}MB Requests: ${format(requests)}      `
  );
}, 1000);
