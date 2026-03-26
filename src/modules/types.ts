import { WebRouterPaths, type ApiRouterPaths } from "./router.types";

type WithPrefix<T extends string, P extends string> = `${P}${T}`;

// příklad: přidání prefixu "/test" ke všem RouterPaths
export type RouterPaths = WithPrefix<ApiRouterPaths, "/api"> | WebRouterPaths;