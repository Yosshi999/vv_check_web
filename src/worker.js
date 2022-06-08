const ort = require("onnxruntime-web");

let session = undefined;
console.log(self.crossOriginIsolated);
const process = async () => {
  ort.env.wasm.wasmPaths = {
    "ort-wasm-threaded.wasm": "/static/js/ort-wasm-threaded.wasm",
    "ort-wasm-simd.wasm": "/static/js/ort-wasm-simd.wasm",
    "ort-wasm-simd-threaded.wasm": "/static/js/ort-wasm-simd-threaded.wasm",
  };
  const option = {
    // executionProviders: ["webgl"],
    executionProviders: ["wasm"],
  };
  session = await ort.InferenceSession.create("../../decode.onnx", option);
};

process();

addEventListener("message", async (e) => {
  try {
    const { f0_data, phoneme_data } = e.data;
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
    postMessage(`data of result length: ${output.length}`);
  } catch (e) {
    postMessage(`failed to inference ONNX model: ${e}.`);
  }
});
