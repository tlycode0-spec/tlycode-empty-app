export function getAssetUrl(path: string): string {
    const config = getConfig();
    const cdnUrl = config["CDN_URL"];
    if (cdnUrl !== undefined && cdnUrl !== null && cdnUrl !== '') {
        const project = config["PROJECT_NAME"] || 'default';
        const env = config["ENVIRONMENT"] || 'test';
        return `${cdnUrl}/${project}/${env}/files/${path}`;
    }
    let storageUrl = config["STORAGE_URL"] || '';
    if (stringEndsWith(storageUrl, '/')) {
        storageUrl = storageUrl.substring(0, storageUrl.length - 1);
    }
    const project = config["PROJECT_NAME"] || 'default';
    const env = config["ENVIRONMENT"] || 'test';
    return `${storageUrl}/${project}/${env}/files/${path}`;
}

export function getPayloudData<T = Record<string, string>>(request: Request): T {
    return parseUrlQuery<T>(request.payload ?? "");
}

export function getRouteParam(request: Request, _paramName: string): string {
    const parts = stringSplit(request.path, "/");
    return parts[parts.length - 1];
}
