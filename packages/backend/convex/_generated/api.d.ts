/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as chats from "../chats.js";
import type * as email from "../email.js";
import type * as folders from "../folders.js";
import type * as healthCheck from "../healthCheck.js";
import type * as inspirations from "../inspirations.js";
import type * as privateData from "../privateData.js";
import type * as seed from "../seed.js";
import type * as templates from "../templates.js";
import type * as todos from "../todos.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  chats: typeof chats;
  email: typeof email;
  folders: typeof folders;
  healthCheck: typeof healthCheck;
  inspirations: typeof inspirations;
  privateData: typeof privateData;
  seed: typeof seed;
  templates: typeof templates;
  todos: typeof todos;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
