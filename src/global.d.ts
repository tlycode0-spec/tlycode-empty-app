/** @noSelf */
declare function clearMicroCache(): void;

/** @noSelf */
declare function fileRead(path: string): string;

/** Lua native file handle for binary file operations */
interface LuaFileHandle {
    read(format: string): string;
    close(): void;
}

/** Lua native io module - use for binary file reads (fileRead validates UTF-8) */
declare namespace io {
    /** @noSelf */
    function open(path: string, mode?: string): LuaFileHandle | null;
}

/** @noSelf */
declare function fileWrite(path: string, content: string): void;

/** @noSelf */
declare function fileDelete(path: string): void;

/** @noSelf */
declare function fileCopy(src: string, dst: string): void;

/** @noSelf */
declare function fileMove(src: string, dst: string): void;

/** @noSelf */
declare function fileContentType(path: string): string;

/** @noSelf */
declare function dirList(path: string): Promise<string[]>;

/** @noSelf */
declare function isDir(path: string): Promise<boolean>;

/** @noSelf */
declare function isFile(path: string): Promise<boolean>;

/** @noSelf */
declare function print(text:any): string;

/** @noSelf */
declare function httpGet(url: string, headers?: Record<string, string>): string;

/** @noSelf */
declare function httpPost(url: string, body: string, headers?: Record<string, string>): string;

/** @noSelf */
declare function httpRequest(options: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
    headers?: Record<string, string>;
    body?: string;
    timeout?: number;
}): { status: number; headers: Record<string, string>; body: string };

/** @noSelf */
declare function sqlQuery<T>(query: string, arguments: any): T[];

/** @noSelf */
declare function jsonEncode<T>(value: T): string;

/** @noSelf */
declare function jsonDecode<T>(value: string): T;

/** @noSelf */
declare function urlEncode(value: string): string;

/** @noSelf */
declare function urlDecode(value: string): string;

/** @noSelf */
declare function parseUrl(value: string): { scheme: string; host: string; port: number; path: string; query: string; fragment: string; userinfo: string };

/** @noSelf */
declare function parseUrlQuery<T = Record<string, string>>(query: string): T;

/** @noSelf */
declare function html(query: string): string;

/** @noSelf */
declare function appCacheGet(key: string): string | null;

/** @noSelf */
declare function appCacheSet(key: string, value: string, ttl: number): void;

/** @noSelf */
declare function appCacheRemove(key: string): void;

/** @noSelf */
declare function uniqueKey(): string;

/** @noSelf */
declare function buildUrlQuery<T>(params: Record<string, T>): string;

// --- Crypto ---

/** @noSelf */
declare function hashPassword(password: string): string;

/** @noSelf */
declare function verifyPassword(password: string, hash: string): boolean;

/** @noSelf */
declare function hmacSha256(data: string, secret: string): string;

/** @noSelf */
declare function sha256(data: string): string;

/** @noSelf */
declare function md5(data: string): string;

/** @noSelf */
declare function randomBytes(length: number): string;

/** @noSelf */
declare function base64Encode(data: string): string;

/** @noSelf */
declare function base64Decode(data: string): string;

/** @noSelf */
declare function base64UrlEncode(data: string): string;

/** @noSelf */
declare function base64UrlDecode(data: string): string;

// --- JWT ---

/**
 * Creates a JWT token with HS256 algorithm
 * @param payload JSON string with payload data
 * @param secret Secret key for signing
 * @param ttlSeconds Token TTL in seconds
 * @returns Signed JWT token string
 * @noSelf
 */
declare function jwtSign(payload: string, secret: string, ttlSeconds: number): string;

/**
 * Verifies JWT signature and returns payload info
 * @param token JWT token string
 * @param secret Secret key for verification
 * @returns Object with payload and status, or null if signature invalid
 * @noSelf
 */
declare function jwtVerify(token: string, secret: string): {
    data: string;           // JSON string with payload data
    exp: number;            // Expiration timestamp (Unix)
    iat: number;            // Issued at timestamp (Unix)
    valid: boolean;         // true if not expired
    expired: boolean;       // true if expired
    remainingSeconds: number; // seconds until expiration (0 if expired)
} | null;

/**
 * Decodes JWT WITHOUT verifying signature (for debugging only)
 * @param token JWT token string
 * @returns Decoded payload or null if malformed
 * @noSelf
 */
declare function jwtDecode(token: string): {
    data: string;
    exp: number;
    iat: number;
    expired: boolean;
    remainingSeconds: number;
} | null;

// --- Email ---

/** @noSelf */
declare function sendEmail(options: {
    to: string;
    from: string;
    subject: string;
    body: string;
    htmlBody?: string;
    replyTo?: string;
    cc?: string;
    bcc?: string;
    smtpHost: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    smtpTls?: boolean;
}): boolean;

// --- DateTime ---

/** @noSelf */
declare function now(): number;

/** @noSelf */
declare function nowMillis(): number;

/** @noSelf */
declare function dateFormat(timestamp: number, format: string): string;

/** @noSelf */
declare function dateParse(dateStr: string, format: string): number;

/** @noSelf */
declare function dateAdd(timestamp: number, amount: number, unit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months"): number;

/** @noSelf */
declare function dateDiff(ts1: number, ts2: number, unit: "seconds" | "minutes" | "hours" | "days" | "weeks"): number;

/** @noSelf */
declare function dateToISO(timestamp: number): string;

/** @noSelf */
declare function dateFromISO(isoStr: string): number;

// --- Logging ---

/** @noSelf */
declare function logInfo(message: string, data?: any): void;

/** @noSelf */
declare function logWarn(message: string, data?: any): void;

/** @noSelf */
declare function logError(message: string, data?: any): void;

/** @noSelf */
declare function logDebug(message: string, data?: any): void;

// --- String Utils ---

/** @noSelf */
declare function slugify(text: string): string;

/** @noSelf */
declare function trim(text: string): string;

/** @noSelf */
declare function toLower(text: string): string;

/** @noSelf */
declare function toUpper(text: string): string;

/** @noSelf */
declare function regexMatch(text: string, pattern: string): string[] | null;

/** @noSelf */
declare function regexMatchAll(text: string, pattern: string): string[][];

/** @noSelf */
declare function regexReplace(text: string, pattern: string, replacement: string): string;

/** @noSelf */
declare function regexTest(text: string, pattern: string): boolean;

/** @noSelf */
declare function stringSplit(text: string, delimiter: string): string[];

/** @noSelf */
declare function stringContains(text: string, search: string): boolean;

/** @noSelf */
declare function stringStartsWith(text: string, prefix: string): boolean;

/** @noSelf */
declare function stringEndsWith(text: string, suffix: string): boolean;

/** @noSelf */
declare function stringReplace(text: string, search: string, replacement: string): string;

/** @noSelf */
declare function stringPad(text: string, length: number, padChar?: string, direction?: "left" | "right"): string;

// --- Number Utils ---

/** @noSelf */
declare function round(num: number, decimals?: number): number;

/** @noSelf */
declare function ceil(num: number): number;

/** @noSelf */
declare function floor(num: number): number;

/** @noSelf */
declare function abs(num: number): number;

/** @noSelf */
declare function mathMin(a: number, b: number): number;

/** @noSelf */
declare function mathMax(a: number, b: number): number;

/** @noSelf */
declare function clamp(value: number, min: number, max: number): number;

/** @noSelf */
declare function formatNumber(num: number, decimals: number, decimalSep?: string, thousandsSep?: string): string;

/** @noSelf */
declare function formatCurrency(amount: number, currency: string, locale?: string): string;

// --- Image ---

/** @noSelf */
declare function imageResize(srcPath: string, dstPath: string, width: number, height?: number): void;

/** @noSelf */
declare function imageThumbnail(srcPath: string, dstPath: string, size: number): void;

/** @noSelf */
declare function imageInfo(path: string): { width: number; height: number; format: string };

// --- PDF ---

/** @noSelf */
declare function generatePdf(htmlContent: string, outputPath: string): void;

// --- Redis: Key/Value ---

/** @noSelf */
declare function redisGet(key: string): string | null;

/** @noSelf */
declare function redisSet(key: string, value: string, ttl?: number): void;

/** @noSelf */
declare function redisDel(key: string): number;

/** @noSelf */
declare function redisExists(key: string): boolean;

/** @noSelf */
declare function redisExpire(key: string, seconds: number): boolean;

/** @noSelf */
declare function redisTtl(key: string): number;

/** @noSelf */
declare function redisKeys(pattern: string): string[];

/** @noSelf */
declare function redisIncr(key: string): number;

/** @noSelf */
declare function redisIncrBy(key: string, amount: number): number;

/** @noSelf */
declare function redisDecr(key: string): number;

/** @noSelf */
declare function redisMget(keys: string[]): (string | null)[];

/** @noSelf */
declare function redisMset(pairs: Record<string, string>): void;

// --- Redis: Hash ---

/** @noSelf */
declare function redisHget(key: string, field: string): string | null;

/** @noSelf */
declare function redisHset(key: string, field: string, value: string): void;

/** @noSelf */
declare function redisHdel(key: string, field: string): number;

/** @noSelf */
declare function redisHgetAll(key: string): Record<string, string>;

/** @noSelf */
declare function redisHexists(key: string, field: string): boolean;

/** @noSelf */
declare function redisHkeys(key: string): string[];

/** @noSelf */
declare function redisHvals(key: string): string[];

/** @noSelf */
declare function redisHlen(key: string): number;

/** @noSelf */
declare function redisHmset(key: string, fields: Record<string, string>): void;

/** @noSelf */
declare function redisHincrBy(key: string, field: string, amount: number): number;

// --- Redis: List ---

/** @noSelf */
declare function redisLpush(key: string, value: string): number;

/** @noSelf */
declare function redisRpush(key: string, value: string): number;

/** @noSelf */
declare function redisLpop(key: string): string | null;

/** @noSelf */
declare function redisRpop(key: string): string | null;

/** @noSelf */
declare function redisLrange(key: string, start: number, stop: number): string[];

/** @noSelf */
declare function redisLlen(key: string): number;

/** @noSelf */
declare function redisLindex(key: string, index: number): string | null;

/** @noSelf */
declare function redisLset(key: string, index: number, value: string): void;

// --- Redis: Set ---

/** @noSelf */
declare function redisSadd(key: string, member: string): number;

/** @noSelf */
declare function redisSrem(key: string, member: string): number;

/** @noSelf */
declare function redisSmembers(key: string): string[];

/** @noSelf */
declare function redisSismember(key: string, member: string): boolean;

/** @noSelf */
declare function redisScard(key: string): number;

// --- Redis: Sorted Set ---

/** @noSelf */
declare function redisZadd(key: string, score: number, member: string): number;

/** @noSelf */
declare function redisZrem(key: string, member: string): number;

/** @noSelf */
declare function redisZrange(key: string, start: number, stop: number): string[];

/** @noSelf */
declare function redisZrangeWithScores(key: string, start: number, stop: number): { member: string; score: number }[];

/** @noSelf */
declare function redisZrevrange(key: string, start: number, stop: number): string[];

/** @noSelf */
declare function redisZscore(key: string, member: string): number | null;

/** @noSelf */
declare function redisZcard(key: string): number;

/** @noSelf */
declare function redisZrank(key: string, member: string): number | null;

/** @noSelf */
declare function redisZincrBy(key: string, amount: number, member: string): number;

// --- Redis: Pub/Sub ---

/** @noSelf */
declare function redisPublish(channel: string, message: string): number;

// --- Redis: Utility ---

/** @noSelf */
declare function redisFlushDb(): void;

/** @noSelf */
declare function redisDbSize(): number;

/** @noSelf */
declare function redisPing(): string;

// --- Env Config ---

/** Returns a single config/secret value by key, or null if not found @noSelf */
declare function getConfig(key: string): string | null;

/** Returns all configs and secrets as a key-value object @noSelf */
declare function getConfig(): Record<string, string>;

// --- Cloud Storage (GCS) ---

/**
 * Upload a file to cloud storage
 * @param path - Path in storage (e.g., "images/photo.jpg")
 * @param content - File content as string
 * @param contentType - Optional MIME type (auto-detected from path if not provided)
 * @returns Object path in GCS
 * @noSelf
 */
declare function storageUpload(path: string, content: string, contentType?: string): string;

/**
 * Upload binary data to cloud storage
 * @param path - Path in storage (e.g., "images/photo.jpg")
 * @param bytes - Array of byte values (0-255)
 * @param contentType - Optional MIME type (auto-detected from path if not provided)
 * @returns Object path in GCS
 * @noSelf
 */
declare function storageUploadBytes(path: string, bytes: number[], contentType?: string): string;

/**
 * Download a file from cloud storage
 * @param path - Path in storage
 * @returns File content as string
 * @noSelf
 */
declare function storageDownload(path: string): string;

/**
 * Delete a file from cloud storage
 * @param path - Path in storage
 * @returns true if deleted
 * @noSelf
 */
declare function storageDelete(path: string): boolean;

/**
 * Get public URL for a file in cloud storage
 * Note: The bucket must have public access enabled for this URL to work
 * @param path - Path in storage
 * @returns Public HTTPS URL
 * @noSelf
 */
declare function storageGetUrl(path: string): string;

/**
 * Get a signed URL for temporary access to a file
 * @param path - Path in storage
 * @param expiresInSeconds - URL validity duration (default: 3600 = 1 hour)
 * @returns Signed HTTPS URL with authentication
 * @noSelf
 */
declare function storageGetSignedUrl(path: string, expiresInSeconds?: number): string;

/**
 * List files in cloud storage
 * @param prefix - Optional path prefix to filter results
 * @returns Array of file paths (relative to files/ directory)
 * @noSelf
 */
declare function storageList(prefix?: string): string[];

/**
 * Check if a file exists in cloud storage
 * @param path - Path in storage
 * @returns true if file exists
 * @noSelf
 */
declare function storageExists(path: string): boolean;
