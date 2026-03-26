import { REACT_JS, REACT_CSS } from "./react-bundle-content";

// =============================================================================
// Types
// =============================================================================

interface ReactComponentOptions {
    containerId?: string;
    containerClass?: string;
    containerStyle?: string;
}

interface SeoMeta {
    description?: string;
    canonicalUrl?: string;
    ogType?: string;
    ogImage?: string;
    article?: {
        publishedTime?: string;
        author?: string;
        section?: string;
    };
}

interface ReactPageOptions extends ReactComponentOptions {
    headExtra?: string;
    seo?: SeoMeta;
}

// =============================================================================
// GCS Storage for React bundle
// =============================================================================

const bundleHash = md5(REACT_JS);
const bundleStoragePath = "react-assets/react-bundle-" + bundleHash + ".js";
const cssStoragePath = "react-assets/react-bundle-" + bundleHash + ".css";

let bundleUploaded = false;
let cachedBundleUrl = "";
let cachedCssUrl = "";

/**
 * Ensure React bundle is uploaded to GCS.
 * Called lazily on first request that needs the bundle URL.
 */
function ensureBundleUploaded(): void {
    if (bundleUploaded) return;

    if (!storageExists(bundleStoragePath)) {
        storageUpload(bundleStoragePath, REACT_JS, "text/javascript");
    }

    const cssContent = REACT_CSS as string;
    if (cssContent !== "" && !storageExists(cssStoragePath)) {
        storageUpload(cssStoragePath, cssContent, "text/css");
    }

    cachedBundleUrl = storageGetUrl(bundleStoragePath);
    cachedCssUrl = storageGetUrl(cssStoragePath);
    bundleUploaded = true;
}

// Keep public export for backwards compatibility / explicit calls
export function uploadReactBundle(): void {
    ensureBundleUploaded();
}

// =============================================================================
// Helpers
// =============================================================================

function safePropsJson(props: Record<string, any>): string {
    const json = jsonEncode(props);
    // Escape </ to prevent breaking out of <script> tags
    return stringReplace(json, "</", "<\\/");
}

function getBundleUrl(): string {
    ensureBundleUploaded();
    return cachedBundleUrl;
}

function getCssUrl(): string {
    ensureBundleUploaded();
    return cachedCssUrl;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Returns <script> tags for React 18 (CDN) + the app React bundle.
 * Include once per page, before any renderReactComponent output.
 */
export function reactScripts(): string {
    return `<script src="${getBundleUrl()}" onload="document.dispatchEvent(new CustomEvent('react-bundle-loaded'))"></script>`;
}

/**
 * Renders a React component mount point with serialized props.
 * Must be used inside a page that loads the React bundle
 * (use getReactPageTemplate or include reactScripts() in the page).
 *
 * Example:
 *   const html = renderReactComponent("ProductGallery", { images: [...] });
 */
export function renderReactComponent(
    componentName: string,
    props: Record<string, any>,
    options?: ReactComponentOptions
): string {
    const containerId = (options !== undefined && options !== null && options.containerId !== undefined && options.containerId !== '')
        ? options.containerId
        : 'react-' + uniqueKey();

    const classAttr = (options !== undefined && options !== null && options.containerClass !== undefined && options.containerClass !== '')
        ? ` class="${options.containerClass}"`
        : '';

    const styleAttr = (options !== undefined && options !== null && options.containerStyle !== undefined && options.containerStyle !== '')
        ? ` style="${options.containerStyle}"`
        : '';

    const propsJson = safePropsJson(props);

    return `<div id="${containerId}"${classAttr}${styleAttr}></div>
<script>
(function(){
    function m(){
        if(window.__REACT_RENDER__){
            window.__REACT_RENDER__("${componentName}",${propsJson},"${containerId}");
        }else{
            document.addEventListener("react-bundle-loaded",function(){
                window.__REACT_RENDER__("${componentName}",${propsJson},"${containerId}");
            });
        }
    }
    if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",m);}else{m();}
})();
</script>`;
}

/**
 * Full HTML page template for React-only pages.
 * Alternative to getHtmlTemplate — includes React scripts and mounts a single component.
 *
 * Example:
 *   response.content = getReactPageTemplate("Dashboard", "AdminDashboard", { user: "Jan" });
 */
export function getReactPageTemplate(
    title: string,
    componentName: string,
    props: Record<string, any>,
    options?: ReactPageOptions
): string {
    const headExtra = (options !== undefined && options !== null && options.headExtra !== undefined && options.headExtra !== '')
        ? options.headExtra
        : '';

    const seo = (options !== undefined && options !== null && options.seo !== undefined) ? options.seo : null;

    const containerId = (options !== undefined && options !== null && options.containerId !== undefined && options.containerId !== '')
        ? options.containerId
        : 'react-root';

    const classAttr = (options !== undefined && options !== null && options.containerClass !== undefined && options.containerClass !== '')
        ? ` class="${options.containerClass}"`
        : '';

    const styleAttr = (options !== undefined && options !== null && options.containerStyle !== undefined && options.containerStyle !== '')
        ? ` style="${options.containerStyle}"`
        : '';

    const propsJson = safePropsJson(props);

    // Build SEO meta tags
    let seoTags = '';
    if (seo !== null) {
        if (seo.description !== undefined && seo.description !== '') {
            seoTags = seoTags + `\n    <meta name="description" content="${seo.description}">`;
            seoTags = seoTags + `\n    <meta property="og:description" content="${seo.description}">`;
        }
        if (seo.canonicalUrl !== undefined && seo.canonicalUrl !== '') {
            seoTags = seoTags + `\n    <link rel="canonical" href="${seo.canonicalUrl}">`;
            seoTags = seoTags + `\n    <meta property="og:url" content="${seo.canonicalUrl}">`;
        }
        const ogType = (seo.ogType !== undefined && seo.ogType !== '') ? seo.ogType : 'website';
        seoTags = seoTags + `\n    <meta property="og:type" content="${ogType}">`;
        seoTags = seoTags + `\n    <meta property="og:title" content="${title}">`;
        if (seo.ogImage !== undefined && seo.ogImage !== '') {
            seoTags = seoTags + `\n    <meta property="og:image" content="${seo.ogImage}">`;
        }
        if (seo.article !== undefined) {
            if (seo.article.publishedTime !== undefined && seo.article.publishedTime !== '') {
                seoTags = seoTags + `\n    <meta property="article:published_time" content="${seo.article.publishedTime}">`;
            }
            if (seo.article.author !== undefined && seo.article.author !== '') {
                seoTags = seoTags + `\n    <meta property="article:author" content="${seo.article.author}">`;
            }
            if (seo.article.section !== undefined && seo.article.section !== '') {
                seoTags = seoTags + `\n    <meta property="article:section" content="${seo.article.section}">`;
            }
        }
    }

    return `<!DOCTYPE html>
<html lang="cs" data-tf-theme="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>${seoTags}
    <link rel="icon" href="data:;base64,=">
    <script>
        (function(){
            var t=localStorage.getItem('tf-theme')||'dark';
            document.documentElement.setAttribute('data-tf-theme',t);
        })();
    </script>
    <style>
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;padding:0;max-width:100vw;overflow-x:hidden}
        body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;transition:background-color .3s,color .3s}
        [data-tf-theme="dark"] body{background:#0f0f17;color:#e8e8f0}
        [data-tf-theme="light"] body{background:#f8f9fc;color:#1a1a2e}
    </style>
    <link href="${getCssUrl()}" rel="stylesheet">
    ${headExtra}
</head>
<body>
    <div id="${containerId}"${classAttr}${styleAttr}></div>
    <script src="${getBundleUrl()}"></script>
    <script>window.__REACT_RENDER__("${componentName}",${propsJson},"${containerId}");</script>
</body>
</html>`;
}
