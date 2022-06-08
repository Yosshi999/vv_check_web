import "./App.css";
import React from "react";

import { f0_data, phoneme_data } from "./data.js";

console.log(self.crossOriginIsolated);
const worker = new Worker("./static/js/worker.js");

function App() {
  React.useEffect(() => {
    const messageHandler = (e) => {
      console.log(e);
    };
    const errorHandler = (e) => {
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

  return (
    <div>
      <button onClick={() => inference()}>Click me</button>
    </div>
  );
}

export default App;
