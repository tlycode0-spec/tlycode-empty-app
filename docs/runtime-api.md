# Runtime API Reference

All functions are globally available (declared in `src/global.d.ts` with `@noSelf` annotation). No imports needed.

## Database

```typescript
sqlQuery<T>(query: string, params: any[]): T[]
```

**Important casts** (see [TSTL Gotchas](./tstl-gotchas.md)):
- DECIMAL columns: `price::float as price`
- TIMESTAMP columns: `created_at::text as created_at`
- NULL params: use `NULLIF($N, 0)` pattern

## File I/O

```typescript
fileRead(path: string): string
fileWrite(path: string, content: string): void
fileDelete(path: string): void
fileCopy(src: string, dest: string): void
fileMove(src: string, dest: string): void
dirList(path: string): string[]
```

## Cloud Storage

```typescript
storageUpload(bucket: string, path: string, localPath: string): void
storageUploadBytes(bucket: string, path: string, data: string, contentType: string): void
storageDownload(bucket: string, path: string): string
storageDelete(bucket: string, path: string): void
storageGetUrl(bucket: string, path: string): string
storageGetSignedUrl(bucket: string, path: string, expiresSeconds: number): string
storageList(bucket: string, prefix: string): string[]
storageExists(bucket: string, path: string): boolean
```

## HTTP Client

```typescript
httpGet(url: string, headers?: Record<string, string>): HttpResponse
httpPost(url: string, body: string, headers?: Record<string, string>): HttpResponse
httpRequest(method: string, url: string, body?: string, headers?: Record<string, string>): HttpResponse
```

## Cache

```typescript
appCacheGet(key: string): string | null
appCacheSet(key: string, value: string, ttlMs: number): void
appCacheRemove(key: string): void
clearMicroCache(): void
```

## JSON

```typescript
jsonEncode(value: any): string
jsonDecode<T>(json: string): T
```

## URL

```typescript
urlEncode(value: string): string
urlDecode(value: string): string
parseUrl(url: string): ParsedUrl
parseUrlQuery(query: string): Record<string, string>
buildUrlQuery(params: Record<string, string>): string
```

## Crypto

```typescript
hashPassword(password: string): string
verifyPassword(password: string, hash: string): boolean
sha256(data: string): string
md5(data: string): string
hmacSha256(data: string, key: string): string
base64Encode(data: string): string
base64Decode(data: string): string
base64UrlEncode(data: string): string
base64UrlDecode(data: string): string
randomBytes(length: number): string
```

## JWT

```typescript
jwtSign(payload: any, secret: string, expiresIn?: number): string
jwtVerify<T>(token: string, secret: string): T | null
jwtDecode<T>(token: string): T | null
```

## Date/Time

```typescript
now(): number              // Unix timestamp (seconds)
nowMillis(): number        // Unix timestamp (milliseconds)
dateFormat(timestamp: number, format: string): string
dateParse(dateStr: string, format: string): number
dateAdd(timestamp: number, amount: number, unit: string): number
dateDiff(ts1: number, ts2: number, unit: string): number
dateToISO(timestamp: number): string
dateFromISO(isoStr: string): number
```

**Note**: Use `YYYY-MM-DD HH:mm:ss` format tokens. For reliability, prefer manual substring parsing for PostgreSQL dates.

## Logging

```typescript
logInfo(message: string): void
logWarn(message: string): void
logError(message: string): void
logDebug(message: string): void
```

## String

```typescript
trim(text: string): string
toLower(text: string): string
toUpper(text: string): string
slugify(text: string): string
stringSplit(text: string, delimiter: string): string[]
stringContains(text: string, search: string): boolean
stringStartsWith(text: string, prefix: string): boolean
stringEndsWith(text: string, suffix: string): boolean
stringReplace(text: string, search: string, replacement: string): string
stringPad(text: string, length: number, char?: string): string
```

## Regex

```typescript
regexTest(pattern: string, text: string): boolean
regexMatch(pattern: string, text: string): string | null
regexMatchAll(pattern: string, text: string): string[]
regexReplace(pattern: string, text: string, replacement: string): string
```

## Math

```typescript
round(value: number, decimals?: number): number
ceil(value: number): number
floor(value: number): number
abs(value: number): number
mathMin(...values: number[]): number
mathMax(...values: number[]): number
clamp(value: number, min: number, max: number): number
formatNumber(value: number, decimals?: number): string
formatCurrency(value: number, currency?: string): string
```

## Redis

Full Redis support: strings, hashes, lists, sets, sorted sets, pub/sub.

## Email

```typescript
sendEmail(to: string, subject: string, body: string, options?: EmailOptions): void
```

## Images

```typescript
imageResize(inputPath: string, outputPath: string, width: number, height?: number): void
imageThumbnail(inputPath: string, outputPath: string, size: number): void
imageInfo(path: string): ImageInfo
```

## PDF

```typescript
generatePdf(html: string, options?: PdfOptions): string  // returns file path
```

## Config & Utils

```typescript
getConfig(key?: string): string | null   // read environment variable
uniqueKey(): string                       // generate unique identifier
```
