// React 19 has useSyncExternalStore built-in
// This shim fixes ESM/CJS interop issues with Bun + Vite
export { useSyncExternalStore } from "react";

