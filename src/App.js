import "./App.css";
import React from "react";

import { f0_data, phoneme_data } from "./data.js";

const ort = require("onnxruntime-web");

// console.log(self.crossOriginIsolated);
// const worker = new Worker("./static/js/worker.js");

function App() {
  let session = undefined;
  const process = async () => {
    const option = {
      executionProviders: ["webgl"],
      // executionProviders: ["wasm"],
    };
    session = await ort.InferenceSession.create("./decode.onnx", option);
  };
  process();

  const inference = async () => {
    const startTime = performance.now();

    try {
      {
        const length = 407;
        const phoneme_size = 45;
        const speaker_id_data = BigInt64Array.from([1].map((x) => BigInt(x)));

        const f0 = new ort.Tensor("float32", f0_data, [length, 1]);
        const phoneme = new ort.Tensor("float32", phoneme_data, [
          length,
          phoneme_size,
        ]);
        const speaker_id = new ort.Tensor("int64", speaker_id_data, [1]);

        const feeds = { f0, phoneme, speaker_id };
        const results = await session.run(feeds);

        const output = results.wave.data;
        console.log(`data of result length: ${output.length}`);
      }
    } catch (e) {
      document.write(`failed to inference ONNX model: ${e}.`);
    }

    const endTime = performance.now();
    console.log(`ellapsed time: ${(endTime - startTime) / 1000}`);
  };

  /*
  React.useEffect(() => {
    const messageHandler = (e) => {
      console.log(`worker message: ${e.data}`);
    };
    const errorHandler = (e) => {
      console.error("worker error");
      console.error(e);
    };
    worker.addEventListener("message", messageHandler);
    worker.addEventListener("error", errorHandler);

    return () => {
      worker.removeEventListener("message", messageHandler);
      worker.removeEventListener("error", errorHandler);
    };
  }, [worker]);
  const inference = async () => {
    worker.postMessage({ f0_data, phoneme_data });
  };
  */

  return (
    <div>
      <button onClick={() => inference()}>Click me</button>
    </div>
  );
}

export default App;
