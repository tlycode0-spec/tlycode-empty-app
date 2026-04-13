import { renderLanding } from "./app";
import { RouterPaths } from "./types";

// Router
export function getRouter(): { path: RouterPaths; route: RouteFunction, type: "action" | "render" }[] {
    return [
        {
            path: "/",
            route: renderLanding,
            type: "render"
        },
    ];
}
