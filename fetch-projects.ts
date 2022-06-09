import { Readable } from "stream";
import axios from "axios";

export async function fetchProjects(stream: boolean, smallFile: boolean) {
  return await axios({
    url: "http://localhost:3001/projects?" + (smallFile ? "small=1" : ""),
    responseType: stream ? "stream" : undefined,
  });
}

export async function readAll(stream: Readable) {
  return new Promise<string>((resolve, reject) => {
    let content = "";
    stream.on("data", function (buf) {
      content += buf.toString();
    });
    stream.on("end", function () {
      resolve(content);
    });
    stream.on("error", reject);
  });
}
