import express from "express";
import { fetchProjects } from "../fetch-projects";
import { JSONTransform } from "../json-transform";

const app = express();
const port = 3000;
let pendingRequests = 0;

app.get("/stream", async (req, res) => {
  pendingRequests++;
  try {
    res.write("ack\n");
    const result = await streamFetch(!!req.query.small);
    res.write(result.toString());
    res.end();
  } finally {
    pendingRequests--;
  }
});

app.get("/json", async (req, res) => {
  pendingRequests++;
  try {
    res.write("ack\n");
    const result = await asyncFetch(!!req.query.small);
    res.write(result.toString());
    res.end();
    pendingRequests--;
  } finally {
    pendingRequests--;
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

async function streamFetch(smallFile: boolean) {
  const stream: NodeJS.ReadableStream = (await fetchProjects(true, smallFile))
    .data;
  stream.on("error", (e) => console.error("err", e.stack));

  let result = 0;
  for await (let p of stream.pipe(new JSONTransform())) {
    result += p.id;
  }
  return result;
}

async function asyncFetch(smallFile: boolean) {
  const response = await fetchProjects(false, smallFile);
  const projects = response.data;
  let result = 0;
  projects.forEach((p) => (result += p.id));
  return result;
}

function format(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    value
  );
}
setInterval(() => {
  process.stdout.write(
    `\rMem: ${format(
      process.memoryUsage().rss / 1_000_000
    )}MB Requests: ${format(pendingRequests)}      `
  );
}, 1000);
