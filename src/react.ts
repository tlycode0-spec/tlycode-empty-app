// React bundle URLs are provided at runtime by the platform via:
//   frontendUrl(), frontendEntryUrl(), frontendCssUrl()
// The hosting service uploads react-app/dist/ contents per-deployment and injects
// REACT_BUNDLE_GCS_URL / REACT_BUNDLE_CDN_URL / REACT_BUNDLE_ENTRY / REACT_BUNDLE_CSS
// env vars into the Cloud Run service.

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
    keywords?: string;
    siteName?: string;
    locale?: string;
    twitterCard?: string;
    author?: string;
    noindex?: boolean;
    jsonLd?: string[];
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
// Helpers
// =============================================================================

function safePropsJson(props: Record<string, any>): string {
    const json = jsonEncode(props);
    return stringReplace(json, "</", "<\\/");
}

function getBundleUrl(): string {
    if (typeof frontendEntryUrl !== 'function') return "";
    const url = frontendEntryUrl();
    return url !== null ? url : "";
}

function getCssUrl(): string {
    if (typeof frontendCssUrl !== 'function') return "";
    const url = frontendCssUrl();
    return url !== null ? url : "";
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Returns <script> tag for the React app bundle.
 * Include once per page, before any renderReactComponent output.
 */
export function reactScripts(): string {
    const bundleUrl = getBundleUrl();
    if (bundleUrl === "") return "";
    return `<script src="${bundleUrl}" onload="document.dispatchEvent(new CustomEvent('react-bundle-loaded'))"></script>`;
}

/**
 * Renders a React component mount point with serialized props.
 * Must be used inside a page that loads the React bundle
 * (use getReactPageTemplate or include reactScripts() in the page).
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

    let seoTags = '';
    let jsonLdBlocks = '';
    if (seo !== null) {
        if (seo.description !== undefined && seo.description !== '') {
            seoTags = seoTags + `\n    <meta name="description" content="${seo.description}">`;
            seoTags = seoTags + `\n    <meta property="og:description" content="${seo.description}">`;
            seoTags = seoTags + `\n    <meta name="twitter:description" content="${seo.description}">`;
        }
        if (seo.keywords !== undefined && seo.keywords !== '') {
            seoTags = seoTags + `\n    <meta name="keywords" content="${seo.keywords}">`;
        }
        if (seo.author !== undefined && seo.author !== '') {
            seoTags = seoTags + `\n    <meta name="author" content="${seo.author}">`;
        }
        if (seo.noindex === true) {
            seoTags = seoTags + `\n    <meta name="robots" content="noindex,nofollow">`;
        } else {
            seoTags = seoTags + `\n    <meta name="robots" content="index,follow,max-image-preview:large">`;
        }
        if (seo.canonicalUrl !== undefined && seo.canonicalUrl !== '') {
            seoTags = seoTags + `\n    <link rel="canonical" href="${seo.canonicalUrl}">`;
            seoTags = seoTags + `\n    <meta property="og:url" content="${seo.canonicalUrl}">`;
        }
        const ogType = (seo.ogType !== undefined && seo.ogType !== '') ? seo.ogType : 'website';
        seoTags = seoTags + `\n    <meta property="og:type" content="${ogType}">`;
        seoTags = seoTags + `\n    <meta property="og:title" content="${title}">`;
        seoTags = seoTags + `\n    <meta name="twitter:title" content="${title}">`;
        const siteName = (seo.siteName !== undefined && seo.siteName !== '') ? seo.siteName : '';
        if (siteName !== '') {
            seoTags = seoTags + `\n    <meta property="og:site_name" content="${siteName}">`;
        }
        const locale = (seo.locale !== undefined && seo.locale !== '') ? seo.locale : 'cs_CZ';
        seoTags = seoTags + `\n    <meta property="og:locale" content="${locale}">`;
        if (seo.ogImage !== undefined && seo.ogImage !== '') {
            seoTags = seoTags + `\n    <meta property="og:image" content="${seo.ogImage}">`;
            seoTags = seoTags + `\n    <meta property="og:image:alt" content="${title}">`;
            seoTags = seoTags + `\n    <meta name="twitter:image" content="${seo.ogImage}">`;
        }
        const twitterCard = (seo.twitterCard !== undefined && seo.twitterCard !== '') ? seo.twitterCard : 'summary_large_image';
        seoTags = seoTags + `\n    <meta name="twitter:card" content="${twitterCard}">`;
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
        if (seo.jsonLd !== undefined) {
            for (const block of seo.jsonLd) {
                jsonLdBlocks = jsonLdBlocks + "\n    " + block;
            }
        }
    }

    const cssUrl = getCssUrl();
    const cssLink = cssUrl !== "" ? `<link href="${cssUrl}" rel="stylesheet">` : '';
    const bundleUrl = getBundleUrl();
    const bundleScript = bundleUrl !== "" ? `<script src="${bundleUrl}"></script>` : '';

    return `<!DOCTYPE html>
<html lang="cs" data-tf-theme="light">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>${seoTags}${jsonLdBlocks}
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-size='90'>📖</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
    <script>
        (function(){
            var t=localStorage.getItem('tf-theme')||'light';
            document.documentElement.setAttribute('data-tf-theme',t);
        })();
    </script>
    <style>
        *,*::before,*::after{box-sizing:border-box}
        html{scroll-behavior:smooth}
        @media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
        html,body{margin:0;padding:0;max-width:100vw;overflow-x:hidden}
        body{font-family:'Open Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;transition:background-color .3s,color .3s}
        [data-tf-theme="dark"] body{background:#1a1a1a;color:#f0f0f0}
        [data-tf-theme="light"] body{background:#ffffff;color:#222222}
    </style>
    ${cssLink}
    ${headExtra}
</head>
<body>
    <div id="${containerId}"${classAttr}${styleAttr}></div>
    ${bundleScript}
    <script>window.__REACT_RENDER__("${componentName}",${propsJson},"${containerId}");</script>
</body>
</html>`;
}
