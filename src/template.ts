export function getThemeDetectScript(): string {
    return `<script>
        (function() {
            var theme = localStorage.getItem('tf-theme') || 'dark';
            document.documentElement.setAttribute('data-bs-theme', theme);
            document.documentElement.setAttribute('data-tf-theme', theme);
        })();
    </script>`;
}

export function getThemeStyles(): string {
    return `<style>
        /* Dark theme (default) */
        :root, [data-tf-theme="dark"] {
            --tf-primary: #7c5cfc;
            --tf-primary-light: #a78bfa;
            --tf-primary-dark: #5b3fd9;
            --tf-accent: #06d6a0;
            --tf-gradient: linear-gradient(135deg, #7c5cfc 0%, #06d6a0 100%);
            --tf-gradient-subtle: linear-gradient(135deg, rgba(124,92,252,0.15) 0%, rgba(6,214,160,0.08) 100%);
            --tf-bg: #0f0f17;
            --tf-surface: #1a1a2e;
            --tf-surface-light: #22223a;
            --tf-text: #e8e8f0;
            --tf-text-muted: #9595ad;
            --tf-border: rgba(255,255,255,0.05);
            --tf-navbar-bg: rgba(15,15,23,0.85);
        }
        /* Light theme */
        [data-tf-theme="light"] {
            --tf-primary: #6d4aed;
            --tf-primary-light: #7c5cfc;
            --tf-primary-dark: #5b3fd9;
            --tf-accent: #05b88a;
            --tf-gradient: linear-gradient(135deg, #6d4aed 0%, #05b88a 100%);
            --tf-gradient-subtle: linear-gradient(135deg, rgba(109,74,237,0.08) 0%, rgba(5,184,138,0.05) 100%);
            --tf-bg: #f8f9fc;
            --tf-surface: #ffffff;
            --tf-surface-light: #f0f1f5;
            --tf-text: #1a1a2e;
            --tf-text-muted: #6b7280;
            --tf-border: rgba(0,0,0,0.08);
            --tf-navbar-bg: rgba(255,255,255,0.9);
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        html, body {
            max-width: 100vw;
            overflow-x: hidden;
        }
        body {
            background-color: var(--tf-bg);
            color: var(--tf-text);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        .btn-primary-tf {
            background: var(--tf-gradient);
            border: none;
            color: #fff;
            font-weight: 600;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(124,92,252,0.3);
        }
        .btn-primary-tf:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(124,92,252,0.45);
            color: #fff;
        }
        .btn-outline-tf {
            border: 2px solid var(--tf-primary);
            color: var(--tf-primary-light);
            font-weight: 600;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            background: transparent;
            transition: all 0.3s ease;
        }
        .btn-outline-tf:hover {
            background: rgba(124,92,252,0.1);
            border-color: var(--tf-primary-light);
            color: var(--tf-primary);
            transform: translateY(-2px);
        }
        [data-tf-theme="dark"] .btn-outline-tf:hover {
            color: #fff;
        }
        .text-gradient {
            background: var(--tf-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .bg-surface {
            background-color: var(--tf-surface);
        }
        .bg-surface-light {
            background-color: var(--tf-surface-light);
        }
        .glow-border {
            border: 1px solid rgba(124,92,252,0.2);
        }
        .text-muted-tf {
            color: var(--tf-text-muted) !important;
        }
        [x-cloak] { display: none !important; }
        ::selection {
            background: rgba(124,92,252,0.4);
        }
        /* Theme toggle button */
        .btn-theme-toggle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--tf-border);
            background: var(--tf-surface);
            color: var(--tf-text);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.1rem;
        }
        .btn-theme-toggle:hover {
            border-color: var(--tf-primary);
            background: rgba(124,92,252,0.1);
            transform: rotate(15deg);
        }
        .btn-theme-toggle .bi-sun { display: none; }
        .btn-theme-toggle .bi-moon { display: inline-block; }
        [data-tf-theme="light"] .btn-theme-toggle .bi-sun { display: inline-block; }
        [data-tf-theme="light"] .btn-theme-toggle .bi-moon { display: none; }
        /* Navbar adjustments for light mode */
        [data-tf-theme="light"] .navbar-tf {
            background: var(--tf-navbar-bg) !important;
            border-bottom-color: var(--tf-border) !important;
        }
        [data-tf-theme="light"] .navbar-tf .nav-link {
            color: var(--tf-text) !important;
        }
        [data-tf-theme="light"] .navbar-tf .nav-link:hover,
        [data-tf-theme="light"] .navbar-tf .nav-link.active {
            color: var(--tf-primary) !important;
        }
        /* Hamburger icon fix for light mode */
        [data-tf-theme="light"] .navbar-tf .navbar-toggler {
            border-color: var(--tf-border);
        }
        [data-tf-theme="light"] .navbar-tf .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(26, 26, 46, 0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
    </style>`;
}

export function getHtmlTemplate(title: string, content: string) {
    return `<!DOCTYPE html>
<html lang="cs" data-bs-theme="dark" data-tf-theme="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="icon" href="data:;base64,=">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    ${getThemeDetectScript()}
    ${getThemeStyles()}
</head>
<body x-data>
${content}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
    document.addEventListener('alpine:init', function() {
        Alpine.store('theme', {
            current: localStorage.getItem('tf-theme') || 'dark',
            toggle() {
                this.current = this.current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-tf-theme', this.current);
                document.documentElement.setAttribute('data-bs-theme', this.current);
                localStorage.setItem('tf-theme', this.current);
            }
        });
        Alpine.store('sidebar', {
            open: false,
            toggle() { this.open = !this.open; },
            close() { this.open = false; }
        });
    });
</script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
</body>
</html>`;
}
