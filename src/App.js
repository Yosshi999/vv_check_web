import "./App.css";
import React, { useState, useEffect } from "react";

const ort = require("onnxruntime-web");

function App() {
  const inference = async () => {
    try {
      const option = { executionProviders: ["webgl"] };
      const session = await ort.InferenceSession.create("./model.onnx", option);

      const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      const dataB = Float32Array.from([
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
      ]);
      const tensorA = new ort.Tensor("float32", dataA, [3, 4]);
      const tensorB = new ort.Tensor("float32", dataB, [4, 3]);

      const feeds = { a: tensorA, b: tensorB };

      const results = await session.run(feeds);

      const dataC = results.c.data;
      document.write(`data of result tensor 'c': ${dataC}`);
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
