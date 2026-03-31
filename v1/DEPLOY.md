# Deploy

1. Publish the contents of `v1` as a static GitHub Pages site. The folder can be copied to the repository root, copied into `/docs`, or uploaded by a GitHub Pages workflow.
2. Keep the file and folder names exactly as they are. `assets/AMG-overlay.png` must keep that exact casing on Linux and on GitHub Pages.
3. Do not add a backend, rewrite rules, or a build step. The app is fully client-side and uses only static files.
4. Keep all files together so these relative paths stay valid:
   - `./styles.css`
   - `./app.js`
   - `./assets/AMG-overlay.png`
   - `./models/license-plate-finetune-v1s.onnx`
   - `./vendor/onnxruntime-web/ort.wasm.min.js`
   - `./vendor/onnxruntime-web/ort-wasm-simd-threaded.mjs`
   - `./vendor/onnxruntime-web/ort-wasm-simd-threaded.wasm`
5. A project subpage such as `/plate-blur-webapp-exp/` works because every asset, script, model, and runtime dependency is loaded through relative URLs instead of root-relative URLs.
6. GitHub Pages serves the app as static content only. Auto-detect runs in the browser and the ONNX model stays inside the repository.

# Checklist

- `index.html` links `./styles.css` and `./app.js`
- `app.js` resolves overlay, model, and runtime files from `import.meta.url`
- `vendor/onnxruntime-web` is committed with the JS and wasm assets
- `models/license-plate-finetune-v1s.onnx` is committed locally
- No API calls or backend services are required
