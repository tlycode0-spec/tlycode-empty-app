import { getReactPageTemplate } from "../../../react";

export function renderHello(request: Request, response: Response): Response {
    response.content = getReactPageTemplate('Hello World', "HelloWorld", {});
    return response;
}
