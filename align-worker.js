/* Speech recognition worker for audio ⇄ transcript alignment (Whisper tiny, runs fully on device). */
import { pipeline, env } from "./vendor/transformers.min.js";
const base = new URL("./", self.location.href).href;
env.allowLocalModels = true; env.localModelPath = base + "models/";
env.allowRemoteModels = true; env.useBrowserCache = false;
env.backends.onnx.wasm.wasmPaths = base + "vendor/ort/";
env.backends.onnx.wasm.proxy = false;
let asr = null, loading = null;
function load() {
  if (asr) return Promise.resolve(asr);
  if (!loading) loading = pipeline("automatic-speech-recognition", "Xenova/whisper-tiny", {
    dtype: { encoder_model: "q8", decoder_model_merged: "q8" }, device: "wasm",
    progress_callback: p => { if (p.status === "progress" && p.total) postMessage({ type: "dl", file: p.file, loaded: p.loaded, total: p.total }); },
  }).then(p => (asr = p));
  return loading;
}
self.onmessage = async e => {
  const m = e.data;
  try {
    if (m.type === "load") { await load(); postMessage({ type: "ready" }); return; }
    if (m.type === "run") {
      await load();
      const out = await asr(m.pcm, Object.assign({ language: "english", task: "transcribe", return_timestamps: true, max_new_tokens: 220 }, m.opts || {}));
      postMessage({ type: "res", id: m.id, chunks: (out.chunks || []).map(c => ({ t: c.timestamp, x: c.text })), text: out.text });
    }
  } catch (err) { postMessage({ type: "err", id: m.id, msg: String((err && err.message) || err) }); }
};
