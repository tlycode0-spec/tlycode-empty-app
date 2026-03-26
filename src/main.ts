import { getAppConfig } from './config';
import { getHtmlTemplate } from './template';
import { getRouter } from './modules/router';

/** @noSelf */
export function config() {
    return getAppConfig();
}

/** @noSelf */
export function init() {
}

/** @noSelf */
export function main(request: Request): Response {
    const routerList = getRouter();

    let response: Response = { headers: {}, content: "", contentType: "text/html", status: 200 };

    // First try exact match
    const find = routerList.find(element => {
        return element.path == request.path
    });

    if (find) {
        return find.route(request, response);
    }

    response.status = 404;
    response.content = getHtmlTemplate("404 — Page Not Found", `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;">
            <div style="text-align:center;max-width:480px;">
                <div style="font-size:8rem;font-weight:800;line-height:1;margin-bottom:0.5rem;" class="text-gradient">404</div>
                <h1 style="font-size:1.5rem;font-weight:600;margin-bottom:1rem;color:var(--tf-text);">Page Not Found</h1>
                <p style="color:var(--tf-text-muted);margin-bottom:2rem;">Sorry, the page <code style="background:var(--tf-surface-light);padding:2px 8px;border-radius:4px;">${request.path}</code> does not exist.</p>
                <a href="/" class="btn btn-primary-tf">
                    <i class="bi bi-house me-2"></i>Back to Home
                </a>
            </div>
        </div>
    `);
    return response;
}
