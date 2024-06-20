import { Readable } from "stream";

// Helper function to convert buffer to a readable stream
export function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// Helper function to convert stream to Base64
export function streamToBase64(readableStream) {
  return new Promise((resolve, reject) => {
    let base64String = "";
    readableStream.on("data", (chunk) => {
      base64String += chunk.toString("base64");
    });
    readableStream.on("end", () => {
      resolve(base64String);
    });
    readableStream.on("error", (error) => {
      reject(error);
    });
  });
}
