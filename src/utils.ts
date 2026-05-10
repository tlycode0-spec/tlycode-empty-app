export function getAssetUrl(path: string): string {
    // Primary: derive the asset base from frontendUrl(). It always returns
    //   <cdn>/<project>/<env>/deployments/<id>/react
    // and is per-deploy, so it stays consistent with where the deploy script
    // actually wrote the files. Cut at "/deployments/" and append
    // "/files/<path>" to land on the assets prefix.
    //
    // Why not getConfig("CDN_URL") + getConfig("PROJECT_NAME")? Some projects
    // have env_configs.PROJECT_NAME set to a user-facing slug that does not
    // match the storage bucket prefix (e.g. PROJECT_NAME=ctemespolujinak but
    // bucket=ctemespoujinak). frontendUrl() comes from the same per-deploy
    // signal that the upload uses, so it never drifts.
    if (typeof frontendUrl === 'function') {
        const fe = frontendUrl();
        if (fe !== null && fe !== '') {
            const parts = stringSplit(fe, "/deployments/");
            if (parts[0] !== undefined && parts[0] !== '') {
                return parts[0] + "/files/" + path;
            }
        }
    }

    // Fallback: explicit env_configs (older Cloud Run revisions / projects
    // without a deployed frontend bundle).
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
