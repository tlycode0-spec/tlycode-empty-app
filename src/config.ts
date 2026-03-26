// App configuration — reads DATABASE_URL and REDIS_URL from runtime env configs
export function getAppConfig(): Config {
    return {
        microCache: { maxEntries: 100, ttl: 25 },
        postgresql: { enable: false, url: getConfig("DATABASE_URL") ?? "" },
        redis: { enable: false, url: getConfig("REDIS_URL") ?? "" },
        session: {
            secret:  getConfig("REDIS_URL") ??"unused",
            ttlMinutes: 15,
            cookieName: "session_token",
            refreshThresholdMinutes: 5
        },
        uploadTempDir: "/tmp",
        maxUploadFileSize: 10 * 1024 * 1024,
        migrations: [],
        seeds: [],
        resend: {
            apiSecret: getConfig("RESEND_API_KEY") ?? "",
            enable: true
        }
    }
}
