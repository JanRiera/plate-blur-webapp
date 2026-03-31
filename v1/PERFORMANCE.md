# Performance

## What Changed

- The ONNX Runtime bundle is loaded only when auto-detect is used for the first time.
- The local ONNX model is created only when auto-detect is triggered.
- Uploaded images are resized to a maximum dimension of 1200 pixels before editing and inference.
- The blur layer is cached per image and blur strength instead of being rebuilt on every render.
- Batch auto-detect and batch save run sequentially to keep memory usage predictable in the browser.

## Tradeoffs

- The first auto-detect is slower because it has to fetch and initialize the local runtime and model.
- GitHub Pages cannot provide custom cross-origin isolation headers, so the app is configured for safe single-threaded wasm behavior when needed.
- Resizing large photos before editing improves responsiveness and reduces inference cost, but it also lowers the maximum exported resolution to the in-app working size.
- AMG mode blocks export until the overlay image is available so the saved file never references a missing asset.

## Practical Notes

- Keep the ONNX model and vendor runtime files compressed in git where possible, but do not rename them.
- If batch downloads are throttled by the browser, use smaller batches or trigger `Save All` again for the remaining files.
- If faster inference is needed later, the main options are a smaller ONNX model or a host that can guarantee stronger wasm execution features than standard GitHub Pages.
