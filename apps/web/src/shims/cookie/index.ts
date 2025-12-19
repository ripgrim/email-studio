// Shim for cookie package to handle ESM/CJS interop
// Re-export the cookie package functions as ESM
// Import using the actual package - Vite will transform CommonJS to ESM
// @ts-ignore - cookie is CommonJS, Vite will transform it
import * as cookieModule from "cookie";

export const parse = cookieModule.parse;
export const serialize = cookieModule.serialize;


