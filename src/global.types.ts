// běžně používané content types
type ContentType =
  | "application/json"
  | "application/xml"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain"
  | "text/html"
  | "text/css"
  | "text/javascript"
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "audio/mpeg"
  | "audio/ogg"
  | "video/mp4"
  | "video/webm"
  | "application/pdf"
  | (string & {});

  type HttpStatusCode =
  | 100 | 101 | 102 | 103
  | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
  | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308
  | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 
  | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 
  | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451
  | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

interface Request {
    path: string
    method: HttpMethod
    headers: Record<string, string>,
    payload?: string
    query: string
    files: Record<string, string[]>,
    clientIP: string,
    host: string,
    fullUrl: string
}

interface Response {
    content: string
    contentType: ContentType
    status: HttpStatusCode
    headers: Record<string, string>
}

interface ResponseStatus {
    status: string
}

interface ResponseData<T> {
    status: string
    data: T
}

interface SessionConfig {
    /** Secret key for JWT signing (use strong random value in production) */
    secret: string
    /** Session TTL in minutes (default: 15) */
    ttlMinutes: number
    /** Cookie name for session token (default: "session_token") */
    cookieName: string
    /** Refresh token if remaining time is less than this (minutes, default: 5) */
    refreshThresholdMinutes: number
}

interface Config {
    microCache: MicroCacheConfig
    postgresql: PostgresqeConfig
    redis: RedisConfig
    session: SessionConfig
    uploadTempDir: string
    maxUploadFileSize: number // bytes
    migrations?: Migration[]
    seeds?: Seed[],
    resend: ResendConfig
}

interface Migration {
    version: number
    name: string
    up: string  // SQL to run
}

interface Seed {
    version: number
    name: string
    up: string  // SQL to run (multi-statement, split by ;)
    run?: () => void  // Optional: run function instead of SQL (when dynamic values like hashPassword are needed)
}

interface PostgresqeConfig {
    enable: boolean
    url: string
}

interface ResendConfig {
    apiSecret: string
    enable: boolean
}


interface RedisConfig {
    enable: boolean
    url: string
}

interface MicroCacheConfig {
    ttl: number  // ms
    maxEntries: number
}

interface CookieOptions {
    expires?: Date
    maxAge?: number
    path?: string
    domain?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: "Strict" | "Lax" | "None";
}

type RouteFunction = (request: Request, response: Response) => Response