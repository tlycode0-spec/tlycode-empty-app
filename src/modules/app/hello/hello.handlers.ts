import { getReactPageTemplate } from "../../../react";

export function renderLanding(request: Request, response: Response): Response {
    const config = getConfig();

    response.content = getReactPageTemplate('Hello World', "Hello", {});
    return response;
}
