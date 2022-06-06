import "./App.css";
import React, { useState, useEffect } from "react";

import { f0_data, phoneme_data } from "./data.js";

const ort = require("onnxruntime-web");

function App() {
  let session = undefined;
  const process = async () => {
    const option = {
      // executionProviders: ["webgl"],
      executionProviders: ["wasm"],
    };
    session = await ort.InferenceSession.create("./decode.onnx", option);
  };
  process();

  const inference = async () => {
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
      // {
      //   // yukarin_s
      //   const option = {
      //     // executionProviders: ["webgl"]
      //   };
      //   const session = await ort.InferenceSession.create(
      //     "./yukarin_s.onnx",
      //     option
      //   );

      //   const length = 38;
      //   const phoneme_list_data = BigInt64Array.from(
      //     [
      //       0, 23, 30, 4, 28, 21, 10, 21, 42, 7, 0, 30, 4, 35, 14, 14, 16, 30,
      //       30, 35, 14, 14, 28, 30, 35, 14, 23, 7, 21, 14, 43, 30, 30, 23, 30,
      //       35, 30, 0,
      //     ].map((x) => BigInt(x))
      //   );
      //   const speaker_id_data = BigInt64Array.from([1].map((x) => BigInt(x)));
      //   const phoneme_list = new ort.Tensor("int64", phoneme_list_data, [
      //     length,
      //   ]);
      //   const speaker_id = new ort.Tensor("int64", speaker_id_data, [1]);

      //   const feeds = { phoneme_list, speaker_id };
      //   const results = await session.run(feeds);

      //   const output = results.phoneme_length.data;
      //   console.log(`data of result: ${output}`);
      // }
    } catch (e) {
      document.write(`failed to inference ONNX model: ${e}.`);
    }
  };

  return (
    <div>
      <button onClick={() => inference()}>Click me</button>
    </div>
  );
}

export default App;
