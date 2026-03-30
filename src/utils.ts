import { getAppConfig } from "./config";

// ---- Flash Message Types ----

export interface FlashMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

// ---- Session Types ----

export interface SessionData {
    userId: number;
    email: string;
    role: string;
    token: string;
    flash?: FlashMessage;
}

// ---- Cookie Parsing ----

function parseCookies(cookieHeader: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (cookieHeader === undefined || cookieHeader === null || cookieHeader === '') {
        return result;
    }
    const pairs = stringSplit(cookieHeader, "; ");
    for (const pair of pairs) {
        const eqIdx = pair.indexOf("=");
        if (eqIdx > 0) {
            const key = trim(pair.substring(0, eqIdx));
            const value = trim(pair.substring(eqIdx + 1));
            result[key] = value;
        }
    }
    return result;
}

// ---- Session Management ----

export function getSession(request: Request): SessionData | null {
    const config = getAppConfig();
    const cookieHeader = request.headers["cookie"] ?? request.headers["Cookie"] ?? '';
    if (cookieHeader === '') return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies[config.session.cookieName];
    if (token === undefined || token === null || token === '') return null;

    const result = jwtVerify(token, config.session.secret);
    if (result === null || !result.valid) return null;

    return jsonDecode<SessionData>(result.data);
}

export function setSession(data: SessionData, response: Response): Response {
    const config = getAppConfig();
    const ttlSeconds = config.session.ttlMinutes * 60;
    const token = jwtSign(jsonEncode(data), config.session.secret, ttlSeconds);
    response.headers["Set-Cookie"] = config.session.cookieName + "=" + token + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + String(ttlSeconds);
    return response;
}

export function clearSession(response: Response): Response {
    const config = getAppConfig();
    response.headers["Set-Cookie"] = config.session.cookieName + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
    return response;
}

export function refreshSessionIfNeeded(request: Request, response: Response): Response {
    const config = getAppConfig();
    const cookieHeader = request.headers["cookie"] ?? request.headers["Cookie"] ?? '';
    if (cookieHeader === '') return response;

    const cookies = parseCookies(cookieHeader);
    const token = cookies[config.session.cookieName];
    if (token === undefined || token === null || token === '') return response;

    const result = jwtVerify(token, config.session.secret);
    if (result === null || !result.valid) return response;

    const thresholdSeconds = config.session.refreshThresholdMinutes * 60;
    if (result.remainingSeconds < thresholdSeconds) {
        const data = jsonDecode<SessionData>(result.data);
        response = setSession(data, response);
    }
    return response;
}

// ---- Flash Messages ----

export function setFlash(type: FlashMessage['type'], message: string, request: Request, response: Response): Response {
    const session = getSession(request);
    if (session === null) return response;
    session.flash = { type, message };
    return setSession(session, response);
}

// ---- Asset URL ----

export function getAssetUrl(path: string): string {
    const config = getConfig();
    const baseUrl = config["CDN_URL"] || config["STORAGE_URL"] || '';
    return `${baseUrl}/${path}`;
}

// ---- Form Data ----

export function getPayloudData<T = Record<string, string>>(request: Request): T {
    return parseUrlQuery<T>(request.payload ?? "");
}

// ---- Route Params ----

export function getRouteParam(request: Request, _paramName: string): string {
    const parts = stringSplit(request.path, "/");
    return parts[parts.length - 1];
}
