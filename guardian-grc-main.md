This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
guardian/
  guardian/
    pages/
      api/
        policies/
          attachments.ts
    middleware.ts
  public/
    1750288851480-README.md
    1750288878178-tailwind.config.ts
    1750288897802-README.md
    1750289074736-postcss.config.mjs
    1750289091813-postcss.config.mjs
    1750289099021-yarn.lock
    1750289107242-README.md
    1750289116952-README.md
    1750289134037-settings.json
    1750289416766-settings.json
    1750289596386-settings.json
    1750289829552-settings.json
    1750289835273-postcss.config.mjs
    1750289857214-.prettierrc
    1750289867740-README.md
    1750289870405-tsconfig.json
    1750289887975-tsconfig.json
    1750292110628-next-env.d.ts
    1750292308017-tailwind.config.ts
    1750293088216-.eslintrc.json
    file.svg
    globe.svg
    next.svg
    vercel.svg
    window.svg
  scripts/
    dist/
      scripts/
        seed-policies.js
      src/
        lib/
          mongoose.js
        models/
          Policy.js
    seed-compliance.ts
    seed-incidents.ts
    seed-policies.ts
    seed-risks.ts
  src/
    app/
      api/
        audit-log/
          route.ts
        compliance/
          [id]/
            audits/
              [auditId]/
                route.ts
              route.ts
            route.ts
          route.ts
        controls/
          [id]/
            route.ts
          route.ts
        folders/
          [id]/
            route.ts
          route.ts
        incidents/
          [id]/
            route.ts
          route.ts
        policies/
          [id]/
            route.ts
          attachments/
            route.ts
          route.ts
        risks/
          [id]/
            route.ts
          route.ts
        role-assignments/
          [assignmentId]/
            route.ts
          route.ts
      dashboard/
        activity/
          page.tsx
        compliance/
          page.tsx
        controls/
          page.tsx
        documents/
          page.tsx
        incidents/
          page.tsx
        policies/
          page.tsx
        risks/
          page.tsx
        layout.tsx
        page.tsx
      sign-in/
        [[...rest]]/
          page.tsx
      globals.css
      layout.tsx
      page.tsx
    components/
      compliance/
        AuditSessionManager.tsx
        AuditSessionModal.tsx
      controls/
        ControlModal.tsx
        ControlTable.tsx
      risks/
        RiskForm.tsx
      ui/
        Badge.tsx
        Button.tsx
        Card.tsx
        index.ts
        Input.tsx
        Select.tsx
        Table.tsx
        tabs.tsx
      Breadcrumb.tsx
      Sidebar.tsx
      ThemeToggle.tsx
      UserProfileSidebar.tsx
    lib/
      dbConnect.ts
      design-tokens.ts
      mongoose.ts
      permission-utils.ts
      utils.ts
    models/
      AuditLog.ts
      ChangeLog.ts
      Compliance.ts
      Control.ts
      Folder.ts
      Incident.ts
      Policy.ts
      Risk.ts
      RoleAssignment.ts
    styles/
      design-system.css
    middleware.ts
  .gitignore
  components.json
  eslint.config.mjs
  next.config.ts
  package.json
  postcss.config.mjs
  README.md
  tailwind.config.js
  tsconfig.json
.gitattributes
LICENSE
package.json
README.md
```

# Files

## File: guardian/guardian/pages/api/policies/attachments.ts
````typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ATTACHMENTS_DIR = path.join(process.cwd(), 'attachments');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure attachments directory exists
  if (!fs.existsSync(ATTACHMENTS_DIR)) {
    fs.mkdirSync(ATTACHMENTS_DIR, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: ATTACHMENTS_DIR,
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, (err: Error | null, fields: any, files: any) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error', details: err.message });
    }
    const uploadedFiles = Array.isArray(files.file)
      ? files.file
      : files.file
      ? [files.file]
      : [];
    const result = uploadedFiles.map((file: any) => ({
      url: `/attachments/${path.basename(file.filepath || file.path)}`,
      name: file.originalFilename || file.newFilename || path.basename(file.filepath || file.path),
    }));
    return res.status(200).json({ files: result });
  });
}
````

## File: guardian/guardian/middleware.ts
````typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
````

## File: guardian/public/1750288851480-README.md
````markdown
# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This is an [Onlook](https://onlook.com/) project set up with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in Onlook to see the result.
````

## File: guardian/public/1750288878178-tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
````

## File: guardian/public/1750288897802-README.md
````markdown
# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This is an [Onlook](https://onlook.com/) project set up with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in Onlook to see the result.
````

## File: guardian/public/1750289074736-postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: guardian/public/1750289091813-postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: guardian/public/1750289099021-yarn.lock
````
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1
# bun ./bun.lockb --hash: 7211D907EA0051FE-55e4eff816d62def-DFB0E5103FD3A332-8752532833e4611e


"@alloc/quick-lru@^5.2.0":
  version "5.2.0"
  resolved "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz"
  integrity sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==

"@eslint-community/eslint-utils@^4.2.0", "@eslint-community/eslint-utils@^4.4.0":
  version "4.4.0"
  resolved "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.4.0.tgz"
  integrity sha512-1/sA4dwrzBAyeUoQ6oxahHKmrZvsnLCg4RfxW3ZFGGmQkSNQPFNLV9CUEFQP1x9EYXHTo5p6xdhZM1Ne9p/AfA==
  dependencies:
    eslint-visitor-keys "^3.3.0"

"@eslint-community/regexpp@^4.10.0", "@eslint-community/regexpp@^4.6.1":
  version "4.11.0"
  resolved "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.11.0.tgz"
  integrity sha512-G/M/tIiMrTAxEWRfLfQJMmGNX28IxBg4PBz8XqQhqUHLFI6TL2htpIB1iQCj144V5ee/JaKyT9/WZ0MGZWfA7A==

"@eslint/eslintrc@^2.1.4":
  version "2.1.4"
  resolved "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-2.1.4.tgz"
  integrity sha512-269Z39MS6wVJtsoUl10L60WdkhJVdPG24Q4eZTH3nnF6lpvSShEK3wQjDX9JRWAUPvPh7COouPpU9IrqaZFvtQ==
  dependencies:
    ajv "^6.12.4"
    debug "^4.3.2"
    espree "^9.6.0"
    globals "^13.19.0"
    ignore "^5.2.0"
    import-fresh "^3.2.1"
    js-yaml "^4.1.0"
    minimatch "^3.1.2"
    strip-json-comments "^3.1.1"

"@eslint/js@8.57.0":
  version "8.57.0"
  resolved "https://registry.npmjs.org/@eslint/js/-/js-8.57.0.tgz"
  integrity sha512-Ys+3g2TaW7gADOJzPt83SJtCDhMjndcDMFVQ/Tj9iA1BfJzFKD9mAUXT3OenpuPHbI6P/myECxRJrofUsDx/5g==

"@humanwhocodes/config-array@^0.11.14":
  version "0.11.14"
  resolved "https://registry.npmjs.org/@humanwhocodes/config-array/-/config-array-0.11.14.tgz"
  integrity sha512-3T8LkOmg45BV5FICb15QQMsyUSWrQ8AygVfC7ZG32zOalnqrilm018ZVCw0eapXux8FtA33q8PSRSstjee3jSg==
  dependencies:
    debug "^4.3.1"
    minimatch "^3.0.5"
    "@humanwhocodes/object-schema" "^2.0.2"

"@humanwhocodes/module-importer@^1.0.1":
  version "1.0.1"
  resolved "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz"
  integrity sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==

"@humanwhocodes/object-schema@^2.0.2":
  version "2.0.3"
  resolved "https://registry.npmjs.org/@humanwhocodes/object-schema/-/object-schema-2.0.3.tgz"
  integrity sha512-93zYdMES/c1D69yZiKDBj0V24vqNzB/koF26KPaagAfd3P/4gUlh3Dys5ogAK+Exi9QyzlD8x/08Zt7wIKcDcA==

"@isaacs/cliui@^8.0.2":
  version "8.0.2"
  resolved "https://registry.npmjs.org/@isaacs/cliui/-/cliui-8.0.2.tgz"
  integrity sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==
  dependencies:
    string-width "^5.1.2"
    string-width-cjs "npm:string-width@^4.2.0"
    strip-ansi "^7.0.1"
    strip-ansi-cjs "npm:strip-ansi@^6.0.1"
    wrap-ansi "^8.1.0"
    wrap-ansi-cjs "npm:wrap-ansi@^7.0.0"

"@jridgewell/gen-mapping@^0.3.2":
  version "0.3.5"
  resolved "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.5.tgz"
  integrity sha512-IzL8ZoEDIBRWEzlCcRhOaCupYyN5gdIK+Q6fbFdPDg6HqX6jpkItn7DFIpW9LQzXG6Df9sA7+OKnq0qlz/GaQg==
  dependencies:
    "@jridgewell/set-array" "^1.2.1"
    "@jridgewell/trace-mapping" "^0.3.24"
    "@jridgewell/sourcemap-codec" "^1.4.10"

"@jridgewell/resolve-uri@^3.1.0":
  version "3.1.2"
  resolved "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz"
  integrity sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==

"@jridgewell/set-array@^1.2.1":
  version "1.2.1"
  resolved "https://registry.npmjs.org/@jridgewell/set-array/-/set-array-1.2.1.tgz"
  integrity sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==

"@jridgewell/sourcemap-codec@^1.4.10", "@jridgewell/sourcemap-codec@^1.4.14":
  version "1.5.0"
  resolved "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.0.tgz"
  integrity sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==

"@jridgewell/trace-mapping@^0.3.24":
  version "0.3.25"
  resolved "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz"
  integrity sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==
  dependencies:
    "@jridgewell/resolve-uri" "^3.1.0"
    "@jridgewell/sourcemap-codec" "^1.4.14"

"@next/env@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/env/-/env-14.2.23.tgz"
  integrity sha512-CysUC9IO+2Bh0omJ3qrb47S8DtsTKbFidGm6ow4gXIG6reZybqxbkH2nhdEm1tC8SmgzDdpq3BIML0PWsmyUYA==

"@next/eslint-plugin-next@15.1.6":
  version "15.1.6"
  resolved "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-15.1.6.tgz"
  integrity sha512-+slMxhTgILUntZDGNgsKEYHUvpn72WP1YTlkmEhS51vnVd7S9jEEy0n9YAMcI21vUG4akTw9voWH02lrClt/yw==
  dependencies:
    fast-glob "3.3.1"

"@next/swc-darwin-arm64@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-14.2.23.tgz"
  integrity sha512-WhtEntt6NcbABA8ypEoFd3uzq5iAnrl9AnZt9dXdO+PZLACE32z3a3qA5OoV20JrbJfSJ6Sd6EqGZTrlRnGxQQ==

"@next/swc-darwin-x64@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-14.2.23.tgz"
  integrity sha512-vwLw0HN2gVclT/ikO6EcE+LcIN+0mddJ53yG4eZd0rXkuEr/RnOaMH8wg/sYl5iz5AYYRo/l6XX7FIo6kwbw1Q==

"@next/swc-linux-arm64-gnu@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-14.2.23.tgz"
  integrity sha512-uuAYwD3At2fu5CH1wD7FpP87mnjAv4+DNvLaR9kiIi8DLStWSW304kF09p1EQfhcbUI1Py2vZlBO2VaVqMRtpg==

"@next/swc-linux-arm64-musl@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-14.2.23.tgz"
  integrity sha512-Mm5KHd7nGgeJ4EETvVgFuqKOyDh+UMXHXxye6wRRFDr4FdVRI6YTxajoV2aHE8jqC14xeAMVZvLqYqS7isHL+g==

"@next/swc-linux-x64-gnu@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-14.2.23.tgz"
  integrity sha512-Ybfqlyzm4sMSEQO6lDksggAIxnvWSG2cDWnG2jgd+MLbHYn2pvFA8DQ4pT2Vjk3Cwrv+HIg7vXJ8lCiLz79qoQ==

"@next/swc-linux-x64-musl@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-14.2.23.tgz"
  integrity sha512-OSQX94sxd1gOUz3jhhdocnKsy4/peG8zV1HVaW6DLEbEmRRtUCUQZcKxUD9atLYa3RZA+YJx+WZdOnTkDuNDNA==

"@next/swc-win32-arm64-msvc@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-14.2.23.tgz"
  integrity sha512-ezmbgZy++XpIMTcTNd0L4k7+cNI4ET5vMv/oqNfTuSXkZtSA9BURElPFyarjjGtRgZ9/zuKDHoMdZwDZIY3ehQ==

"@next/swc-win32-ia32-msvc@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-win32-ia32-msvc/-/swc-win32-ia32-msvc-14.2.23.tgz"
  integrity sha512-zfHZOGguFCqAJ7zldTKg4tJHPJyJCOFhpoJcVxKL9BSUHScVDnMdDuOU1zPPGdOzr/GWxbhYTjyiEgLEpAoFPA==

"@next/swc-win32-x64-msvc@14.2.23":
  version "14.2.23"
  resolved "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-14.2.23.tgz"
  integrity sha512-xCtq5BD553SzOgSZ7UH5LH+OATQihydObTrCTvVzOro8QiWYKdBVwcB2Mn2MLMo6DGW9yH1LSPw7jS7HhgJgjw==

"@nodelib/fs.scandir@2.1.5":
  version "2.1.5"
  resolved "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz"
  integrity sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==
  dependencies:
    "@nodelib/fs.stat" "2.0.5"
    run-parallel "^1.1.9"

"@nodelib/fs.stat@2.0.5", "@nodelib/fs.stat@^2.0.2":
  version "2.0.5"
  resolved "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz"
  integrity sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==

"@nodelib/fs.walk@^1.2.3", "@nodelib/fs.walk@^1.2.8":
  version "1.2.8"
  resolved "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz"
  integrity sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==
  dependencies:
    "@nodelib/fs.scandir" "2.1.5"
    fastq "^1.6.0"

"@nolyfill/is-core-module@1.0.39":
  version "1.0.39"
  resolved "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz"
  integrity sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==

"@pkgjs/parseargs@^0.11.0":
  version "0.11.0"
  resolved "https://registry.npmjs.org/@pkgjs/parseargs/-/parseargs-0.11.0.tgz"
  integrity sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==

"@radix-ui/react-compose-refs@1.1.0":
  version "1.1.0"
  resolved "https://registry.npmjs.org/@radix-ui/react-compose-refs/-/react-compose-refs-1.1.0.tgz"
  integrity sha512-b4inOtiaOnYf9KWyO3jAeeCG6FeyfY6ldiEPanbUjWd+xIk5wZeHa8yVwmrJ2vderhu/BQvzCrJI0lHd+wIiqw==

"@radix-ui/react-slot@^1.1.0":
  version "1.1.0"
  resolved "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.1.0.tgz"
  integrity sha512-FUCf5XMfmW4dtYl69pdS4DbxKy8nj4M7SafBgPllysxmdachynNflAdp/gCsnYWNDnge6tI9onzMp5ARYc1KNw==
  dependencies:
    "@radix-ui/react-compose-refs" "1.1.0"

"@rtsao/scc@^1.1.0":
  version "1.1.0"
  resolved "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz"
  integrity sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==

"@rushstack/eslint-patch@^1.10.3":
  version "1.10.4"
  resolved "https://registry.npmjs.org/@rushstack/eslint-patch/-/eslint-patch-1.10.4.tgz"
  integrity sha512-WJgX9nzTqknM393q1QJDJmoW28kUfEnybeTfVNcNAPnIx210RXm2DiXiHzfNPJNIUUb1tJnz/l4QGtJ30PgWmA==

"@swc/counter@^0.1.3":
  version "0.1.3"
  resolved "https://registry.npmjs.org/@swc/counter/-/counter-0.1.3.tgz"
  integrity sha512-e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==

"@swc/helpers@0.5.5":
  version "0.5.5"
  resolved "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.5.tgz"
  integrity sha512-KGYxvIOXcceOAbEk4bi/dVLEK9z8sZ0uBB3Il5b1rhfClSpcX0yfRO0KmTkqR2cnQDymwLB+25ZyMzICg/cm/A==
  dependencies:
    tslib "^2.4.0"
    "@swc/counter" "^0.1.3"

"@types/json5@^0.0.29":
  version "0.0.29"
  resolved "https://registry.npmjs.org/@types/json5/-/json5-0.0.29.tgz"
  integrity sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==

"@types/node@^20":
  version "20.16.3"
  resolved "https://registry.npmjs.org/@types/node/-/node-20.16.3.tgz"
  integrity sha512-/wdGiWRkMOm53gAsSyFMXFZHbVg7C6CbkrzHNpaHoYfsUWPg7m6ZRKtvQjgvQ9i8WT540a3ydRlRQbxjY30XxQ==
  dependencies:
    undici-types "~6.19.2"

"@types/prop-types@*":
  version "15.7.12"
  resolved "https://registry.npmjs.org/@types/prop-types/-/prop-types-15.7.12.tgz"
  integrity sha512-5zvhXYtRNRluoE/jAp4GVsSduVUzNWKkOZrCDBWYtE7biZywwdC2AcEzg+cSMLFRfVgeAFqpfNabiPjxFddV1Q==

"@types/react@*", "@types/react@^18":
  version "18.3.5"
  resolved "https://registry.npmjs.org/@types/react/-/react-18.3.5.tgz"
  integrity sha512-WeqMfGJLGuLCqHGYRGHxnKrXcTitc6L/nBUWfWPcTarG3t9PsquqUMuVeXZeca+mglY4Vo5GZjCi0A3Or2lnxA==
  dependencies:
    csstype "^3.0.2"
    "@types/prop-types" "*"

"@types/react-dom@^18":
  version "18.3.0"
  resolved "https://registry.npmjs.org/@types/react-dom/-/react-dom-18.3.0.tgz"
  integrity sha512-EhwApuTmMBmXuFOikhQLIBUn6uFg81SwLMOAUgodJF14SOBOCMdU04gDoYi0WOJJHD144TL32z4yDqCW3dnkQg==
  dependencies:
    "@types/react" "*"

"@typescript-eslint/eslint-plugin@^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.21.0.tgz"
  integrity sha512-eTH+UOR4I7WbdQnG4Z48ebIA6Bgi7WO8HvFEneeYBxG8qCOYgTOFPSg6ek9ITIDvGjDQzWHcoWHCDO2biByNzA==
  dependencies:
    ignore "^5.3.1"
    graphemer "^1.4.0"
    ts-api-utils "^2.0.0"
    natural-compare "^1.4.0"
    "@typescript-eslint/utils" "8.21.0"
    "@eslint-community/regexpp" "^4.10.0"
    "@typescript-eslint/type-utils" "8.21.0"
    "@typescript-eslint/visitor-keys" "8.21.0"
    "@typescript-eslint/scope-manager" "8.21.0"

"@typescript-eslint/parser@^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0", "@typescript-eslint/parser@^8.0.0 || ^8.0.0-alpha.0":
  version "7.2.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-7.2.0.tgz"
  integrity sha512-5FKsVcHTk6TafQKQbuIVkXq58Fnbkd2wDL4LB7AURN7RUOu1utVP+G8+6u3ZhEroW3DF6hyo3ZEXxgKgp4KeCg==
  dependencies:
    debug "^4.3.4"
    "@typescript-eslint/types" "7.2.0"
    "@typescript-eslint/visitor-keys" "7.2.0"
    "@typescript-eslint/scope-manager" "7.2.0"
    "@typescript-eslint/typescript-estree" "7.2.0"

"@typescript-eslint/scope-manager@7.2.0":
  version "7.2.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-7.2.0.tgz"
  integrity sha512-Qh976RbQM/fYtjx9hs4XkayYujB/aPwglw2choHmf3zBjB4qOywWSdt9+KLRdHubGcoSwBnXUH2sR3hkyaERRg==
  dependencies:
    "@typescript-eslint/types" "7.2.0"
    "@typescript-eslint/visitor-keys" "7.2.0"

"@typescript-eslint/scope-manager@8.21.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-8.21.0.tgz"
  integrity sha512-G3IBKz0/0IPfdeGRMbp+4rbjfSSdnGkXsM/pFZA8zM9t9klXDnB/YnKOBQ0GoPmoROa4bCq2NeHgJa5ydsQ4mA==
  dependencies:
    "@typescript-eslint/types" "8.21.0"
    "@typescript-eslint/visitor-keys" "8.21.0"

"@typescript-eslint/type-utils@8.21.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/type-utils/-/type-utils-8.21.0.tgz"
  integrity sha512-95OsL6J2BtzoBxHicoXHxgk3z+9P3BEcQTpBKriqiYzLKnM2DeSqs+sndMKdamU8FosiadQFT3D+BSL9EKnAJQ==
  dependencies:
    debug "^4.3.4"
    ts-api-utils "^2.0.0"
    "@typescript-eslint/utils" "8.21.0"
    "@typescript-eslint/typescript-estree" "8.21.0"

"@typescript-eslint/types@7.2.0":
  version "7.2.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/types/-/types-7.2.0.tgz"
  integrity sha512-XFtUHPI/abFhm4cbCDc5Ykc8npOKBSJePY3a3s+lwumt7XWJuzP5cZcfZ610MIPHjQjNsOLlYK8ASPaNG8UiyA==

"@typescript-eslint/types@8.21.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/types/-/types-8.21.0.tgz"
  integrity sha512-PAL6LUuQwotLW2a8VsySDBwYMm129vFm4tMVlylzdoTybTHaAi0oBp7Ac6LhSrHHOdLM3efH+nAR6hAWoMF89A==

"@typescript-eslint/typescript-estree@7.2.0":
  version "7.2.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-7.2.0.tgz"
  integrity sha512-cyxS5WQQCoBwSakpMrvMXuMDEbhOo9bNHHrNcEWis6XHx6KF518tkF1wBvKIn/tpq5ZpUYK7Bdklu8qY0MsFIA==
  dependencies:
    debug "^4.3.4"
    globby "^11.1.0"
    semver "^7.5.4"
    is-glob "^4.0.3"
    minimatch "9.0.3"
    ts-api-utils "^1.0.1"
    "@typescript-eslint/types" "7.2.0"
    "@typescript-eslint/visitor-keys" "7.2.0"

"@typescript-eslint/typescript-estree@8.21.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-8.21.0.tgz"
  integrity sha512-x+aeKh/AjAArSauz0GiQZsjT8ciadNMHdkUSwBB9Z6PrKc/4knM4g3UfHml6oDJmKC88a6//cdxnO/+P2LkMcg==
  dependencies:
    debug "^4.3.4"
    semver "^7.6.0"
    is-glob "^4.0.3"
    fast-glob "^3.3.2"
    minimatch "^9.0.4"
    ts-api-utils "^2.0.0"
    "@typescript-eslint/types" "8.21.0"
    "@typescript-eslint/visitor-keys" "8.21.0"

"@typescript-eslint/utils@8.21.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/utils/-/utils-8.21.0.tgz"
  integrity sha512-xcXBfcq0Kaxgj7dwejMbFyq7IOHgpNMtVuDveK7w3ZGwG9owKzhALVwKpTF2yrZmEwl9SWdetf3fxNzJQaVuxw==
  dependencies:
    "@typescript-eslint/types" "8.21.0"
    "@eslint-community/eslint-utils" "^4.4.0"
    "@typescript-eslint/scope-manager" "8.21.0"
    "@typescript-eslint/typescript-estree" "8.21.0"

"@typescript-eslint/visitor-keys@7.2.0":
  version "7.2.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-7.2.0.tgz"
  integrity sha512-c6EIQRHhcpl6+tO8EMR+kjkkV+ugUNXOmeASA1rlzkd8EPIriavpWoiEz1HR/VLhbVIdhqnV6E7JZm00cBDx2A==
  dependencies:
    eslint-visitor-keys "^3.4.1"
    "@typescript-eslint/types" "7.2.0"

"@typescript-eslint/visitor-keys@8.21.0":
  version "8.21.0"
  resolved "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-8.21.0.tgz"
  integrity sha512-BkLMNpdV6prozk8LlyK/SOoWLmUFi+ZD+pcqti9ILCbVvHGk1ui1g4jJOc2WDLaeExz2qWwojxlPce5PljcT3w==
  dependencies:
    eslint-visitor-keys "^4.2.0"
    "@typescript-eslint/types" "8.21.0"

"@ungap/structured-clone@^1.2.0":
  version "1.2.0"
  resolved "https://registry.npmjs.org/@ungap/structured-clone/-/structured-clone-1.2.0.tgz"
  integrity sha512-zuVdFrMJiuCDQUMCzQaD6KL28MjnqqN8XnAqiEq9PNm/hCPTSGfrXCOfwj1ow4LFb/tNymJPwsNbVePc1xFqrQ==

"acorn@^6.0.0 || ^7.0.0 || ^8.0.0", acorn@^8.9.0:
  version "8.12.1"
  resolved "https://registry.npmjs.org/acorn/-/acorn-8.12.1.tgz"
  integrity sha512-tcpGyI9zbizT9JbV6oYE477V6mTlXvvi0T0G3SNIYE2apm/G5huBa1+K89VGeovbg+jycCrfhl3ADxErOuO6Jg==

acorn-jsx@^5.3.2:
  version "5.3.2"
  resolved "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz"
  integrity sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==

ajv@^6.12.4:
  version "6.12.6"
  resolved "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz"
  integrity sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==
  dependencies:
    uri-js "^4.2.2"
    fast-deep-equal "^3.1.1"
    json-schema-traverse "^0.4.1"
    fast-json-stable-stringify "^2.0.0"

ansi-regex@^5.0.1:
  version "5.0.1"
  resolved "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz"
  integrity sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==

ansi-regex@^6.0.1:
  version "6.0.1"
  resolved "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.0.1.tgz"
  integrity sha512-n5M855fKb2SsfMIiFFoVrABHJC8QtHwVx+mHWP3QcEqBHYienj5dHSgjbxtC0WEZXYt4wcD6zrQElDPhFuZgfA==

ansi-styles@^4.0.0, ansi-styles@^4.1.0:
  version "4.3.0"
  resolved "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz"
  integrity sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==
  dependencies:
    color-convert "^2.0.1"

ansi-styles@^6.1.0:
  version "6.2.1"
  resolved "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.1.tgz"
  integrity sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==

any-promise@^1.0.0:
  version "1.3.0"
  resolved "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz"
  integrity sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==

anymatch@~3.1.2:
  version "3.1.3"
  resolved "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz"
  integrity sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==
  dependencies:
    normalize-path "^3.0.0"
    picomatch "^2.0.4"

arg@^5.0.2:
  version "5.0.2"
  resolved "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz"
  integrity sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==

argparse@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz"
  integrity sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==

aria-query@^5.3.2:
  version "5.3.2"
  resolved "https://registry.npmjs.org/aria-query/-/aria-query-5.3.2.tgz"
  integrity sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==

array-buffer-byte-length@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.1.tgz"
  integrity sha512-ahC5W1xgou+KTXix4sAO8Ki12Q+jf4i0+tmk3sC+zgcynshkHxzpXdImBehiUYKKKDwvfFiJl1tZt6ewscS1Mg==
  dependencies:
    call-bind "^1.0.5"
    is-array-buffer "^3.0.4"

array-buffer-byte-length@^1.0.1, array-buffer-byte-length@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz"
  integrity sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==
  dependencies:
    call-bound "^1.0.3"
    is-array-buffer "^3.0.5"

array-includes@^3.1.6, array-includes@^3.1.8:
  version "3.1.8"
  resolved "https://registry.npmjs.org/array-includes/-/array-includes-3.1.8.tgz"
  integrity sha512-itaWrbYbqpGXkGhZPGUulwnhVf5Hpy1xiCFsGqyIGglbBxmG5vSjxQen3/WGOjPpNEv1RtBLKxbmVXm8HpJStQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-object-atoms "^1.0.0"
    get-intrinsic "^1.2.4"
    is-string "^1.0.7"

array-union@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/array-union/-/array-union-2.1.0.tgz"
  integrity sha512-HGyxoOTYUyCM6stUe6EJgnd4EoewAI7zMdfqO+kGjnlZmBDz/cR5pf8r/cR4Wq60sL/p0IkcjUEEPwS3GFrIyw==

array.prototype.findlast@^1.2.5:
  version "1.2.5"
  resolved "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz"
  integrity sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-shim-unscopables "^1.0.2"

array.prototype.findlastindex@^1.2.5:
  version "1.2.5"
  resolved "https://registry.npmjs.org/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.5.tgz"
  integrity sha512-zfETvRFA8o7EiNn++N5f/kaCw221hrpGsDmcpndVupkPzEc1Wuf3VgC0qby1BbHs7f5DVYjgtEU2LLh5bqeGfQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-shim-unscopables "^1.0.2"

array.prototype.flat@^1.3.1, array.prototype.flat@^1.3.2:
  version "1.3.2"
  resolved "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.2.tgz"
  integrity sha512-djYB+Zx2vLewY8RWlNCUdHjDXs2XOgm602S9E7P/UpHgfeHL00cRiIF+IN/G/aUJ7kGPb6yO/ErDI5V2s8iycA==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.2.0"
    es-abstract "^1.22.1"
    es-shim-unscopables "^1.0.0"

array.prototype.flatmap@^1.3.2:
  version "1.3.2"
  resolved "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.2.tgz"
  integrity sha512-Ewyx0c9PmpcsByhSW4r+9zDU7sGjFc86qf/kKtuSCRdhfbk0SNLLkaT5qvcHnRGgc5NP/ly/y+qkXkqONX54CQ==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.2.0"
    es-abstract "^1.22.1"
    es-shim-unscopables "^1.0.0"

array.prototype.flatmap@^1.3.2, array.prototype.flatmap@^1.3.3:
  version "1.3.3"
  resolved "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz"
  integrity sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==
  dependencies:
    call-bind "^1.0.8"
    define-properties "^1.2.1"
    es-abstract "^1.23.5"
    es-shim-unscopables "^1.0.2"

array.prototype.tosorted@^1.1.4:
  version "1.1.4"
  resolved "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz"
  integrity sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.3"
    es-errors "^1.3.0"
    es-shim-unscopables "^1.0.2"

arraybuffer.prototype.slice@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.3.tgz"
  integrity sha512-bMxMKAjg13EBSVscxTaYA4mRc5t1UAXa2kXiGTNfZ079HIWXEkKmkgFrh/nJqamaLSrXO5H4WFFkPEaLJWbs3A==
  dependencies:
    array-buffer-byte-length "^1.0.1"
    call-bind "^1.0.5"
    define-properties "^1.2.1"
    es-abstract "^1.22.3"
    es-errors "^1.2.1"
    get-intrinsic "^1.2.3"
    is-array-buffer "^3.0.4"
    is-shared-array-buffer "^1.0.2"

arraybuffer.prototype.slice@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz"
  integrity sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==
  dependencies:
    array-buffer-byte-length "^1.0.1"
    call-bind "^1.0.8"
    define-properties "^1.2.1"
    es-abstract "^1.23.5"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.6"
    is-array-buffer "^3.0.4"

ast-types-flow@^0.0.8:
  version "0.0.8"
  resolved "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz"
  integrity sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==

available-typed-arrays@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz"
  integrity sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==
  dependencies:
    possible-typed-array-names "^1.0.0"

axe-core@^4.10.0:
  version "4.10.0"
  resolved "https://registry.npmjs.org/axe-core/-/axe-core-4.10.0.tgz"
  integrity sha512-Mr2ZakwQ7XUAjp7pAwQWRhhK8mQQ6JAaNWSjmjxil0R8BPioMtQsTLOolGYkji1rcL++3dCqZA3zWqpT+9Ew6g==

axobject-query@^4.1.0:
  version "4.1.0"
  resolved "https://registry.npmjs.org/axobject-query/-/axobject-query-4.1.0.tgz"
  integrity sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==

balanced-match@^1.0.0:
  version "1.0.2"
  resolved "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz"
  integrity sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==

binary-extensions@^2.0.0:
  version "2.3.0"
  resolved "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz"
  integrity sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==

brace-expansion@^1.1.7:
  version "1.1.11"
  resolved "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz"
  integrity sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==
  dependencies:
    balanced-match "^1.0.0"
    concat-map "0.0.1"

brace-expansion@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/brace-expansion/-/brace-expansion-2.0.1.tgz"
  integrity sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==
  dependencies:
    balanced-match "^1.0.0"

braces@^3.0.3, braces@~3.0.2:
  version "3.0.3"
  resolved "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz"
  integrity sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==
  dependencies:
    fill-range "^7.1.1"

busboy@1.6.0:
  version "1.6.0"
  resolved "https://registry.npmjs.org/busboy/-/busboy-1.6.0.tgz"
  integrity sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==
  dependencies:
    streamsearch "^1.1.0"

call-bind@^1.0.2, call-bind@^1.0.5, call-bind@^1.0.6, call-bind@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/call-bind/-/call-bind-1.0.7.tgz"
  integrity sha512-GHTSNSYICQ7scH7sZ+M2rFopRoLh8t2bLSW6BbgrtLsahOIB5iyAVJf9GjWK3cYTDaMj4XdBpM1cA6pIS0Kv2w==
  dependencies:
    es-define-property "^1.0.0"
    es-errors "^1.3.0"
    function-bind "^1.1.2"
    get-intrinsic "^1.2.4"
    set-function-length "^1.2.1"

call-bind@^1.0.7, call-bind@^1.0.8:
  version "1.0.8"
  resolved "https://registry.npmjs.org/call-bind/-/call-bind-1.0.8.tgz"
  integrity sha512-oKlSFMcMwpUg2ednkhQ454wfWiU/ul3CkJe/PEHcTKuiX6RpbehUiFMXu13HalGZxfUwCQzZG747YXBn1im9ww==
  dependencies:
    call-bind-apply-helpers "^1.0.0"
    es-define-property "^1.0.0"
    get-intrinsic "^1.2.4"
    set-function-length "^1.2.2"

call-bind-apply-helpers@^1.0.0, call-bind-apply-helpers@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.1.tgz"
  integrity sha512-BhYE+WDaywFg2TBWYNXAE+8B1ATnThNBqXHP5nQu0jWJdVvY2hvkpyB3qOmtmDePiS5/BDQ8wASEWGMWRG148g==
  dependencies:
    es-errors "^1.3.0"
    function-bind "^1.1.2"

call-bound@^1.0.2, call-bound@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/call-bound/-/call-bound-1.0.3.tgz"
  integrity sha512-YTd+6wGlNlPxSuri7Y6X8tY2dmm12UMH66RpKMhiX6rsk5wXXnYgbUcOt8kiS31/AjfoTOvCsE+w8nZQLQnzHA==
  dependencies:
    call-bind-apply-helpers "^1.0.1"
    get-intrinsic "^1.2.6"

callsites@^3.0.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz"
  integrity sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==

camelcase-css@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz"
  integrity sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==

caniuse-lite@^1.0.30001579:
  version "1.0.30001655"
  resolved "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001655.tgz"
  integrity sha512-jRGVy3iSGO5Uutn2owlb5gR6qsGngTw9ZTb4ali9f3glshcNmJ2noam4Mo9zia5P9Dk3jNNydy7vQjuE5dQmfg==

chalk@^4.0.0:
  version "4.1.2"
  resolved "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz"
  integrity sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==
  dependencies:
    ansi-styles "^4.1.0"
    supports-color "^7.1.0"

chokidar@^3.5.3:
  version "3.6.0"
  resolved "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz"
  integrity sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==
  dependencies:
    anymatch "~3.1.2"
    braces "~3.0.2"
    glob-parent "~5.1.2"
    is-binary-path "~2.1.0"
    is-glob "~4.0.1"
    normalize-path "~3.0.0"
    readdirp "~3.6.0"
  optionalDependencies:
    fsevents "~2.3.2"

class-variance-authority@^0.7.0:
  version "0.7.0"
  resolved "https://registry.npmjs.org/class-variance-authority/-/class-variance-authority-0.7.0.tgz"
  integrity sha512-jFI8IQw4hczaL4ALINxqLEXQbWcNjoSkloa4IaufXCJr6QawJyw7tuRysRsrE8w2p/4gGaxKIt/hX3qz/IbD1A==
  dependencies:
    clsx "2.0.0"

client-only@0.0.1:
  version "0.0.1"
  resolved "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz"
  integrity sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==

clsx@2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/clsx/-/clsx-2.0.0.tgz"
  integrity sha512-rQ1+kcj+ttHG0MKVGBUXwayCCF1oh39BF5COIpRzuCEv8Mwjv0XucrI2ExNTOn9IlLifGClWQcU9BrZORvtw6Q==

clsx@^2.1.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz"
  integrity sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==

color-convert@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz"
  integrity sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==
  dependencies:
    color-name "~1.1.4"

color-name@~1.1.4:
  version "1.1.4"
  resolved "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz"
  integrity sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==

commander@^4.0.0:
  version "4.1.1"
  resolved "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz"
  integrity sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==

concat-map@0.0.1:
  version "0.0.1"
  resolved "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz"
  integrity sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==

cross-spawn@^7.0.0, cross-spawn@^7.0.2:
  version "7.0.3"
  resolved "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.3.tgz"
  integrity sha512-iRDPJKUPVEND7dHPO8rkbOnPpyDygcDFtWjpeWNCgy8WP2rXcxXL8TskReQl6OrB2G7+UJrags1q15Fudc7G6w==
  dependencies:
    path-key "^3.1.0"
    shebang-command "^2.0.0"
    which "^2.0.1"

cssesc@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz"
  integrity sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==

csstype@^3.0.2:
  version "3.1.3"
  resolved "https://registry.npmjs.org/csstype/-/csstype-3.1.3.tgz"
  integrity sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==

damerau-levenshtein@^1.0.8:
  version "1.0.8"
  resolved "https://registry.npmjs.org/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz"
  integrity sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==

data-view-buffer@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.1.tgz"
  integrity sha512-0lht7OugA5x3iJLOWFhWK/5ehONdprk0ISXqVFn/NFrDu+cuc8iADFrGQz5BnRK7LLU3JmkbXSxaqX+/mXYtUA==
  dependencies:
    call-bind "^1.0.6"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

data-view-buffer@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz"
  integrity sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==
  dependencies:
    call-bound "^1.0.3"
    es-errors "^1.3.0"
    is-data-view "^1.0.2"

data-view-byte-length@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.1.tgz"
  integrity sha512-4J7wRJD3ABAzr8wP+OcIcqq2dlUKp4DVflx++hs5h5ZKydWMI6/D/fAot+yh6g2tHh8fLFTvNOaVN357NvSrOQ==
  dependencies:
    call-bind "^1.0.7"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

data-view-byte-length@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz"
  integrity sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==
  dependencies:
    call-bound "^1.0.3"
    es-errors "^1.3.0"
    is-data-view "^1.0.2"

data-view-byte-offset@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.0.tgz"
  integrity sha512-t/Ygsytq+R995EJ5PZlD4Cu56sWa8InXySaViRzw9apusqsOO2bQP+SbYzAhR0pFKoB+43lYy8rWban9JSuXnA==
  dependencies:
    call-bind "^1.0.6"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

data-view-byte-offset@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz"
  integrity sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==
  dependencies:
    call-bound "^1.0.2"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

debug@^3.2.7:
  version "3.2.7"
  resolved "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz"
  integrity sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==
  dependencies:
    ms "^2.1.1"

debug@^4.3.1, debug@^4.3.2, debug@^4.3.4, debug@^4.3.5:
  version "4.3.6"
  resolved "https://registry.npmjs.org/debug/-/debug-4.3.6.tgz"
  integrity sha512-O/09Bd4Z1fBrU4VzkhFqVgpPzaGbw6Sm9FEkBT1A/YBXQFGuuSxa1dN2nxgxS34JmKXqYx8CZAwEVoJFImUXIg==
  dependencies:
    ms "2.1.2"

deep-is@^0.1.3:
  version "0.1.4"
  resolved "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz"
  integrity sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==

define-data-property@^1.0.1, define-data-property@^1.1.4:
  version "1.1.4"
  resolved "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz"
  integrity sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==
  dependencies:
    es-define-property "^1.0.0"
    es-errors "^1.3.0"
    gopd "^1.0.1"

define-properties@^1.1.3, define-properties@^1.2.0, define-properties@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz"
  integrity sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==
  dependencies:
    define-data-property "^1.0.1"
    has-property-descriptors "^1.0.0"
    object-keys "^1.1.1"

didyoumean@^1.2.2:
  version "1.2.2"
  resolved "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz"
  integrity sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==

dir-glob@^3.0.1:
  version "3.0.1"
  resolved "https://registry.npmjs.org/dir-glob/-/dir-glob-3.0.1.tgz"
  integrity sha512-WkrWp9GR4KXfKGYzOLmTuGVi1UWFfws377n9cc55/tb6DuqyF6pcQ5AbiHEshaDpY9v6oaSr2XCDidGmMwdzIA==
  dependencies:
    path-type "^4.0.0"

dlv@^1.1.3:
  version "1.1.3"
  resolved "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz"
  integrity sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==

doctrine@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz"
  integrity sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==
  dependencies:
    esutils "^2.0.2"

doctrine@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/doctrine/-/doctrine-3.0.0.tgz"
  integrity sha512-yS+Q5i3hBf7GBkd4KG8a7eBNNWNGLTaEwwYWUijIYM7zrlYDM0BFXHjjPWlWZ1Rg7UaddZeIDmi9jF3HmqiQ2w==
  dependencies:
    esutils "^2.0.2"

dunder-proto@^1.0.0, dunder-proto@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz"
  integrity sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==
  dependencies:
    call-bind-apply-helpers "^1.0.1"
    es-errors "^1.3.0"
    gopd "^1.2.0"

eastasianwidth@^0.2.0:
  version "0.2.0"
  resolved "https://registry.npmjs.org/eastasianwidth/-/eastasianwidth-0.2.0.tgz"
  integrity sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==

emoji-regex@^8.0.0:
  version "8.0.0"
  resolved "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz"
  integrity sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==

emoji-regex@^9.2.2:
  version "9.2.2"
  resolved "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz"
  integrity sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==

enhanced-resolve@^5.15.0:
  version "5.17.1"
  resolved "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.17.1.tgz"
  integrity sha512-LMHl3dXhTcfv8gM4kEzIUeTQ+7fpdA0l2tUf34BddXPkz2A5xJ5L/Pchd5BL6rdccM9QGvu0sWZzK1Z1t4wwyg==
  dependencies:
    graceful-fs "^4.2.4"
    tapable "^2.2.0"

es-abstract@^1.17.5, es-abstract@^1.22.1, es-abstract@^1.22.3, es-abstract@^1.23.0, es-abstract@^1.23.1, es-abstract@^1.23.2, es-abstract@^1.23.3:
  version "1.23.3"
  resolved "https://registry.npmjs.org/es-abstract/-/es-abstract-1.23.3.tgz"
  integrity sha512-e+HfNH61Bj1X9/jLc5v1owaLYuHdeHHSQlkhCBiTK8rBvKaULl/beGMxwrMXjpYrv4pz22BlY570vVePA2ho4A==
  dependencies:
    array-buffer-byte-length "^1.0.1"
    arraybuffer.prototype.slice "^1.0.3"
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.7"
    data-view-buffer "^1.0.1"
    data-view-byte-length "^1.0.1"
    data-view-byte-offset "^1.0.0"
    es-define-property "^1.0.0"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-set-tostringtag "^2.0.3"
    es-to-primitive "^1.2.1"
    function.prototype.name "^1.1.6"
    get-intrinsic "^1.2.4"
    get-symbol-description "^1.0.2"
    globalthis "^1.0.3"
    gopd "^1.0.1"
    has-property-descriptors "^1.0.2"
    has-proto "^1.0.3"
    has-symbols "^1.0.3"
    hasown "^2.0.2"
    internal-slot "^1.0.7"
    is-array-buffer "^3.0.4"
    is-callable "^1.2.7"
    is-data-view "^1.0.1"
    is-negative-zero "^2.0.3"
    is-regex "^1.1.4"
    is-shared-array-buffer "^1.0.3"
    is-string "^1.0.7"
    is-typed-array "^1.1.13"
    is-weakref "^1.0.2"
    object-inspect "^1.13.1"
    object-keys "^1.1.1"
    object.assign "^4.1.5"
    regexp.prototype.flags "^1.5.2"
    safe-array-concat "^1.1.2"
    safe-regex-test "^1.0.3"
    string.prototype.trim "^1.2.9"
    string.prototype.trimend "^1.0.8"
    string.prototype.trimstart "^1.0.8"
    typed-array-buffer "^1.0.2"
    typed-array-byte-length "^1.0.1"
    typed-array-byte-offset "^1.0.2"
    typed-array-length "^1.0.6"
    unbox-primitive "^1.0.2"
    which-typed-array "^1.1.15"

es-abstract@^1.23.3, es-abstract@^1.23.5, es-abstract@^1.23.6, es-abstract@^1.23.9:
  version "1.23.9"
  resolved "https://registry.npmjs.org/es-abstract/-/es-abstract-1.23.9.tgz"
  integrity sha512-py07lI0wjxAC/DcfK1S6G7iANonniZwTISvdPzk9hzeH0IZIshbuuFxLIU96OyF89Yb9hiqWn8M/bY83KY5vzA==
  dependencies:
    array-buffer-byte-length "^1.0.2"
    arraybuffer.prototype.slice "^1.0.4"
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    data-view-buffer "^1.0.2"
    data-view-byte-length "^1.0.2"
    data-view-byte-offset "^1.0.1"
    es-define-property "^1.0.1"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-set-tostringtag "^2.1.0"
    es-to-primitive "^1.3.0"
    function.prototype.name "^1.1.8"
    get-intrinsic "^1.2.7"
    get-proto "^1.0.0"
    get-symbol-description "^1.1.0"
    globalthis "^1.0.4"
    gopd "^1.2.0"
    has-property-descriptors "^1.0.2"
    has-proto "^1.2.0"
    has-symbols "^1.1.0"
    hasown "^2.0.2"
    internal-slot "^1.1.0"
    is-array-buffer "^3.0.5"
    is-callable "^1.2.7"
    is-data-view "^1.0.2"
    is-regex "^1.2.1"
    is-shared-array-buffer "^1.0.4"
    is-string "^1.1.1"
    is-typed-array "^1.1.15"
    is-weakref "^1.1.0"
    math-intrinsics "^1.1.0"
    object-inspect "^1.13.3"
    object-keys "^1.1.1"
    object.assign "^4.1.7"
    own-keys "^1.0.1"
    regexp.prototype.flags "^1.5.3"
    safe-array-concat "^1.1.3"
    safe-push-apply "^1.0.0"
    safe-regex-test "^1.1.0"
    set-proto "^1.0.0"
    string.prototype.trim "^1.2.10"
    string.prototype.trimend "^1.0.9"
    string.prototype.trimstart "^1.0.8"
    typed-array-buffer "^1.0.3"
    typed-array-byte-length "^1.0.3"
    typed-array-byte-offset "^1.0.4"
    typed-array-length "^1.0.7"
    unbox-primitive "^1.1.0"
    which-typed-array "^1.1.18"

es-define-property@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.0.tgz"
  integrity sha512-jxayLKShrEqqzJ0eumQbVhTYQM27CfT1T35+gCgDFoL82JLsXqTJ76zv6A0YLOgEnLUMvLzsDsGIrl8NFpT2gQ==
  dependencies:
    get-intrinsic "^1.2.4"

es-define-property@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz"
  integrity sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==

es-errors@^1.2.1, es-errors@^1.3.0:
  version "1.3.0"
  resolved "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz"
  integrity sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==

es-iterator-helpers@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.2.1.tgz"
  integrity sha512-uDn+FE1yrDzyC0pCo961B2IHbdM8y/ACZsKD4dG6WqrjV53BADjwa7D+1aom2rsNVfLyDgU/eigvlJGJ08OQ4w==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    define-properties "^1.2.1"
    es-abstract "^1.23.6"
    es-errors "^1.3.0"
    es-set-tostringtag "^2.0.3"
    function-bind "^1.1.2"
    get-intrinsic "^1.2.6"
    globalthis "^1.0.4"
    gopd "^1.2.0"
    has-property-descriptors "^1.0.2"
    has-proto "^1.2.0"
    has-symbols "^1.1.0"
    internal-slot "^1.1.0"
    iterator.prototype "^1.1.4"
    safe-array-concat "^1.1.3"

es-object-atoms@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.0.0.tgz"
  integrity sha512-MZ4iQ6JwHOBQjahnjwaC1ZtIBH+2ohjamzAO3oaHcXYup7qxjF2fixyH+Q71voWHeOkI2q/TnJao/KfXYIZWbw==
  dependencies:
    es-errors "^1.3.0"

es-set-tostringtag@^2.0.3:
  version "2.0.3"
  resolved "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.0.3.tgz"
  integrity sha512-3T8uNMC3OQTHkFUsFq8r/BwAXLHvU/9O9mE0fBc/MY5iq/8H7ncvO947LmYA6ldWw9Uh8Yhf25zu6n7nML5QWQ==
  dependencies:
    get-intrinsic "^1.2.4"
    has-tostringtag "^1.0.2"
    hasown "^2.0.1"

es-set-tostringtag@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz"
  integrity sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==
  dependencies:
    es-errors "^1.3.0"
    get-intrinsic "^1.2.6"
    has-tostringtag "^1.0.2"
    hasown "^2.0.2"

es-shim-unscopables@^1.0.0, es-shim-unscopables@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.0.2.tgz"
  integrity sha512-J3yBRXCzDu4ULnQwxyToo/OjdMx6akgVC7K6few0a7F/0wLtmKKN7I73AH5T2836UuXRqN7Qg+IIUw/+YJksRw==
  dependencies:
    hasown "^2.0.0"

es-to-primitive@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.2.1.tgz"
  integrity sha512-QCOllgZJtaUo9miYBcLChTUaHNjJF3PYs1VidD7AwiEj1kYxKeQTctLAezAOH5ZKRH0g2IgPn6KwB4IT8iRpvA==
  dependencies:
    is-callable "^1.1.4"
    is-date-object "^1.0.1"
    is-symbol "^1.0.2"

es-to-primitive@^1.3.0:
  version "1.3.0"
  resolved "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.0.tgz"
  integrity sha512-w+5mJ3GuFL+NjVtJlvydShqE1eN3h3PbI7/5LAsYJP/2qtuMXjfL2LpHSRqo4b4eSF5K/DH1JXKUAHSB2UW50g==
  dependencies:
    is-callable "^1.2.7"
    is-date-object "^1.0.5"
    is-symbol "^1.0.4"

escape-string-regexp@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz"
  integrity sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==

eslint@*, "eslint@^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8", "eslint@^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9", "eslint@^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9", "eslint@^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7", "eslint@^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0", "eslint@^6.0.0 || ^7.0.0 || >=8.0.0", "eslint@^7.23.0 || ^8.0.0 || ^9.0.0", eslint@^8, eslint@^8.56.0, "eslint@^8.57.0 || ^9.0.0":
  version "8.57.0"
  resolved "https://registry.npmjs.org/eslint/-/eslint-8.57.0.tgz"
  integrity sha512-dZ6+mexnaTIbSBZWgou51U6OmzIhYM2VcNdtiTtI7qPNZm35Akpr0f6vtw3w1Kmn5PYo+tZVfh13WrhpS6oLqQ==
  dependencies:
    ajv "^6.12.4"
    levn "^0.4.1"
    chalk "^4.0.0"
    debug "^4.3.2"
    espree "^9.6.1"
    ignore "^5.2.0"
    esquery "^1.4.2"
    esutils "^2.0.2"
    find-up "^5.0.0"
    globals "^13.19.0"
    is-glob "^4.0.0"
    js-yaml "^4.1.0"
    doctrine "^3.0.0"
    graphemer "^1.4.0"
    minimatch "^3.1.2"
    "@eslint/js" "8.57.0"
    optionator "^0.9.3"
    strip-ansi "^6.0.1"
    text-table "^0.2.0"
    cross-spawn "^7.0.2"
    glob-parent "^6.0.2"
    imurmurhash "^0.1.4"
    eslint-scope "^7.2.2"
    lodash.merge "^4.6.2"
    is-path-inside "^3.0.3"
    fast-deep-equal "^3.1.3"
    natural-compare "^1.4.0"
    "@eslint/eslintrc" "^2.1.4"
    "@nodelib/fs.walk" "^1.2.8"
    file-entry-cache "^6.0.1"
    eslint-visitor-keys "^3.4.3"
    escape-string-regexp "^4.0.0"
    "@ungap/structured-clone" "^1.2.0"
    "@eslint-community/regexpp" "^4.6.1"
    "@humanwhocodes/config-array" "^0.11.14"
    "@eslint-community/eslint-utils" "^4.2.0"
    "@humanwhocodes/module-importer" "^1.0.1"
    json-stable-stringify-without-jsonify "^1.0.1"

eslint-config-next@^15.1.6:
  version "15.1.6"
  resolved "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-15.1.6.tgz"
  integrity sha512-Wd1uy6y7nBbXUSg9QAuQ+xYEKli5CgUhLjz1QHW11jLDis5vK5XB3PemL6jEmy7HrdhaRFDz+GTZ/3FoH+EUjg==
  dependencies:
    eslint-plugin-react "^7.37.0"
    eslint-plugin-import "^2.31.0"
    eslint-plugin-jsx-a11y "^6.10.0"
    "@rushstack/eslint-patch" "^1.10.3"
    "@next/eslint-plugin-next" "15.1.6"
    "@typescript-eslint/parser" "^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0"
    eslint-plugin-react-hooks "^5.0.0"
    eslint-import-resolver-node "^0.3.6"
    "@typescript-eslint/eslint-plugin" "^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0"
    eslint-import-resolver-typescript "^3.5.2"

eslint-import-resolver-node@^0.3.6, eslint-import-resolver-node@^0.3.9:
  version "0.3.9"
  resolved "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.9.tgz"
  integrity sha512-WFj2isz22JahUv+B788TlO3N6zL3nNJGU8CcZbPZvVEkBPaJdCV4vy5wyghty5ROFbCRnm132v8BScu5/1BQ8g==
  dependencies:
    debug "^3.2.7"
    is-core-module "^2.13.0"
    resolve "^1.22.4"

eslint-import-resolver-typescript@^3.5.2:
  version "3.6.3"
  resolved "https://registry.npmjs.org/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.6.3.tgz"
  integrity sha512-ud9aw4szY9cCT1EWWdGv1L1XR6hh2PaRWif0j2QjQ0pgTY/69iw+W0Z4qZv5wHahOl8isEr+k/JnyAqNQkLkIA==
  dependencies:
    "@nolyfill/is-core-module" "1.0.39"
    debug "^4.3.5"
    enhanced-resolve "^5.15.0"
    eslint-module-utils "^2.8.1"
    fast-glob "^3.3.2"
    get-tsconfig "^4.7.5"
    is-bun-module "^1.0.2"
    is-glob "^4.0.3"

eslint-module-utils@^2.8.1, eslint-module-utils@^2.9.0:
  version "2.9.0"
  resolved "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.9.0.tgz"
  integrity sha512-McVbYmwA3NEKwRQY5g4aWMdcZE5xZxV8i8l7CqJSrameuGSQJtSWaL/LxTEzSKKaCcOhlpDR8XEfYXWPrdo/ZQ==
  dependencies:
    debug "^3.2.7"

eslint-module-utils@^2.12.0:
  version "2.12.0"
  resolved "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.12.0.tgz"
  integrity sha512-wALZ0HFoytlyh/1+4wuZ9FJCD/leWHQzzrxJ8+rebyReSLk7LApMyd3WJaLVoN+D5+WIdJyDK1c6JnE65V4Zyg==
  dependencies:
    debug "^3.2.7"

eslint-plugin-import@*:
  version "2.30.0"
  resolved "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.30.0.tgz"
  integrity sha512-/mHNE9jINJfiD2EKkg1BKyPyUk4zdnT54YgbOgfjSakWT5oyX/qQLVNTkehyfpcMxZXMy1zyonZ2v7hZTX43Yw==
  dependencies:
    "@rtsao/scc" "^1.1.0"
    array-includes "^3.1.8"
    array.prototype.findlastindex "^1.2.5"
    array.prototype.flat "^1.3.2"
    array.prototype.flatmap "^1.3.2"
    debug "^3.2.7"
    doctrine "^2.1.0"
    eslint-import-resolver-node "^0.3.9"
    eslint-module-utils "^2.9.0"
    hasown "^2.0.2"
    is-core-module "^2.15.1"
    is-glob "^4.0.3"
    minimatch "^3.1.2"
    object.fromentries "^2.0.8"
    object.groupby "^1.0.3"
    object.values "^1.2.0"
    semver "^6.3.1"
    tsconfig-paths "^3.15.0"

eslint-plugin-import@^2.31.0:
  version "2.31.0"
  resolved "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.31.0.tgz"
  integrity sha512-ixmkI62Rbc2/w8Vfxyh1jQRTdRTF52VxwRVHl/ykPAmqG+Nb7/kNn+byLP0LxPgI7zWA16Jt82SybJInmMia3A==
  dependencies:
    "@rtsao/scc" "^1.1.0"
    array-includes "^3.1.8"
    array.prototype.findlastindex "^1.2.5"
    array.prototype.flat "^1.3.2"
    array.prototype.flatmap "^1.3.2"
    debug "^3.2.7"
    doctrine "^2.1.0"
    eslint-import-resolver-node "^0.3.9"
    eslint-module-utils "^2.12.0"
    hasown "^2.0.2"
    is-core-module "^2.15.1"
    is-glob "^4.0.3"
    minimatch "^3.1.2"
    object.fromentries "^2.0.8"
    object.groupby "^1.0.3"
    object.values "^1.2.0"
    semver "^6.3.1"
    string.prototype.trimend "^1.0.8"
    tsconfig-paths "^3.15.0"

eslint-plugin-jsx-a11y@^6.10.0:
  version "6.10.2"
  resolved "https://registry.npmjs.org/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz"
  integrity sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==
  dependencies:
    aria-query "^5.3.2"
    array-includes "^3.1.8"
    array.prototype.flatmap "^1.3.2"
    ast-types-flow "^0.0.8"
    axe-core "^4.10.0"
    axobject-query "^4.1.0"
    damerau-levenshtein "^1.0.8"
    emoji-regex "^9.2.2"
    hasown "^2.0.2"
    jsx-ast-utils "^3.3.5"
    language-tags "^1.0.9"
    minimatch "^3.1.2"
    object.fromentries "^2.0.8"
    safe-regex-test "^1.0.3"
    string.prototype.includes "^2.0.1"

eslint-plugin-react@^7.37.0:
  version "7.37.4"
  resolved "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.4.tgz"
  integrity sha512-BGP0jRmfYyvOyvMoRX/uoUeW+GqNj9y16bPQzqAHf3AYII/tDs+jMN0dBVkl88/OZwNGwrVFxE7riHsXVfy/LQ==
  dependencies:
    array-includes "^3.1.8"
    array.prototype.findlast "^1.2.5"
    array.prototype.flatmap "^1.3.3"
    array.prototype.tosorted "^1.1.4"
    doctrine "^2.1.0"
    es-iterator-helpers "^1.2.1"
    estraverse "^5.3.0"
    hasown "^2.0.2"
    jsx-ast-utils "^2.4.1 || ^3.0.0"
    minimatch "^3.1.2"
    object.entries "^1.1.8"
    object.fromentries "^2.0.8"
    object.values "^1.2.1"
    prop-types "^15.8.1"
    resolve "^2.0.0-next.5"
    semver "^6.3.1"
    string.prototype.matchall "^4.0.12"
    string.prototype.repeat "^1.0.0"

eslint-plugin-react-hooks@^5.0.0:
  version "5.1.0"
  resolved "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-5.1.0.tgz"
  integrity sha512-mpJRtPgHN2tNAvZ35AMfqeB3Xqeo273QxrHJsbBEPWODRM4r0yB6jfoROqKEYrOn27UtRPpcpHc2UqyBSuUNTw==

eslint-scope@^7.2.2:
  version "7.2.2"
  resolved "https://registry.npmjs.org/eslint-scope/-/eslint-scope-7.2.2.tgz"
  integrity sha512-dOt21O7lTMhDM+X9mB4GX+DZrZtCUJPL/wlcTqxyrx5IvO0IYtILdtrQGQp+8n5S0gwSVmOf9NQrjMOgfQZlIg==
  dependencies:
    esrecurse "^4.3.0"
    estraverse "^5.2.0"

eslint-visitor-keys@^3.3.0, eslint-visitor-keys@^3.4.1, eslint-visitor-keys@^3.4.3:
  version "3.4.3"
  resolved "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz"
  integrity sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==

eslint-visitor-keys@^4.2.0:
  version "4.2.0"
  resolved "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.0.tgz"
  integrity sha512-UyLnSehNt62FFhSwjZlHmeokpRK59rcz29j+F1/aDgbkbRTk7wIc9XzdoasMUbRNKDM0qQt/+BJ4BrpFeABemw==

espree@^9.6.0, espree@^9.6.1:
  version "9.6.1"
  resolved "https://registry.npmjs.org/espree/-/espree-9.6.1.tgz"
  integrity sha512-oruZaFkjorTpF32kDSI5/75ViwGeZginGGy2NoOSg3Q9bnwlnmDm4HLnkl0RE3n+njDXR037aY1+x58Z/zFdwQ==
  dependencies:
    acorn "^8.9.0"
    acorn-jsx "^5.3.2"
    eslint-visitor-keys "^3.4.1"

esquery@^1.4.2:
  version "1.6.0"
  resolved "https://registry.npmjs.org/esquery/-/esquery-1.6.0.tgz"
  integrity sha512-ca9pw9fomFcKPvFLXhBKUK90ZvGibiGOvRJNbjljY7s7uq/5YO4BOzcYtJqExdx99rF6aAcnRxHmcUHcz6sQsg==
  dependencies:
    estraverse "^5.1.0"

esrecurse@^4.3.0:
  version "4.3.0"
  resolved "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz"
  integrity sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==
  dependencies:
    estraverse "^5.2.0"

estraverse@^5.1.0, estraverse@^5.2.0, estraverse@^5.3.0:
  version "5.3.0"
  resolved "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz"
  integrity sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==

esutils@^2.0.2:
  version "2.0.3"
  resolved "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz"
  integrity sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==

fast-deep-equal@^3.1.1, fast-deep-equal@^3.1.3:
  version "3.1.3"
  resolved "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz"
  integrity sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==

fast-glob@3.3.1:
  version "3.3.1"
  resolved "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz"
  integrity sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==
  dependencies:
    merge2 "^1.3.0"
    micromatch "^4.0.4"
    glob-parent "^5.1.2"
    "@nodelib/fs.stat" "^2.0.2"
    "@nodelib/fs.walk" "^1.2.3"

fast-glob@^3.2.9, fast-glob@^3.3.0, fast-glob@^3.3.2:
  version "3.3.2"
  resolved "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.2.tgz"
  integrity sha512-oX2ruAFQwf/Orj8m737Y5adxDQO0LAB7/S5MnxCdTNDd4p6BsyIVsv9JQsATbTSq8KHRpLwIHbVlUNatxd+1Ow==
  dependencies:
    "@nodelib/fs.stat" "^2.0.2"
    "@nodelib/fs.walk" "^1.2.3"
    glob-parent "^5.1.2"
    merge2 "^1.3.0"
    micromatch "^4.0.4"

fast-json-stable-stringify@^2.0.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz"
  integrity sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==

fast-levenshtein@^2.0.6:
  version "2.0.6"
  resolved "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz"
  integrity sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==

fastq@^1.6.0:
  version "1.17.1"
  resolved "https://registry.npmjs.org/fastq/-/fastq-1.17.1.tgz"
  integrity sha512-sRVD3lWVIXWg6By68ZN7vho9a1pQcN/WBFaAAsDDFzlJjvoGx0P8z7V1t72grFJfJhu3YPZBuu25f7Kaw2jN1w==
  dependencies:
    reusify "^1.0.4"

file-entry-cache@^6.0.1:
  version "6.0.1"
  resolved "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-6.0.1.tgz"
  integrity sha512-7Gps/XWymbLk2QLYK4NzpMOrYjMhdIxXuIvy2QBsLE6ljuodKvdkWs/cpyJJ3CVIVpH0Oi1Hvg1ovbMzLdFBBg==
  dependencies:
    flat-cache "^3.0.4"

fill-range@^7.1.1:
  version "7.1.1"
  resolved "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz"
  integrity sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==
  dependencies:
    to-regex-range "^5.0.1"

find-up@^5.0.0:
  version "5.0.0"
  resolved "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz"
  integrity sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==
  dependencies:
    locate-path "^6.0.0"
    path-exists "^4.0.0"

flat-cache@^3.0.4:
  version "3.2.0"
  resolved "https://registry.npmjs.org/flat-cache/-/flat-cache-3.2.0.tgz"
  integrity sha512-CYcENa+FtcUKLmhhqyctpclsq7QF38pKjZHsGNiSQF5r4FtoKDWabFDl3hzaEQMvT1LHEysw5twgLvpYYb4vbw==
  dependencies:
    flatted "^3.2.9"
    keyv "^4.5.3"
    rimraf "^3.0.2"

flatted@^3.2.9:
  version "3.3.1"
  resolved "https://registry.npmjs.org/flatted/-/flatted-3.3.1.tgz"
  integrity sha512-X8cqMLLie7KsNUDSdzeN8FYK9rEt4Dt67OsG/DNGnYTSDBG4uFAJFBnUeiV+zCVAvwFy56IjM9sH51jVaEhNxw==

for-each@^0.3.3:
  version "0.3.3"
  resolved "https://registry.npmjs.org/for-each/-/for-each-0.3.3.tgz"
  integrity sha512-jqYfLp7mo9vIyQf8ykW2v7A+2N4QjeCeI5+Dz9XraiO1ign81wjiH7Fb9vSOWvQfNtmSa4H2RoQTrrXivdUZmw==
  dependencies:
    is-callable "^1.1.3"

foreground-child@^3.1.0:
  version "3.3.0"
  resolved "https://registry.npmjs.org/foreground-child/-/foreground-child-3.3.0.tgz"
  integrity sha512-Ld2g8rrAyMYFXBhEqMz8ZAHBi4J4uS1i/CxGMDnjyFWddMXLVcDp051DZfu+t7+ab7Wv6SMqpWmyFIj5UbfFvg==
  dependencies:
    cross-spawn "^7.0.0"
    signal-exit "^4.0.1"

fs.realpath@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz"
  integrity sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==

fsevents@~2.3.2:
  version "2.3.3"
  resolved "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz"
  integrity sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==

function-bind@^1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz"
  integrity sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==

function.prototype.name@^1.1.6:
  version "1.1.6"
  resolved "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.1.6.tgz"
  integrity sha512-Z5kx79swU5P27WEayXM1tBi5Ze/lbIyiNgU3qyXUOf9b2rgXYyF9Dy9Cx+IQv/Lc8WCG6L82zwUPpSS9hGehIg==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.2.0"
    es-abstract "^1.22.1"
    functions-have-names "^1.2.3"

function.prototype.name@^1.1.6, function.prototype.name@^1.1.8:
  version "1.1.8"
  resolved "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.1.8.tgz"
  integrity sha512-e5iwyodOHhbMr/yNrc7fDYG4qlbIvI5gajyzPnb5TCwyhjApznQh1BMFou9b30SevY43gCJKXycoCBjMbsuW0Q==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    define-properties "^1.2.1"
    functions-have-names "^1.2.3"
    hasown "^2.0.2"
    is-callable "^1.2.7"

functions-have-names@^1.2.3:
  version "1.2.3"
  resolved "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz"
  integrity sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==

get-intrinsic@^1.1.3, get-intrinsic@^1.2.1, get-intrinsic@^1.2.3, get-intrinsic@^1.2.4:
  version "1.2.4"
  resolved "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.2.4.tgz"
  integrity sha512-5uYhsJH8VJBTv7oslg4BznJYhDoRI6waYCxMmCdnTrcCrHA/fCFKoTFz2JKKE0HdDFUF7/oQuhzumXJK7paBRQ==
  dependencies:
    es-errors "^1.3.0"
    function-bind "^1.1.2"
    has-proto "^1.0.1"
    has-symbols "^1.0.3"
    hasown "^2.0.0"

get-intrinsic@^1.2.4, get-intrinsic@^1.2.5, get-intrinsic@^1.2.6, get-intrinsic@^1.2.7:
  version "1.2.7"
  resolved "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.2.7.tgz"
  integrity sha512-VW6Pxhsrk0KAOqs3WEd0klDiF/+V7gQOpAvY1jVU/LHmaD/kQO4523aiJuikX/QAKYiW6x8Jh+RJej1almdtCA==
  dependencies:
    call-bind-apply-helpers "^1.0.1"
    es-define-property "^1.0.1"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    function-bind "^1.1.2"
    get-proto "^1.0.0"
    gopd "^1.2.0"
    has-symbols "^1.1.0"
    hasown "^2.0.2"
    math-intrinsics "^1.1.0"

get-proto@^1.0.0, get-proto@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz"
  integrity sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==
  dependencies:
    dunder-proto "^1.0.1"
    es-object-atoms "^1.0.0"

get-symbol-description@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.0.2.tgz"
  integrity sha512-g0QYk1dZBxGwk+Ngc+ltRH2IBp2f7zBkBMBJZCDerh6EhlhSR6+9irMCuT/09zD6qkarHUSn529sK/yL4S27mg==
  dependencies:
    call-bind "^1.0.5"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.4"

get-symbol-description@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz"
  integrity sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==
  dependencies:
    call-bound "^1.0.3"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.6"

get-tsconfig@^4.7.5:
  version "4.8.0"
  resolved "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.8.0.tgz"
  integrity sha512-Pgba6TExTZ0FJAn1qkJAjIeKoDJ3CsI2ChuLohJnZl/tTU8MVrq3b+2t5UOPfRa4RMsorClBjJALkJUMjG1PAw==
  dependencies:
    resolve-pkg-maps "^1.0.0"

glob@^7.1.3:
  version "7.2.3"
  resolved "https://registry.npmjs.org/glob/-/glob-7.2.3.tgz"
  integrity sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==
  dependencies:
    once "^1.3.0"
    inflight "^1.0.4"
    inherits "2"
    minimatch "^3.1.1"
    fs.realpath "^1.0.0"
    path-is-absolute "^1.0.0"

glob@^10.3.10:
  version "10.4.5"
  resolved "https://registry.npmjs.org/glob/-/glob-10.4.5.tgz"
  integrity sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==
  dependencies:
    minipass "^7.1.2"
    jackspeak "^3.1.2"
    minimatch "^9.0.4"
    path-scurry "^1.11.1"
    foreground-child "^3.1.0"
    package-json-from-dist "^1.0.0"

glob-parent@^5.1.2, glob-parent@~5.1.2:
  version "5.1.2"
  resolved "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz"
  integrity sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==
  dependencies:
    is-glob "^4.0.1"

glob-parent@^6.0.2:
  version "6.0.2"
  resolved "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz"
  integrity sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==
  dependencies:
    is-glob "^4.0.3"

globals@^13.19.0:
  version "13.24.0"
  resolved "https://registry.npmjs.org/globals/-/globals-13.24.0.tgz"
  integrity sha512-AhO5QUcj8llrbG09iWhPU2B204J1xnPeL8kQmVorSsy+Sjj1sk8gIyh6cUocGmH4L0UuhAJy+hJMRA4mgA4mFQ==
  dependencies:
    type-fest "^0.20.2"

globalthis@^1.0.3, globalthis@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz"
  integrity sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==
  dependencies:
    define-properties "^1.2.1"
    gopd "^1.0.1"

globby@^11.1.0:
  version "11.1.0"
  resolved "https://registry.npmjs.org/globby/-/globby-11.1.0.tgz"
  integrity sha512-jhIXaOzy1sb8IyocaruWSn1TjmnBVs8Ayhcy83rmxNJ8q2uWKCAj3CnJY+KpGSXCueAPc0i05kVvVKtP1t9S3g==
  dependencies:
    slash "^3.0.0"
    ignore "^5.2.0"
    merge2 "^1.4.1"
    dir-glob "^3.0.1"
    fast-glob "^3.2.9"
    array-union "^2.1.0"

gopd@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/gopd/-/gopd-1.0.1.tgz"
  integrity sha512-d65bNlIadxvpb/A2abVdlqKqV563juRnZ1Wtk6s1sIR8uNsXR70xqIzVqxVf1eTqDunwT2MkczEeaezCKTZhwA==
  dependencies:
    get-intrinsic "^1.1.3"

gopd@^1.0.1, gopd@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz"
  integrity sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==

graceful-fs@^4.2.11, graceful-fs@^4.2.4:
  version "4.2.11"
  resolved "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz"
  integrity sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==

graphemer@^1.4.0:
  version "1.4.0"
  resolved "https://registry.npmjs.org/graphemer/-/graphemer-1.4.0.tgz"
  integrity sha512-EtKwoO6kxCL9WO5xipiHTZlSzBm7WLT627TqC/uVRd0HKmq8NXyebnNYxDoBi7wt8eTWrUrKXCOVaFq9x1kgag==

has-bigints@^1.0.1, has-bigints@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/has-bigints/-/has-bigints-1.0.2.tgz"
  integrity sha512-tSvCKtBr9lkF0Ex0aQiP9N+OpV4zi2r/Nee5VkRDbaqv35RLYMzbwQfFSZZH0kR+Rd6302UJZ2p/bJCEoR3VoQ==

has-flag@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz"
  integrity sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==

has-property-descriptors@^1.0.0, has-property-descriptors@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz"
  integrity sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==
  dependencies:
    es-define-property "^1.0.0"

has-proto@^1.0.1, has-proto@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/has-proto/-/has-proto-1.0.3.tgz"
  integrity sha512-SJ1amZAJUiZS+PhsVLf5tGydlaVB8EdFpaSO4gmiUKUOxk8qzn5AIy4ZeJUmh22znIdk/uMAUT2pl3FxzVUH+Q==

has-proto@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz"
  integrity sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==
  dependencies:
    dunder-proto "^1.0.0"

has-symbols@^1.0.2, has-symbols@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.3.tgz"
  integrity sha512-l3LCuF6MgDNwTDKkdYGEihYjt5pRPbEg46rtlmnSPlUbgmB8LOIrKJbYYFBSbnPaJexMKtiPO8hmeRjRz2Td+A==

has-symbols@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz"
  integrity sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==

has-tostringtag@^1.0.0, has-tostringtag@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz"
  integrity sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==
  dependencies:
    has-symbols "^1.0.3"

hasown@^2.0.0, hasown@^2.0.1, hasown@^2.0.2:
  version "2.0.2"
  resolved "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz"
  integrity sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==
  dependencies:
    function-bind "^1.1.2"

ignore@^5.2.0, ignore@^5.3.1:
  version "5.3.2"
  resolved "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz"
  integrity sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==

import-fresh@^3.2.1:
  version "3.3.0"
  resolved "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.0.tgz"
  integrity sha512-veYYhQa+D1QBKznvhUHxb8faxlrwUnxseDAbAp457E0wLNio2bOSKnjYDhMj+YiAq61xrMGhQk9iXVk5FzgQMw==
  dependencies:
    parent-module "^1.0.0"
    resolve-from "^4.0.0"

imurmurhash@^0.1.4:
  version "0.1.4"
  resolved "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz"
  integrity sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==

inflight@^1.0.4:
  version "1.0.6"
  resolved "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz"
  integrity sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==
  dependencies:
    once "^1.3.0"
    wrappy "1"

inherits@2:
  version "2.0.4"
  resolved "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz"
  integrity sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==

internal-slot@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/internal-slot/-/internal-slot-1.0.7.tgz"
  integrity sha512-NGnrKwXzSms2qUUih/ILZ5JBqNTSa1+ZmP6flaIp6KmSElgE9qdndzS3cqjrDovwFdmwsGsLdeFgB6suw+1e9g==
  dependencies:
    es-errors "^1.3.0"
    hasown "^2.0.0"
    side-channel "^1.0.4"

internal-slot@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz"
  integrity sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==
  dependencies:
    es-errors "^1.3.0"
    hasown "^2.0.2"
    side-channel "^1.1.0"

is-array-buffer@^3.0.4:
  version "3.0.4"
  resolved "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.4.tgz"
  integrity sha512-wcjaerHw0ydZwfhiKbXJWLDY8A7yV7KhjQOpb83hGgGfId/aQa4TOvwyzn2PuswW2gPCYEL/nEAiSVpdOj1lXw==
  dependencies:
    call-bind "^1.0.2"
    get-intrinsic "^1.2.1"

is-array-buffer@^3.0.4, is-array-buffer@^3.0.5:
  version "3.0.5"
  resolved "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz"
  integrity sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    get-intrinsic "^1.2.6"

is-async-function@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/is-async-function/-/is-async-function-2.0.0.tgz"
  integrity sha512-Y1JXKrfykRJGdlDwdKlLpLyMIiWqWvuSd17TvZk68PLAOGOoF4Xyav1z0Xhoi+gCYjZVeC5SI+hYFOfvXmGRCA==
  dependencies:
    has-tostringtag "^1.0.0"

is-bigint@^1.0.1:
  version "1.0.4"
  resolved "https://registry.npmjs.org/is-bigint/-/is-bigint-1.0.4.tgz"
  integrity sha512-zB9CruMamjym81i2JZ3UMn54PKGsQzsJeo6xvN3HJJ4CAsQNB6iRutp2To77OfCNuoxspsIhzaPoO1zyCEhFOg==
  dependencies:
    has-bigints "^1.0.1"

is-bigint@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz"
  integrity sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==
  dependencies:
    has-bigints "^1.0.2"

is-binary-path@~2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz"
  integrity sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==
  dependencies:
    binary-extensions "^2.0.0"

is-boolean-object@^1.1.0:
  version "1.1.2"
  resolved "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.1.2.tgz"
  integrity sha512-gDYaKHJmnj4aWxyj6YHyXVpdQawtVLHU5cb+eztPGczf6cjuTdwve5ZIEfgXqH4e57An1D1AKf8CZ3kYrQRqYA==
  dependencies:
    call-bind "^1.0.2"
    has-tostringtag "^1.0.0"

is-boolean-object@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.1.tgz"
  integrity sha512-l9qO6eFlUETHtuihLcYOaLKByJ1f+N4kthcU9YjHy3N+B3hWv0y/2Nd0mu/7lTFnRQHTrSdXF50HQ3bl5fEnng==
  dependencies:
    call-bound "^1.0.2"
    has-tostringtag "^1.0.2"

is-bun-module@^1.0.2:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-bun-module/-/is-bun-module-1.1.0.tgz"
  integrity sha512-4mTAVPlrXpaN3jtF0lsnPCMGnq4+qZjVIKq0HCpfcqf8OC1SM5oATCIAPM5V5FN05qp2NNnFndphmdZS9CV3hA==
  dependencies:
    semver "^7.6.3"

is-callable@^1.1.3, is-callable@^1.1.4, is-callable@^1.2.7:
  version "1.2.7"
  resolved "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz"
  integrity sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==

is-core-module@^2.13.0, is-core-module@^2.15.1:
  version "2.15.1"
  resolved "https://registry.npmjs.org/is-core-module/-/is-core-module-2.15.1.tgz"
  integrity sha512-z0vtXSwucUJtANQWldhbtbt7BnL0vxiFjIdDLAatwhDYty2bad6s+rijD6Ri4YuYJubLzIJLUidCh09e1djEVQ==
  dependencies:
    hasown "^2.0.2"

is-data-view@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.1.tgz"
  integrity sha512-AHkaJrsUVW6wq6JS8y3JnM/GJF/9cf+k20+iDzlSaJrinEo5+7vRiteOSwBhHRiAyQATN1AmY4hwzxJKPmYf+w==
  dependencies:
    is-typed-array "^1.1.13"

is-data-view@^1.0.1, is-data-view@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz"
  integrity sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==
  dependencies:
    call-bound "^1.0.2"
    get-intrinsic "^1.2.6"
    is-typed-array "^1.1.13"

is-date-object@^1.0.1, is-date-object@^1.0.5:
  version "1.0.5"
  resolved "https://registry.npmjs.org/is-date-object/-/is-date-object-1.0.5.tgz"
  integrity sha512-9YQaSxsAiSwcvS33MBk3wTCVnWK+HhF8VZR2jRxehM16QcVOdHqPn4VPHmRK4lSr38n9JriurInLcP90xsYNfQ==
  dependencies:
    has-tostringtag "^1.0.0"

is-date-object@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz"
  integrity sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==
  dependencies:
    call-bound "^1.0.2"
    has-tostringtag "^1.0.2"

is-extglob@^2.1.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz"
  integrity sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==

is-finalizationregistry@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.0.2.tgz"
  integrity sha512-0by5vtUJs8iFQb5TYUHHPudOR+qXYIMKtiUzvLIZITZUjknFmziyBJuLhVRc+Ds0dREFlskDNJKYIdIzu/9pfw==
  dependencies:
    call-bind "^1.0.2"

is-finalizationregistry@^1.1.0:
  version "1.1.1"
  resolved "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz"
  integrity sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==
  dependencies:
    call-bound "^1.0.3"

is-fullwidth-code-point@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz"
  integrity sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==

is-generator-function@^1.0.10:
  version "1.0.10"
  resolved "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.0.10.tgz"
  integrity sha512-jsEjy9l3yiXEQ+PsXdmBwEPcOxaXWLspKdplFUVI9vq1iZgIekeC0L167qeu86czQaxed3q/Uzuw0swL0irL8A==
  dependencies:
    has-tostringtag "^1.0.0"

is-glob@^4.0.0, is-glob@^4.0.1, is-glob@^4.0.3, is-glob@~4.0.1:
  version "4.0.3"
  resolved "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz"
  integrity sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==
  dependencies:
    is-extglob "^2.1.1"

is-map@^2.0.3:
  version "2.0.3"
  resolved "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz"
  integrity sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==

is-negative-zero@^2.0.3:
  version "2.0.3"
  resolved "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz"
  integrity sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==

is-number@^7.0.0:
  version "7.0.0"
  resolved "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz"
  integrity sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==

is-number-object@^1.0.4:
  version "1.0.7"
  resolved "https://registry.npmjs.org/is-number-object/-/is-number-object-1.0.7.tgz"
  integrity sha512-k1U0IRzLMo7ZlYIfzRu23Oh6MiIFasgpb9X76eqfFZAqwH44UI4KTBvBYIZ1dSL9ZzChTB9ShHfLkR4pdW5krQ==
  dependencies:
    has-tostringtag "^1.0.0"

is-number-object@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz"
  integrity sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==
  dependencies:
    call-bound "^1.0.3"
    has-tostringtag "^1.0.2"

is-path-inside@^3.0.3:
  version "3.0.3"
  resolved "https://registry.npmjs.org/is-path-inside/-/is-path-inside-3.0.3.tgz"
  integrity sha512-Fd4gABb+ycGAmKou8eMftCupSir5lRxqf4aD/vd0cD2qc4HL07OjCeuHMr8Ro4CoMaeCKDB0/ECBOVWjTwUvPQ==

is-regex@^1.1.4:
  version "1.1.4"
  resolved "https://registry.npmjs.org/is-regex/-/is-regex-1.1.4.tgz"
  integrity sha512-kvRdxDsxZjhzUX07ZnLydzS1TU/TJlTUHHY4YLL87e37oUA49DfkLqgy+VjFocowy29cKvcSiu+kIv728jTTVg==
  dependencies:
    call-bind "^1.0.2"
    has-tostringtag "^1.0.0"

is-regex@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz"
  integrity sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==
  dependencies:
    call-bound "^1.0.2"
    gopd "^1.2.0"
    has-tostringtag "^1.0.2"
    hasown "^2.0.2"

is-set@^2.0.3:
  version "2.0.3"
  resolved "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz"
  integrity sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==

is-shared-array-buffer@^1.0.2, is-shared-array-buffer@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.3.tgz"
  integrity sha512-nA2hv5XIhLR3uVzDDfCIknerhx8XUKnstuOERPNNIinXG7v9u+ohXF67vxm4TPTEPU6lm61ZkwP3c9PCB97rhg==
  dependencies:
    call-bind "^1.0.7"

is-shared-array-buffer@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz"
  integrity sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==
  dependencies:
    call-bound "^1.0.3"

is-string@^1.0.5, is-string@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/is-string/-/is-string-1.0.7.tgz"
  integrity sha512-tE2UXzivje6ofPW7l23cjDOMa09gb7xlAqG6jG5ej6uPV32TlWP3NKPigtaGeHNu9fohccRYvIiZMfOOnOYUtg==
  dependencies:
    has-tostringtag "^1.0.0"

is-string@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz"
  integrity sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==
  dependencies:
    call-bound "^1.0.3"
    has-tostringtag "^1.0.2"

is-symbol@^1.0.2, is-symbol@^1.0.3, is-symbol@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/is-symbol/-/is-symbol-1.0.4.tgz"
  integrity sha512-C/CPBqKWnvdcxqIARxyOh4v1UUEOCHpgDa0WYgpKDFMszcrPcffg5uhwSgPCLD2WWxmq6isisz87tzT01tuGhg==
  dependencies:
    has-symbols "^1.0.2"

is-symbol@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz"
  integrity sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==
  dependencies:
    call-bound "^1.0.2"
    has-symbols "^1.1.0"
    safe-regex-test "^1.1.0"

is-typed-array@^1.1.13:
  version "1.1.13"
  resolved "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.13.tgz"
  integrity sha512-uZ25/bUAlUY5fR4OKT4rZQEBrzQWYV9ZJYGGsUmEJ6thodVJ1HX64ePQ6Z0qPWP+m+Uq6e9UugrE38jeYsDSMw==
  dependencies:
    which-typed-array "^1.1.14"

is-typed-array@^1.1.13, is-typed-array@^1.1.14, is-typed-array@^1.1.15:
  version "1.1.15"
  resolved "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz"
  integrity sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==
  dependencies:
    which-typed-array "^1.1.16"

is-weakmap@^2.0.2:
  version "2.0.2"
  resolved "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz"
  integrity sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==

is-weakref@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/is-weakref/-/is-weakref-1.0.2.tgz"
  integrity sha512-qctsuLZmIQ0+vSSMfoVvyFe2+GSEvnmZ2ezTup1SBse9+twCCeial6EEi3Nc2KFcf6+qz2FBPnjXsk8xhKSaPQ==
  dependencies:
    call-bind "^1.0.2"

is-weakref@^1.0.2, is-weakref@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.0.tgz"
  integrity sha512-SXM8Nwyys6nT5WP6pltOwKytLV7FqQ4UiibxVmW+EIosHcmCqkkjViTb5SNssDlkCiEYRP1/pdWUKVvZBmsR2Q==
  dependencies:
    call-bound "^1.0.2"

is-weakset@^2.0.3:
  version "2.0.3"
  resolved "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.3.tgz"
  integrity sha512-LvIm3/KWzS9oRFHugab7d+M/GcBXuXX5xZkzPmN+NxihdQlZUQ4dWuSV1xR/sq6upL1TJEDrfBgRepHFdBtSNQ==
  dependencies:
    call-bind "^1.0.7"
    get-intrinsic "^1.2.4"

isarray@^2.0.5:
  version "2.0.5"
  resolved "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz"
  integrity sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==

isexe@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz"
  integrity sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==

iterator.prototype@^1.1.4:
  version "1.1.5"
  resolved "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz"
  integrity sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==
  dependencies:
    define-data-property "^1.1.4"
    es-object-atoms "^1.0.0"
    get-intrinsic "^1.2.6"
    get-proto "^1.0.0"
    has-symbols "^1.1.0"
    set-function-name "^2.0.2"

jackspeak@^3.1.2:
  version "3.4.3"
  resolved "https://registry.npmjs.org/jackspeak/-/jackspeak-3.4.3.tgz"
  integrity sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==
  dependencies:
    "@isaacs/cliui" "^8.0.2"
  optionalDependencies:
    "@pkgjs/parseargs" "^0.11.0"

jiti@^1.21.0:
  version "1.21.6"
  resolved "https://registry.npmjs.org/jiti/-/jiti-1.21.6.tgz"
  integrity sha512-2yTgeWTWzMWkHu6Jp9NKgePDaYHbntiwvYuuJLbbN9vl7DC9DvXKOB2BC3ZZ92D3cvV/aflH0osDfwpHepQ53w==

"js-tokens@^3.0.0 || ^4.0.0":
  version "4.0.0"
  resolved "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz"
  integrity sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==

js-yaml@^4.1.0:
  version "4.1.0"
  resolved "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.0.tgz"
  integrity sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==
  dependencies:
    argparse "^2.0.1"

json-buffer@3.0.1:
  version "3.0.1"
  resolved "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz"
  integrity sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==

json-schema-traverse@^0.4.1:
  version "0.4.1"
  resolved "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz"
  integrity sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==

json-stable-stringify-without-jsonify@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz"
  integrity sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==

json5@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/json5/-/json5-1.0.2.tgz"
  integrity sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==
  dependencies:
    minimist "^1.2.0"

"jsx-ast-utils@^2.4.1 || ^3.0.0", jsx-ast-utils@^3.3.5:
  version "3.3.5"
  resolved "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz"
  integrity sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==
  dependencies:
    array-includes "^3.1.6"
    array.prototype.flat "^1.3.1"
    object.assign "^4.1.4"
    object.values "^1.1.6"

keyv@^4.5.3:
  version "4.5.4"
  resolved "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz"
  integrity sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==
  dependencies:
    json-buffer "3.0.1"

language-subtag-registry@^0.3.20:
  version "0.3.23"
  resolved "https://registry.npmjs.org/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz"
  integrity sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==

language-tags@^1.0.9:
  version "1.0.9"
  resolved "https://registry.npmjs.org/language-tags/-/language-tags-1.0.9.tgz"
  integrity sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==
  dependencies:
    language-subtag-registry "^0.3.20"

levn@^0.4.1:
  version "0.4.1"
  resolved "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz"
  integrity sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==
  dependencies:
    prelude-ls "^1.2.1"
    type-check "~0.4.0"

lilconfig@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/lilconfig/-/lilconfig-2.1.0.tgz"
  integrity sha512-utWOt/GHzuUxnLKxB6dk81RoOeoNeHgbrXiuGk4yyF5qlRz+iIVWu56E2fqGHFrXz0QNUhLB/8nKqvRH66JKGQ==

lilconfig@^3.0.0:
  version "3.1.2"
  resolved "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.2.tgz"
  integrity sha512-eop+wDAvpItUys0FWkHIKeC9ybYrTGbU41U5K7+bttZZeohvnY7M9dZ5kB21GNWiFT2q1OoPTvncPCgSOVO5ow==

lines-and-columns@^1.1.6:
  version "1.2.4"
  resolved "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz"
  integrity sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==

locate-path@^6.0.0:
  version "6.0.0"
  resolved "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz"
  integrity sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==
  dependencies:
    p-locate "^5.0.0"

lodash.merge@^4.6.2:
  version "4.6.2"
  resolved "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz"
  integrity sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==

loose-envify@^1.1.0, loose-envify@^1.4.0:
  version "1.4.0"
  resolved "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz"
  integrity sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==
  dependencies:
    js-tokens "^3.0.0 || ^4.0.0"

lru-cache@^10.2.0:
  version "10.4.3"
  resolved "https://registry.npmjs.org/lru-cache/-/lru-cache-10.4.3.tgz"
  integrity sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==

lucide-react@^0.438.0:
  version "0.438.0"
  resolved "https://registry.npmjs.org/lucide-react/-/lucide-react-0.438.0.tgz"
  integrity sha512-uq6yCB+IzVfgIPMK8ibkecXSWTTSOMs9UjUgZigfrDCVqgdwkpIgYg1fSYnf0XXF2AoSyCJZhoZXQwzoai7VGw==

math-intrinsics@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz"
  integrity sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==

merge2@^1.3.0, merge2@^1.4.1:
  version "1.4.1"
  resolved "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz"
  integrity sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==

micromatch@^4.0.4, micromatch@^4.0.5:
  version "4.0.8"
  resolved "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz"
  integrity sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==
  dependencies:
    braces "^3.0.3"
    picomatch "^2.3.1"

minimatch@^3.0.5, minimatch@^3.1.1, minimatch@^3.1.2:
  version "3.1.2"
  resolved "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz"
  integrity sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==
  dependencies:
    brace-expansion "^1.1.7"

minimatch@9.0.3:
  version "9.0.3"
  resolved "https://registry.npmjs.org/minimatch/-/minimatch-9.0.3.tgz"
  integrity sha512-RHiac9mvaRw0x3AYRgDC1CxAP7HTcNrrECeA8YYJeWnpo+2Q5CegtZjaotWTWxDG3UeGA1coE05iH1mPjT/2mg==
  dependencies:
    brace-expansion "^2.0.1"

minimatch@^9.0.4:
  version "9.0.5"
  resolved "https://registry.npmjs.org/minimatch/-/minimatch-9.0.5.tgz"
  integrity sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==
  dependencies:
    brace-expansion "^2.0.1"

minimist@^1.2.0, minimist@^1.2.6:
  version "1.2.8"
  resolved "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz"
  integrity sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==

"minipass@^5.0.0 || ^6.0.2 || ^7.0.0", minipass@^7.1.2:
  version "7.1.2"
  resolved "https://registry.npmjs.org/minipass/-/minipass-7.1.2.tgz"
  integrity sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==

ms@2.1.2, ms@^2.1.1:
  version "2.1.2"
  resolved "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz"
  integrity sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==

mz@^2.7.0:
  version "2.7.0"
  resolved "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz"
  integrity sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==
  dependencies:
    any-promise "^1.0.0"
    object-assign "^4.0.1"
    thenify-all "^1.0.0"

nanoid@^3.3.6, nanoid@^3.3.7:
  version "3.3.7"
  resolved "https://registry.npmjs.org/nanoid/-/nanoid-3.3.7.tgz"
  integrity sha512-eSRppjcPIatRIMC1U6UngP8XFcz8MQWGQdt1MTBQ7NaAmvXDfvNxbvWV3x2y6CdEUciCSsDHDQZbhYaB8QEo2g==

natural-compare@^1.4.0:
  version "1.4.0"
  resolved "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz"
  integrity sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==

next@14.2.23:
  version "14.2.23"
  resolved "https://registry.npmjs.org/next/-/next-14.2.23.tgz"
  integrity sha512-mjN3fE6u/tynneLiEg56XnthzuYw+kD7mCujgVqioxyPqbmiotUCGJpIZGS/VaPg3ZDT1tvWxiVyRzeqJFm/kw==
  dependencies:
    busboy "1.6.0"
    postcss "8.4.31"
    "@next/env" "14.2.23"
    styled-jsx "5.1.1"
    graceful-fs "^4.2.11"
    "@swc/helpers" "0.5.5"
    caniuse-lite "^1.0.30001579"
  optionalDependencies:
    "@next/swc-darwin-x64" "14.2.23"
    "@next/swc-darwin-arm64" "14.2.23"
    "@next/swc-linux-x64-gnu" "14.2.23"
    "@next/swc-linux-x64-musl" "14.2.23"
    "@next/swc-win32-x64-msvc" "14.2.23"
    "@next/swc-linux-arm64-gnu" "14.2.23"
    "@next/swc-win32-ia32-msvc" "14.2.23"
    "@next/swc-linux-arm64-musl" "14.2.23"
    "@next/swc-win32-arm64-msvc" "14.2.23"

normalize-path@^3.0.0, normalize-path@~3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz"
  integrity sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==

object-assign@^4.0.1, object-assign@^4.1.1:
  version "4.1.1"
  resolved "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz"
  integrity sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==

object-hash@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz"
  integrity sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==

object-inspect@^1.13.1:
  version "1.13.2"
  resolved "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.2.tgz"
  integrity sha512-IRZSRuzJiynemAXPYtPe5BoI/RESNYR7TYm50MC5Mqbd3Jmw5y790sErYw3V6SryFJD64b74qQQs9wn5Bg/k3g==

object-inspect@^1.13.3:
  version "1.13.3"
  resolved "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.3.tgz"
  integrity sha512-kDCGIbxkDSXE3euJZZXzc6to7fCrKHNI/hSRQnRuQ+BWjFNzZwiFF8fj/6o2t2G9/jTj8PSIYTfCLelLZEeRpA==

object-keys@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz"
  integrity sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==

object.assign@^4.1.4, object.assign@^4.1.5:
  version "4.1.5"
  resolved "https://registry.npmjs.org/object.assign/-/object.assign-4.1.5.tgz"
  integrity sha512-byy+U7gp+FVwmyzKPYhW2h5l3crpmGsxl7X2s8y43IgxvG4g3QZ6CffDtsNQy1WsmZpQbO+ybo0AlW7TY6DcBQ==
  dependencies:
    call-bind "^1.0.5"
    define-properties "^1.2.1"
    has-symbols "^1.0.3"
    object-keys "^1.1.1"

object.assign@^4.1.7:
  version "4.1.7"
  resolved "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz"
  integrity sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"
    has-symbols "^1.1.0"
    object-keys "^1.1.1"

object.entries@^1.1.8:
  version "1.1.8"
  resolved "https://registry.npmjs.org/object.entries/-/object.entries-1.1.8.tgz"
  integrity sha512-cmopxi8VwRIAw/fkijJohSfpef5PdN0pMQJN6VC/ZKvn0LIknWD8KtgY6KlQdEc4tIjcQ3HxSMmnvtzIscdaYQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

object.fromentries@^2.0.8:
  version "2.0.8"
  resolved "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz"
  integrity sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-object-atoms "^1.0.0"

object.groupby@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/object.groupby/-/object.groupby-1.0.3.tgz"
  integrity sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"

object.values@^1.1.6, object.values@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/object.values/-/object.values-1.2.0.tgz"
  integrity sha512-yBYjY9QX2hnRmZHAjG/f13MzmBzxzYgQhFrke06TTyKY5zSTEqkOeukBzIdVA3j3ulu8Qa3MbVFShV7T2RmGtQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

object.values@^1.2.0, object.values@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz"
  integrity sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

once@^1.3.0:
  version "1.4.0"
  resolved "https://registry.npmjs.org/once/-/once-1.4.0.tgz"
  integrity sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==
  dependencies:
    wrappy "1"

optionator@^0.9.3:
  version "0.9.4"
  resolved "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz"
  integrity sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==
  dependencies:
    prelude-ls "^1.2.1"
    deep-is "^0.1.3"
    word-wrap "^1.2.5"
    type-check "^0.4.0"
    levn "^0.4.1"
    fast-levenshtein "^2.0.6"

own-keys@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/own-keys/-/own-keys-1.0.1.tgz"
  integrity sha512-qFOyK5PjiWZd+QQIh+1jhdb9LpxTF0qs7Pm8o5QHYZ0M3vKqSqzsZaEB6oWlxZ+q2sJBMI/Ktgd2N5ZwQoRHfg==
  dependencies:
    get-intrinsic "^1.2.6"
    object-keys "^1.1.1"
    safe-push-apply "^1.0.0"

p-limit@^3.0.2:
  version "3.1.0"
  resolved "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz"
  integrity sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==
  dependencies:
    yocto-queue "^0.1.0"

p-locate@^5.0.0:
  version "5.0.0"
  resolved "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz"
  integrity sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==
  dependencies:
    p-limit "^3.0.2"

package-json-from-dist@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/package-json-from-dist/-/package-json-from-dist-1.0.0.tgz"
  integrity sha512-dATvCeZN/8wQsGywez1mzHtTlP22H8OEfPrVMLNr4/eGa+ijtLn/6M5f0dY8UKNrC2O9UCU6SSoG3qRKnt7STw==

parent-module@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz"
  integrity sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==
  dependencies:
    callsites "^3.0.0"

path-exists@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz"
  integrity sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==

path-is-absolute@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz"
  integrity sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==

path-key@^3.1.0:
  version "3.1.1"
  resolved "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz"
  integrity sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==

path-parse@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz"
  integrity sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==

path-scurry@^1.11.1:
  version "1.11.1"
  resolved "https://registry.npmjs.org/path-scurry/-/path-scurry-1.11.1.tgz"
  integrity sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==
  dependencies:
    minipass "^5.0.0 || ^6.0.2 || ^7.0.0"
    lru-cache "^10.2.0"

path-type@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/path-type/-/path-type-4.0.0.tgz"
  integrity sha512-gDKb8aZMDeD/tZWs9P6+q0J9Mwkdl6xMV8TjnGP3qJVJ06bdMgkbBlLU8IdfOsIsFz2BW1rNVT3XuNEl8zPAvw==

picocolors@^1.0.0, picocolors@^1.0.1:
  version "1.1.0"
  resolved "https://registry.npmjs.org/picocolors/-/picocolors-1.1.0.tgz"
  integrity sha512-TQ92mBOW0l3LeMeyLV6mzy/kWr8lkd/hp3mTg7wYK7zJhuBStmGMBG0BdeDZS/dZx1IukaX6Bk11zcln25o1Aw==

picomatch@^2.0.4, picomatch@^2.2.1, picomatch@^2.3.1:
  version "2.3.1"
  resolved "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz"
  integrity sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==

pify@^2.3.0:
  version "2.3.0"
  resolved "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz"
  integrity sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==

pirates@^4.0.1:
  version "4.0.6"
  resolved "https://registry.npmjs.org/pirates/-/pirates-4.0.6.tgz"
  integrity sha512-saLsH7WeYYPiD25LDuLRRY/i+6HaPYr6G1OUlN39otzkSTxKnubR9RTxS3/Kk50s1g2JTgFwWQDQyplC5/SHZg==

possible-typed-array-names@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.0.0.tgz"
  integrity sha512-d7Uw+eZoloe0EHDIYoe+bQ5WXnGMOpmiZFTuMWCwpjzzkL2nTjcKiAk4hh8TjnGye2TwWOk3UXucZ+3rbmBa8Q==

postcss@8.4.31:
  version "8.4.31"
  resolved "https://registry.npmjs.org/postcss/-/postcss-8.4.31.tgz"
  integrity sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==
  dependencies:
    nanoid "^3.3.6"
    picocolors "^1.0.0"
    source-map-js "^1.0.2"

postcss@>=8.0.9, postcss@^8, postcss@^8.2.14, postcss@^8.4.21, postcss@^8.4.23:
  version "8.4.44"
  resolved "https://registry.npmjs.org/postcss/-/postcss-8.4.44.tgz"
  integrity sha512-Aweb9unOEpQ3ezu4Q00DPvvM2ZTUitJdNKeP/+uQgr1IBIqu574IaZoURId7BKtWMREwzKa9OgzPzezWGPWFQw==
  dependencies:
    nanoid "^3.3.7"
    picocolors "^1.0.1"
    source-map-js "^1.2.0"

postcss-import@^15.1.0:
  version "15.1.0"
  resolved "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz"
  integrity sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==
  dependencies:
    postcss-value-parser "^4.0.0"
    read-cache "^1.0.0"
    resolve "^1.1.7"

postcss-js@^4.0.1:
  version "4.0.1"
  resolved "https://registry.npmjs.org/postcss-js/-/postcss-js-4.0.1.tgz"
  integrity sha512-dDLF8pEO191hJMtlHFPRa8xsizHaM82MLfNkUHdUtVEV3tgTp5oj+8qbEqYM57SLfc74KSbw//4SeJma2LRVIw==
  dependencies:
    camelcase-css "^2.0.1"

postcss-load-config@^4.0.1:
  version "4.0.2"
  resolved "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-4.0.2.tgz"
  integrity sha512-bSVhyJGL00wMVoPUzAVAnbEoWyqRxkjv64tUl427SKnPrENtq6hJwUojroMz2VB+Q1edmi4IfrAPpami5VVgMQ==
  dependencies:
    yaml "^2.3.4"
    lilconfig "^3.0.0"

postcss-nested@^6.0.1:
  version "6.2.0"
  resolved "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz"
  integrity sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==
  dependencies:
    postcss-selector-parser "^6.1.1"

postcss-selector-parser@^6.0.11, postcss-selector-parser@^6.1.1:
  version "6.1.2"
  resolved "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.2.tgz"
  integrity sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==
  dependencies:
    cssesc "^3.0.0"
    util-deprecate "^1.0.2"

postcss-value-parser@^4.0.0:
  version "4.2.0"
  resolved "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz"
  integrity sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==

prelude-ls@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz"
  integrity sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==

prettier@^3.3.3:
  version "3.3.3"
  resolved "https://registry.npmjs.org/prettier/-/prettier-3.3.3.tgz"
  integrity sha512-i2tDNA0O5IrMO757lfrdQZCc2jPNDVntV0m/+4whiDfWaTKfMNgR7Qz0NAeGz/nRqF4m5/6CLzbP4/liHt12Ew==

prop-types@^15.8.1:
  version "15.8.1"
  resolved "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz"
  integrity sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==
  dependencies:
    loose-envify "^1.4.0"
    object-assign "^4.1.1"
    react-is "^16.13.1"

punycode@^2.1.0:
  version "2.3.1"
  resolved "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz"
  integrity sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==

queue-microtask@^1.2.2:
  version "1.2.3"
  resolved "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz"
  integrity sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==

"react@>= 16.8.0 || 17.x.x || ^18.0.0-0", "react@^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0-rc", "react@^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc", react@^18, react@^18.2.0, react@^18.3.1:
  version "18.3.1"
  resolved "https://registry.npmjs.org/react/-/react-18.3.1.tgz"
  integrity sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==
  dependencies:
    loose-envify "^1.1.0"

react-dom@^18, react-dom@^18.2.0:
  version "18.3.1"
  resolved "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz"
  integrity sha512-5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==
  dependencies:
    scheduler "^0.23.2"
    loose-envify "^1.1.0"

react-is@^16.13.1:
  version "16.13.1"
  resolved "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz"
  integrity sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==

read-cache@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz"
  integrity sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==
  dependencies:
    pify "^2.3.0"

readdirp@~3.6.0:
  version "3.6.0"
  resolved "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz"
  integrity sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==
  dependencies:
    picomatch "^2.2.1"

reflect.getprototypeof@^1.0.6:
  version "1.0.6"
  resolved "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.6.tgz"
  integrity sha512-fmfw4XgoDke3kdI6h4xcUz1dG8uaiv5q9gcEwLS4Pnth2kxT+GZ7YehS1JTMGBQmtV7Y4GFGbs2re2NqhdozUg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.1"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.4"
    globalthis "^1.0.3"
    which-builtin-type "^1.1.3"

reflect.getprototypeof@^1.0.9:
  version "1.0.10"
  resolved "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz"
  integrity sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==
  dependencies:
    call-bind "^1.0.8"
    define-properties "^1.2.1"
    es-abstract "^1.23.9"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    get-intrinsic "^1.2.7"
    get-proto "^1.0.1"
    which-builtin-type "^1.2.1"

regexp.prototype.flags@^1.5.2:
  version "1.5.2"
  resolved "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.2.tgz"
  integrity sha512-NcDiDkTLuPR+++OCKB0nWafEmhg/Da8aUPLPMQbK+bxKKCm1/S5he+AqYa4PlMCVBalb4/yxIRub6qkEx5yJbw==
  dependencies:
    call-bind "^1.0.6"
    define-properties "^1.2.1"
    es-errors "^1.3.0"
    set-function-name "^2.0.1"

regexp.prototype.flags@^1.5.3:
  version "1.5.4"
  resolved "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz"
  integrity sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==
  dependencies:
    call-bind "^1.0.8"
    define-properties "^1.2.1"
    es-errors "^1.3.0"
    get-proto "^1.0.1"
    gopd "^1.2.0"
    set-function-name "^2.0.2"

resolve@^1.1.7, resolve@^1.22.2, resolve@^1.22.4:
  version "1.22.8"
  resolved "https://registry.npmjs.org/resolve/-/resolve-1.22.8.tgz"
  integrity sha512-oKWePCxqpd6FlLvGV1VU0x7bkPmmCNolxzjMf4NczoDnQcIWrAF+cPtZn5i6n+RfD2d9i0tzpKnG6Yk168yIyw==
  dependencies:
    is-core-module "^2.13.0"
    path-parse "^1.0.7"
    supports-preserve-symlinks-flag "^1.0.0"

"resolve@^2.0.0-next.5":
  version "2.0.0-next.5"
  resolved "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.5.tgz"
  integrity sha512-U7WjGVG9sH8tvjW5SmGbQuui75FiyjAX72HX15DwBBwF9dNiQZRQAg9nnPhYy+TUnE0+VcrttuvNI8oSxZcocA==
  dependencies:
    is-core-module "^2.13.0"
    path-parse "^1.0.7"
    supports-preserve-symlinks-flag "^1.0.0"

resolve-from@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz"
  integrity sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==

resolve-pkg-maps@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz"
  integrity sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==

reusify@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/reusify/-/reusify-1.0.4.tgz"
  integrity sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==

rimraf@^3.0.2:
  version "3.0.2"
  resolved "https://registry.npmjs.org/rimraf/-/rimraf-3.0.2.tgz"
  integrity sha512-JZkJMZkAGFFPP2YqXZXPbMlMBgsxzE8ILs4lMIX/2o0L9UBw9O/Y3o6wFw/i9YLapcUJWwqbi3kdxIPdC62TIA==
  dependencies:
    glob "^7.1.3"

run-parallel@^1.1.9:
  version "1.2.0"
  resolved "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz"
  integrity sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==
  dependencies:
    queue-microtask "^1.2.2"

safe-array-concat@^1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.2.tgz"
  integrity sha512-vj6RsCsWBCf19jIeHEfkRMw8DPiBb+DMXklQ/1SGDHOMlHdPUkZXFQ2YdplS23zESTijAcurb1aSgJA3AgMu1Q==
  dependencies:
    call-bind "^1.0.7"
    get-intrinsic "^1.2.4"
    has-symbols "^1.0.3"
    isarray "^2.0.5"

safe-array-concat@^1.1.3:
  version "1.1.3"
  resolved "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.3.tgz"
  integrity sha512-AURm5f0jYEOydBj7VQlVvDrjeFgthDdEF5H1dP+6mNpoXOMo1quQqJ4wvJDyRZ9+pO3kGWoOdmV08cSv2aJV6Q==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.2"
    get-intrinsic "^1.2.6"
    has-symbols "^1.1.0"
    isarray "^2.0.5"

safe-push-apply@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz"
  integrity sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==
  dependencies:
    es-errors "^1.3.0"
    isarray "^2.0.5"

safe-regex-test@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.0.3.tgz"
  integrity sha512-CdASjNJPvRa7roO6Ra/gLYBTzYzzPyyBXxIMdGW3USQLyjWEls2RgW5UBTXaQVp+OrpeCK3bLem8smtmheoRuw==
  dependencies:
    call-bind "^1.0.6"
    es-errors "^1.3.0"
    is-regex "^1.1.4"

safe-regex-test@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz"
  integrity sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==
  dependencies:
    call-bound "^1.0.2"
    es-errors "^1.3.0"
    is-regex "^1.2.1"

scheduler@^0.23.2:
  version "0.23.2"
  resolved "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz"
  integrity sha512-UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==
  dependencies:
    loose-envify "^1.1.0"

semver@^6.3.1:
  version "6.3.1"
  resolved "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz"
  integrity sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==

semver@^7.5.4, semver@^7.6.0, semver@^7.6.3:
  version "7.6.3"
  resolved "https://registry.npmjs.org/semver/-/semver-7.6.3.tgz"
  integrity sha512-oVekP1cKtI+CTDvHWYFUcMtsK/00wmAEfyqKfNdARm8u1wNVhSgaX7A8d4UuIlUI5e84iEwOhs7ZPYRmzU9U6A==

set-function-length@^1.2.1, set-function-length@^1.2.2:
  version "1.2.2"
  resolved "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz"
  integrity sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==
  dependencies:
    define-data-property "^1.1.4"
    es-errors "^1.3.0"
    function-bind "^1.1.2"
    get-intrinsic "^1.2.4"
    gopd "^1.0.1"
    has-property-descriptors "^1.0.2"

set-function-name@^2.0.1, set-function-name@^2.0.2:
  version "2.0.2"
  resolved "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz"
  integrity sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==
  dependencies:
    define-data-property "^1.1.4"
    es-errors "^1.3.0"
    functions-have-names "^1.2.3"
    has-property-descriptors "^1.0.2"

set-proto@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz"
  integrity sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==
  dependencies:
    dunder-proto "^1.0.1"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"

shebang-command@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz"
  integrity sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==
  dependencies:
    shebang-regex "^3.0.0"

shebang-regex@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz"
  integrity sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==

side-channel@^1.0.4:
  version "1.0.6"
  resolved "https://registry.npmjs.org/side-channel/-/side-channel-1.0.6.tgz"
  integrity sha512-fDW/EZ6Q9RiO8eFG8Hj+7u/oW+XrPTIChwCOM2+th2A6OblDtYYIpve9m+KvI9Z4C9qSEXlaGR6bTEYHReuglA==
  dependencies:
    call-bind "^1.0.7"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.4"
    object-inspect "^1.13.1"

side-channel@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz"
  integrity sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==
  dependencies:
    es-errors "^1.3.0"
    object-inspect "^1.13.3"
    side-channel-list "^1.0.0"
    side-channel-map "^1.0.1"
    side-channel-weakmap "^1.0.2"

side-channel-list@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.0.tgz"
  integrity sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==
  dependencies:
    es-errors "^1.3.0"
    object-inspect "^1.13.3"

side-channel-map@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz"
  integrity sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==
  dependencies:
    call-bound "^1.0.2"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.5"
    object-inspect "^1.13.3"

side-channel-weakmap@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz"
  integrity sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==
  dependencies:
    call-bound "^1.0.2"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.5"
    object-inspect "^1.13.3"
    side-channel-map "^1.0.1"

signal-exit@^4.0.1:
  version "4.1.0"
  resolved "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz"
  integrity sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==

slash@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/slash/-/slash-3.0.0.tgz"
  integrity sha512-g9Q1haeby36OSStwb4ntCGGGaKsaVSjQ68fBxoQcutl5fS1vuY18H3wSt3jFyFtrkx+Kz0V1G85A4MyAdDMi2Q==

source-map-js@^1.0.2, source-map-js@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.0.tgz"
  integrity sha512-itJW8lvSA0TXEphiRoawsCksnlf8SyvmFzIhltqAHluXd88pkCd+cXJVHTDwdCr0IzwptSm035IHQktUu1QUMg==

streamsearch@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/streamsearch/-/streamsearch-1.1.0.tgz"
  integrity sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==

string-width@^4.1.0, "string-width@npm:string-width@^4.2.0":
  version "4.2.3"
  resolved "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz"
  integrity sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==
  dependencies:
    strip-ansi "^6.0.1"
    emoji-regex "^8.0.0"
    is-fullwidth-code-point "^3.0.0"

string-width@^5.0.1, string-width@^5.1.2:
  version "5.1.2"
  resolved "https://registry.npmjs.org/string-width/-/string-width-5.1.2.tgz"
  integrity sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==
  dependencies:
    strip-ansi "^7.0.1"
    emoji-regex "^9.2.2"
    eastasianwidth "^0.2.0"

string.prototype.includes@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz"
  integrity sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.3"

string.prototype.matchall@^4.0.12:
  version "4.0.12"
  resolved "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.0.12.tgz"
  integrity sha512-6CC9uyBL+/48dYizRf7H7VAYCMCNTBeM78x/VTUe9bFEaxBepPJDa1Ow99LqI/1yF7kuy7Q3cQsYMrcjGUcskA==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    define-properties "^1.2.1"
    es-abstract "^1.23.6"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    get-intrinsic "^1.2.6"
    gopd "^1.2.0"
    has-symbols "^1.1.0"
    internal-slot "^1.1.0"
    regexp.prototype.flags "^1.5.3"
    set-function-name "^2.0.2"
    side-channel "^1.1.0"

string.prototype.repeat@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz"
  integrity sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==
  dependencies:
    define-properties "^1.1.3"
    es-abstract "^1.17.5"

string.prototype.trim@^1.2.9:
  version "1.2.9"
  resolved "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.9.tgz"
  integrity sha512-klHuCNxiMZ8MlsOihJhJEBJAiMVqU3Z2nEXWfWnIqjN0gEFS9J9+IxKozWWtQGcgoa1WUZzLjKPTr4ZHNFTFxw==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.0"
    es-object-atoms "^1.0.0"

string.prototype.trim@^1.2.10:
  version "1.2.10"
  resolved "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.10.tgz"
  integrity sha512-Rs66F0P/1kedk5lyYyH9uBzuiI/kNRmwJAR9quK6VOtIpZ2G+hMZd+HQbbv25MgCA6gEffoMZYxlTod4WcdrKA==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.2"
    define-data-property "^1.1.4"
    define-properties "^1.2.1"
    es-abstract "^1.23.5"
    es-object-atoms "^1.0.0"
    has-property-descriptors "^1.0.2"

string.prototype.trimend@^1.0.8:
  version "1.0.8"
  resolved "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.8.tgz"
  integrity sha512-p73uL5VCHCO2BZZ6krwwQE3kCzM7NKmis8S//xEC6fQonchbum4eP6kR4DLEjQFO3Wnj3Fuo8NM0kOSjVdHjZQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

string.prototype.trimend@^1.0.9:
  version "1.0.9"
  resolved "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.9.tgz"
  integrity sha512-G7Ok5C6E/j4SGfyLCloXTrngQIQU3PWtXGst3yM7Bea9FRURf1S42ZHlZZtsNque2FN2PoUhfZXYLNWwEr4dLQ==
  dependencies:
    call-bind "^1.0.8"
    call-bound "^1.0.2"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

string.prototype.trimstart@^1.0.8:
  version "1.0.8"
  resolved "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz"
  integrity sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

strip-ansi@^6.0.0, strip-ansi@^6.0.1:
  version "6.0.1"
  resolved "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz"
  integrity sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==
  dependencies:
    ansi-regex "^5.0.1"

strip-ansi@^7.0.1:
  version "7.1.0"
  resolved "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.1.0.tgz"
  integrity sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==
  dependencies:
    ansi-regex "^6.0.1"

strip-bom@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz"
  integrity sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==

strip-json-comments@^3.1.1:
  version "3.1.1"
  resolved "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz"
  integrity sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==

styled-jsx@5.1.1:
  version "5.1.1"
  resolved "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.1.tgz"
  integrity sha512-pW7uC1l4mBZ8ugbiZrcIsiIvVx1UmTfw7UkC3Um2tmfUq9Bhk8IiyEIPl6F8agHgjzku6j0xQEZbfA5uSgSaCw==
  dependencies:
    client-only "0.0.1"

sucrase@^3.32.0:
  version "3.35.0"
  resolved "https://registry.npmjs.org/sucrase/-/sucrase-3.35.0.tgz"
  integrity sha512-8EbVDiu9iN/nESwxeSxDKe0dunta1GOlHufmSSXxMD2z2/tMZpDMpvXQGsc+ajGo8y2uYUmixaSRUc/QPoQ0GA==
  dependencies:
    "@jridgewell/gen-mapping" "^0.3.2"
    commander "^4.0.0"
    glob "^10.3.10"
    lines-and-columns "^1.1.6"
    mz "^2.7.0"
    pirates "^4.0.1"
    ts-interface-checker "^0.1.9"

supports-color@^7.1.0:
  version "7.2.0"
  resolved "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz"
  integrity sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==
  dependencies:
    has-flag "^4.0.0"

supports-preserve-symlinks-flag@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz"
  integrity sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==

tailwind-merge@^2.5.2:
  version "2.5.2"
  resolved "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-2.5.2.tgz"
  integrity sha512-kjEBm+pvD+6eAwzJL2Bi+02/9LFLal1Gs61+QB7HvTfQQ0aXwC5LGT8PEt1gS0CWKktKe6ysPTAy3cBC5MeiIg==

"tailwindcss@>=3.0.0 || insiders", tailwindcss@^3.4.1:
  version "3.4.10"
  resolved "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.10.tgz"
  integrity sha512-KWZkVPm7yJRhdu4SRSl9d4AK2wM3a50UsvgHZO7xY77NQr2V+fIrEuoDGQcbvswWvFGbS2f6e+jC/6WJm1Dl0w==
  dependencies:
    arg "^5.0.2"
    dlv "^1.1.3"
    jiti "^1.21.0"
    is-glob "^4.0.3"
    postcss "^8.4.23"
    resolve "^1.22.2"
    sucrase "^3.32.0"
    chokidar "^3.5.3"
    fast-glob "^3.3.0"
    lilconfig "^2.1.0"
    didyoumean "^1.2.2"
    micromatch "^4.0.5"
    picocolors "^1.0.0"
    postcss-js "^4.0.1"
    glob-parent "^6.0.2"
    object-hash "^3.0.0"
    normalize-path "^3.0.0"
    postcss-import "^15.1.0"
    postcss-nested "^6.0.1"
    "@alloc/quick-lru" "^5.2.0"
    postcss-load-config "^4.0.1"
    postcss-selector-parser "^6.0.11"

tailwindcss-animate@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/tailwindcss-animate/-/tailwindcss-animate-1.0.7.tgz"
  integrity sha512-bl6mpH3T7I3UFxuvDEXLxy/VuFxBk5bbzplh7tXI68mwMokNYd1t9qPBHlnyTwfa4JGC4zP516I1hYYtQ/vspA==

tapable@^2.2.0:
  version "2.2.1"
  resolved "https://registry.npmjs.org/tapable/-/tapable-2.2.1.tgz"
  integrity sha512-GNzQvQTOIP6RyTfE2Qxb8ZVlNmw0n88vp1szwWRimP02mnTsx3Wtn5qRdqY9w2XduFNUgvOwhNnQsjwCp+kqaQ==

text-table@^0.2.0:
  version "0.2.0"
  resolved "https://registry.npmjs.org/text-table/-/text-table-0.2.0.tgz"
  integrity sha512-N+8UisAXDGk8PFXP4HAzVR9nbfmVJ3zYLAWiTIoqC5v5isinhr+r5uaO8+7r3BMfuNIufIsA7RdpVgacC2cSpw==

"thenify@>= 3.1.0 < 4":
  version "3.3.1"
  resolved "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz"
  integrity sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==
  dependencies:
    any-promise "^1.0.0"

thenify-all@^1.0.0:
  version "1.6.0"
  resolved "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz"
  integrity sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==
  dependencies:
    thenify ">= 3.1.0 < 4"

to-regex-range@^5.0.1:
  version "5.0.1"
  resolved "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz"
  integrity sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==
  dependencies:
    is-number "^7.0.0"

ts-api-utils@^1.0.1:
  version "1.3.0"
  resolved "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-1.3.0.tgz"
  integrity sha512-UQMIo7pb8WRomKR1/+MFVLTroIvDVtMX3K6OUir8ynLyzB8Jeriont2bTAtmNPa1ekAgN7YPDyf6V+ygrdU+eQ==

ts-api-utils@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.0.0.tgz"
  integrity sha512-xCt/TOAc+EOHS1XPnijD3/yzpH6qg2xppZO1YDqGoVsNXfQfzHpOdNuXwrwOU8u4ITXJyDCTyt8w5g1sZv9ynQ==

ts-interface-checker@^0.1.9:
  version "0.1.13"
  resolved "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz"
  integrity sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==

tsconfig-paths@^3.15.0:
  version "3.15.0"
  resolved "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz"
  integrity sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==
  dependencies:
    json5 "^1.0.2"
    minimist "^1.2.6"
    strip-bom "^3.0.0"
    "@types/json5" "^0.0.29"

tslib@^2.4.0:
  version "2.7.0"
  resolved "https://registry.npmjs.org/tslib/-/tslib-2.7.0.tgz"
  integrity sha512-gLXCKdN1/j47AiHiOkJN69hJmcbGTHI0ImLmbYLHykhgeN0jVGola9yVjFgzCUklsZQMW55o+dW7IXv3RCXDzA==

type-check@^0.4.0:
  version "0.4.0"
  resolved "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz"
  integrity sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==
  dependencies:
    prelude-ls "^1.2.1"

type-fest@^0.20.2:
  version "0.20.2"
  resolved "https://registry.npmjs.org/type-fest/-/type-fest-0.20.2.tgz"
  integrity sha512-Ne+eE4r0/iWnpAxD852z3A+N0Bt5RN//NjJwRd2VFHEmrywxf5vsZlh4R6lixl6B+wz/8d+maTSAkN1FIkI3LQ==

typed-array-buffer@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.2.tgz"
  integrity sha512-gEymJYKZtKXzzBzM4jqa9w6Q1Jjm7x2d+sh19AdsD4wqnMPDYyvwpsIc2Q/835kHuo3BEQ7CjelGhfTsoBb2MQ==
  dependencies:
    call-bind "^1.0.7"
    es-errors "^1.3.0"
    is-typed-array "^1.1.13"

typed-array-buffer@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz"
  integrity sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==
  dependencies:
    call-bound "^1.0.3"
    es-errors "^1.3.0"
    is-typed-array "^1.1.14"

typed-array-byte-length@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.1.tgz"
  integrity sha512-3iMJ9q0ao7WE9tWcaYKIptkNBuOIcZCCT0d4MRvuuH88fEoEH62IuQe0OtraD3ebQEoTRk8XCBoknUNc1Y67pw==
  dependencies:
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-proto "^1.0.3"
    is-typed-array "^1.1.13"

typed-array-byte-length@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz"
  integrity sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==
  dependencies:
    call-bind "^1.0.8"
    for-each "^0.3.3"
    gopd "^1.2.0"
    has-proto "^1.2.0"
    is-typed-array "^1.1.14"

typed-array-byte-offset@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.2.tgz"
  integrity sha512-Ous0vodHa56FviZucS2E63zkgtgrACj7omjwd/8lTEMEPFFyjfixMZ1ZXenpgCFBBt4EC1J2XsyVS2gkG0eTFA==
  dependencies:
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-proto "^1.0.3"
    is-typed-array "^1.1.13"

typed-array-byte-offset@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.4.tgz"
  integrity sha512-bTlAFB/FBYMcuX81gbL4OcpH5PmlFHqlCCpAl8AlEzMz5k53oNDvN8p1PNOWLEmI2x4orp3raOFB51tv9X+MFQ==
  dependencies:
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.8"
    for-each "^0.3.3"
    gopd "^1.2.0"
    has-proto "^1.2.0"
    is-typed-array "^1.1.15"
    reflect.getprototypeof "^1.0.9"

typed-array-length@^1.0.6:
  version "1.0.6"
  resolved "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.6.tgz"
  integrity sha512-/OxDN6OtAk5KBpGb28T+HZc2M+ADtvRxXrKKbUwtsLgdoxgX13hyy7ek6bFRl5+aBs2yZzB0c4CnQfAtVypW/g==
  dependencies:
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-proto "^1.0.3"
    is-typed-array "^1.1.13"
    possible-typed-array-names "^1.0.0"

typed-array-length@^1.0.7:
  version "1.0.7"
  resolved "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.7.tgz"
  integrity sha512-3KS2b+kL7fsuk/eJZ7EQdnEmQoaho/r6KUef7hxvltNA5DR8NAUM+8wJMbJyZ4G9/7i3v5zPBIMN5aybAh2/Jg==
  dependencies:
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    is-typed-array "^1.1.13"
    possible-typed-array-names "^1.0.0"
    reflect.getprototypeof "^1.0.6"

typescript@>=4.2.0, typescript@>=4.8.4, "typescript@>=4.8.4 <5.8.0", typescript@^5:
  version "5.5.4"
  resolved "https://registry.npmjs.org/typescript/-/typescript-5.5.4.tgz"
  integrity sha512-Mtq29sKDAEYP7aljRgtPOpTvOfbwRWlS6dPRzwjdE+C0R4brX/GUyhHSecbHMFLNBLcJIPt9nl9yG5TZ1weH+Q==

unbox-primitive@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.0.2.tgz"
  integrity sha512-61pPlCD9h51VoreyJ0BReideM3MDKMKnh6+V9L08331ipq6Q8OFXZYiqP6n/tbHx4s5I9uRhcye6BrbkizkBDw==
  dependencies:
    call-bind "^1.0.2"
    has-bigints "^1.0.2"
    has-symbols "^1.0.3"
    which-boxed-primitive "^1.0.2"

unbox-primitive@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz"
  integrity sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==
  dependencies:
    call-bound "^1.0.3"
    has-bigints "^1.0.2"
    has-symbols "^1.1.0"
    which-boxed-primitive "^1.1.1"

undici-types@~6.19.2:
  version "6.19.8"
  resolved "https://registry.npmjs.org/undici-types/-/undici-types-6.19.8.tgz"
  integrity sha512-ve2KP6f/JnbPBFyobGHuerC9g1FYGn/F8n1LWTwNxCEzd6IfqTwUQcNXgEtmmQ6DlRrC1hrSrBnCZPokRrDHjw==

uri-js@^4.2.2:
  version "4.4.1"
  resolved "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz"
  integrity sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==
  dependencies:
    punycode "^2.1.0"

util-deprecate@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz"
  integrity sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==

which@^2.0.1:
  version "2.0.2"
  resolved "https://registry.npmjs.org/which/-/which-2.0.2.tgz"
  integrity sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==
  dependencies:
    isexe "^2.0.0"

which-boxed-primitive@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.0.2.tgz"
  integrity sha512-bwZdv0AKLpplFY2KZRX6TvyuN7ojjr7lwkg6ml0roIy9YeuSr7JS372qlNW18UQYzgYK9ziGcerWqZOmEn9VNg==
  dependencies:
    is-bigint "^1.0.1"
    is-boolean-object "^1.1.0"
    is-number-object "^1.0.4"
    is-string "^1.0.5"
    is-symbol "^1.0.3"

which-boxed-primitive@^1.1.0, which-boxed-primitive@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz"
  integrity sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==
  dependencies:
    is-bigint "^1.1.0"
    is-boolean-object "^1.2.1"
    is-number-object "^1.1.1"
    is-string "^1.1.1"
    is-symbol "^1.1.1"

which-builtin-type@^1.1.3:
  version "1.1.4"
  resolved "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.1.4.tgz"
  integrity sha512-bppkmBSsHFmIMSl8BO9TbsyzsvGjVoppt8xUiGzwiu/bhDCGxnpOKCxgqj6GuyHE0mINMDecBFPlOm2hzY084w==
  dependencies:
    function.prototype.name "^1.1.6"
    has-tostringtag "^1.0.2"
    is-async-function "^2.0.0"
    is-date-object "^1.0.5"
    is-finalizationregistry "^1.0.2"
    is-generator-function "^1.0.10"
    is-regex "^1.1.4"
    is-weakref "^1.0.2"
    isarray "^2.0.5"
    which-boxed-primitive "^1.0.2"
    which-collection "^1.0.2"
    which-typed-array "^1.1.15"

which-builtin-type@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz"
  integrity sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==
  dependencies:
    call-bound "^1.0.2"
    function.prototype.name "^1.1.6"
    has-tostringtag "^1.0.2"
    is-async-function "^2.0.0"
    is-date-object "^1.1.0"
    is-finalizationregistry "^1.1.0"
    is-generator-function "^1.0.10"
    is-regex "^1.2.1"
    is-weakref "^1.0.2"
    isarray "^2.0.5"
    which-boxed-primitive "^1.1.0"
    which-collection "^1.0.2"
    which-typed-array "^1.1.16"

which-collection@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz"
  integrity sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==
  dependencies:
    is-map "^2.0.3"
    is-set "^2.0.3"
    is-weakmap "^2.0.2"
    is-weakset "^2.0.3"

which-typed-array@^1.1.14, which-typed-array@^1.1.15:
  version "1.1.15"
  resolved "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.15.tgz"
  integrity sha512-oV0jmFtUky6CXfkqehVvBP/LSWJ2sy4vWMioiENyJLePrBO/yKyV9OyJySfAKosh+RYkIl5zJCNZ8/4JncrpdA==
  dependencies:
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-tostringtag "^1.0.2"

which-typed-array@^1.1.16, which-typed-array@^1.1.18:
  version "1.1.18"
  resolved "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.18.tgz"
  integrity sha512-qEcY+KJYlWyLH9vNbsr6/5j59AXk5ni5aakf8ldzBvGde6Iz4sxZGkJyWSAueTG7QhOvNRYb1lDdFmL5Td0QKA==
  dependencies:
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.8"
    call-bound "^1.0.3"
    for-each "^0.3.3"
    gopd "^1.2.0"
    has-tostringtag "^1.0.2"

word-wrap@^1.2.5:
  version "1.2.5"
  resolved "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz"
  integrity sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==

"wrap-ansi@npm:wrap-ansi@^7.0.0":
  version "7.0.0"
  resolved "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz"
  integrity sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==
  dependencies:
    ansi-styles "^4.0.0"
    string-width "^4.1.0"
    strip-ansi "^6.0.0"

wrap-ansi@^8.1.0:
  version "8.1.0"
  resolved "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-8.1.0.tgz"
  integrity sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==
  dependencies:
    ansi-styles "^6.1.0"
    string-width "^5.0.1"
    strip-ansi "^7.0.1"

wrappy@1:
  version "1.0.2"
  resolved "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz"
  integrity sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==

yaml@^2.3.4:
  version "2.5.0"
  resolved "https://registry.npmjs.org/yaml/-/yaml-2.5.0.tgz"
  integrity sha512-2wWLbGbYDiSqqIKoPjar3MPgB94ErzCtrNE1FdqGuaO0pi2JGjmE8aW8TDZwzU7vuxcGRdL/4gPQwQ7hD5AMSw==

yocto-queue@^0.1.0:
  version "0.1.0"
  resolved "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz"
  integrity sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==
````

## File: guardian/public/1750289107242-README.md
````markdown
# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This is an [Onlook](https://onlook.com/) project set up with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in Onlook to see the result.
````

## File: guardian/public/1750289116952-README.md
````markdown
# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This is an [Onlook](https://onlook.com/) project set up with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in Onlook to see the result.
````

## File: guardian/public/1750289134037-settings.json
````json
{
    "github.copilot.editor.enableAutoCompletions": true,
    "github.copilot.inlineSuggest.enable": true
}
````

## File: guardian/public/1750289416766-settings.json
````json
{
    "github.copilot.editor.enableAutoCompletions": true,
    "github.copilot.inlineSuggest.enable": true
}
````

## File: guardian/public/1750289596386-settings.json
````json
{
    "github.copilot.editor.enableAutoCompletions": true,
    "github.copilot.inlineSuggest.enable": true
}
````

## File: guardian/public/1750289829552-settings.json
````json
{
    "github.copilot.editor.enableAutoCompletions": true,
    "github.copilot.inlineSuggest.enable": true
}
````

## File: guardian/public/1750289835273-postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: guardian/public/1750289857214-.prettierrc
````
{
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "jsxSingleQuote": false,
    "bracketSpacing": true,
    "arrowParens": "always",
    "endOfLine": "lf"
}
````

## File: guardian/public/1750289867740-README.md
````markdown
# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This is an [Onlook](https://onlook.com/) project set up with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in Onlook to see the result.
````

## File: guardian/public/1750289870405-tsconfig.json
````json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: guardian/public/1750289887975-tsconfig.json
````json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: guardian/public/1750292110628-next-env.d.ts
````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
````

## File: guardian/public/1750292308017-tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
````

## File: guardian/public/1750293088216-.eslintrc.json
````json
{
  "extends": "next/core-web-vitals"
}
````

## File: guardian/public/file.svg
````
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: guardian/public/globe.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: guardian/public/next.svg
````
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: guardian/public/vercel.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: guardian/public/window.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: guardian/scripts/dist/scripts/seed-policies.js
````javascript
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var mongoose_1 = require("../src/lib/mongoose");
var Policy_1 = require("../src/models/Policy");
var commonCategories = [
    'IT', 'HR', 'Security', 'Finance', 'Operations', 'Legal', 'Compliance', 'Risk', 'Procurement', 'Marketing', 'Other'
];
function seedPolicies() {
    return __awaiter(this, void 0, void 0, function () {
        var fakePolicies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.connect('mongodb://localhost:27017/guardian')];
                case 1:
                    _a.sent();
                    fakePolicies = Array.from({ length: 50 }).map(function (_, i) { return ({
                        name: "Demo Policy ".concat(i + 1),
                        description: "This is a simulated description for policy ".concat(i + 1, "."),
                        owner: { userId: "user".concat(i + 1), userEmail: "user".concat(i + 1, "@example.com") },
                        effectiveDate: new Date(Date.now() + Math.random() * 1e10).toISOString().slice(0, 10),
                        reviewDate: new Date(Date.now() + Math.random() * 1e10).toISOString().slice(0, 10),
                        version: "v".concat(Math.floor(Math.random() * 5) + 1, ".0"),
                        category: commonCategories[Math.floor(Math.random() * commonCategories.length)],
                        attachments: [],
                        state: ['Draft', 'Review', 'Approved', 'Rejected'][Math.floor(Math.random() * 4)],
                        comments: [],
                        changeHistory: [],
                    }); });
                    return [4 /*yield*/, Policy_1.default.insertMany(fakePolicies)];
                case 2:
                    _a.sent();
                    console.log('Inserted 50 demo policies!');
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seedPolicies().catch(function (err) { console.error(err); process.exit(1); });
````

## File: guardian/scripts/dist/src/lib/mongoose.js
````javascript
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
var mongoose_1 = require("mongoose");
var MONGODB_URI = 'mongodb://localhost:27017/guardian';
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
var cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (cached.conn)
                        return [2 /*return*/, cached.conn];
                    if (!cached.promise) {
                        cached.promise = mongoose_1.default.connect(MONGODB_URI, {
                            bufferCommands: false,
                        }).then(function (mongoose) {
                            return mongoose;
                        });
                    }
                    _a = cached;
                    return [4 /*yield*/, cached.promise];
                case 1:
                    _a.conn = _b.sent();
                    return [2 /*return*/, cached.conn];
            }
        });
    });
}
exports.default = mongoose_1.default;
````

## File: guardian/scripts/dist/src/models/Policy.js
````javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("../lib/mongoose");
var CommentSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: String },
    userEmail: { type: String },
});
var PolicySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: {
        userId: { type: String },
        userEmail: { type: String },
    },
    effectiveDate: { type: Date },
    reviewDate: { type: Date },
    version: { type: String, default: '1.0' },
    category: { type: String },
    attachments: [{ url: String, name: String }], // Array of { url, name }
    state: { type: String, enum: ['Draft', 'Review', 'Approved', 'Rejected'], default: 'Draft' },
    comments: [CommentSchema],
    changeHistory: [{
            userId: { type: String },
            userEmail: { type: String },
            action: { type: String },
            date: { type: Date, default: Date.now },
            details: { type: String },
        }],
}, { timestamps: true });
exports.default = mongoose_1.default.models.Policy || mongoose_1.default.model('Policy', PolicySchema);
````

## File: guardian/scripts/seed-compliance.ts
````typescript
import mongoose from '../src/lib/mongoose';
import Compliance from '../src/models/Compliance';

const sampleCompliance = [
  {
    name: 'General Data Protection Regulation (GDPR)',
    description: 'EU regulation on data protection and privacy for all individuals within the European Union and the European Economic Area.',
    type: 'Regulation',
    category: 'Data Protection',
    jurisdiction: 'EU',
    authority: 'European Union',
    version: '2016/679',
    effectiveDate: new Date('2018-05-25'),
    reviewFrequency: 'Annually',
    status: 'Active',
    complianceLevel: 'Partially Compliant',
    riskLevel: 'High',
    riskScore: 18,
    complianceCost: {
      annual: 150000,
      oneTime: 500000,
      currency: 'USD'
    },
    requirements: [
      {
        title: 'Data Processing Lawfulness',
        description: 'Personal data must be processed lawfully, fairly, and transparently',
        reference: 'Article 5(1)(a)',
        category: 'Data Processing',
        priority: 'Critical',
        status: 'Compliant',
        evidence: [
          {
            description: 'Data processing policy document',
            url: '/documents/gdpr-processing-policy.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'legal@company.com' },
            status: 'Approved'
          }
        ]
      },
      {
        title: 'Data Subject Rights',
        description: 'Individuals have the right to access, rectify, and erase their personal data',
        reference: 'Articles 12-22',
        category: 'Individual Rights',
        priority: 'High',
        status: 'Partially Compliant',
        evidence: [
          {
            description: 'Data subject rights procedure',
            url: '/documents/data-rights-procedure.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'legal@company.com' },
            status: 'Pending'
          }
        ]
      },
      {
        title: 'Data Breach Notification',
        description: 'Data breaches must be reported within 72 hours',
        reference: 'Article 33',
        category: 'Incident Response',
        priority: 'Critical',
        status: 'Compliant',
        evidence: [
          {
            description: 'Data breach response plan',
            url: '/documents/breach-response-plan.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' },
            status: 'Approved'
          }
        ]
      }
    ],
    gaps: [
      {
        title: 'Data Protection Impact Assessment',
        description: 'Missing DPIA for high-risk processing activities',
        severity: 'High',
        impact: 'Potential regulatory fines and reputational damage',
        remediationPlan: 'Conduct DPIA for all high-risk processing activities',
        assignedTo: { userId: 'sample-user-id', userEmail: 'dpo@company.com' },
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        progress: 40,
        cost: 25000
      }
    ],
    auditFindings: [
      {
        title: 'Insufficient Data Retention Policies',
        description: 'Data retention periods not clearly defined for all data types',
        severity: 'Medium',
        category: 'Data Management',
        remediationPlan: 'Define and implement data retention policies',
        assignedTo: { userId: 'sample-user-id', userEmail: 'legal@company.com' },
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'Open',
        progress: 0
      }
    ],
    lastAssessmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    nextAssessmentDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    lastAuditDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    nextAuditDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
    documents: [
      {
        title: 'GDPR Compliance Policy',
        url: '/documents/gdpr-policy.pdf',
        type: 'Policy',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'legal@company.com' }
      },
      {
        title: 'Data Processing Register',
        url: '/documents/processing-register.xlsx',
        type: 'Report',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'dpo@company.com' }
      }
    ],
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'dpo@company.com', role: 'Data Protection Officer' },
      { userId: 'sample-user-id', userEmail: 'legal@company.com', role: 'Legal Counsel' },
      { userId: 'sample-user-id', userEmail: 'it@company.com', role: 'IT Security' }
    ],
    tags: ['gdpr', 'data-protection', 'eu', 'privacy'],
    confidentiality: 'Internal'
  },
  {
    name: 'ISO 27001 Information Security Management',
    description: 'International standard for information security management systems (ISMS).',
    type: 'Standard',
    category: 'Information Security',
    jurisdiction: 'Global',
    authority: 'International Organization for Standardization',
    version: '2013',
    effectiveDate: new Date('2013-10-01'),
    reviewFrequency: 'Annually',
    status: 'Active',
    complianceLevel: 'Compliant',
    riskLevel: 'Medium',
    riskScore: 12,
    complianceCost: {
      annual: 75000,
      oneTime: 200000,
      currency: 'USD'
    },
    requirements: [
      {
        title: 'Information Security Policy',
        description: 'Establish and maintain information security policy',
        reference: 'A.5.1.1',
        category: 'Policy',
        priority: 'High',
        status: 'Compliant',
        evidence: [
          {
            description: 'Information Security Policy document',
            url: '/documents/iso27001-policy.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' },
            status: 'Approved'
          }
        ]
      },
      {
        title: 'Access Control',
        description: 'Implement access control policies and procedures',
        reference: 'A.9.1',
        category: 'Access Management',
        priority: 'High',
        status: 'Compliant',
        evidence: [
          {
            description: 'Access control procedures',
            url: '/documents/access-control-procedures.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'it@company.com' },
            status: 'Approved'
          }
        ]
      }
    ],
    gaps: [],
    auditFindings: [],
    lastAssessmentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    nextAssessmentDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
    lastAuditDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    nextAuditDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    documents: [
      {
        title: 'ISMS Manual',
        url: '/documents/isms-manual.pdf',
        type: 'Policy',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' }
      }
    ],
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'security@company.com', role: 'Information Security Manager' },
      { userId: 'sample-user-id', userEmail: 'it@company.com', role: 'IT Manager' }
    ],
    tags: ['iso27001', 'information-security', 'isms'],
    confidentiality: 'Internal'
  },
  {
    name: 'Sarbanes-Oxley Act (SOX)',
    description: 'US federal law that sets standards for all US public company boards, management, and public accounting firms.',
    type: 'Regulation',
    category: 'Financial',
    jurisdiction: 'US',
    authority: 'US Securities and Exchange Commission',
    version: '2002',
    effectiveDate: new Date('2002-07-30'),
    reviewFrequency: 'Quarterly',
    status: 'Active',
    complianceLevel: 'Under Assessment',
    riskLevel: 'High',
    riskScore: 20,
    complianceCost: {
      annual: 200000,
      oneTime: 750000,
      currency: 'USD'
    },
    requirements: [
      {
        title: 'Internal Controls Assessment',
        description: 'Management must assess and report on internal controls',
        reference: 'Section 404',
        category: 'Internal Controls',
        priority: 'Critical',
        status: 'Under Review',
        evidence: [
          {
            description: 'Internal controls framework',
            url: '/documents/sox-controls-framework.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'finance@company.com' },
            status: 'Pending'
          }
        ]
      },
      {
        title: 'Financial Reporting',
        description: 'Accurate and reliable financial reporting',
        reference: 'Section 302',
        category: 'Financial Reporting',
        priority: 'Critical',
        status: 'Compliant',
        evidence: [
          {
            description: 'Financial reporting procedures',
            url: '/documents/financial-reporting-procedures.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'finance@company.com' },
            status: 'Approved'
          }
        ]
      }
    ],
    gaps: [
      {
        title: 'IT General Controls',
        description: 'Insufficient IT general controls documentation',
        severity: 'High',
        impact: 'Potential material weaknesses in financial reporting',
        remediationPlan: 'Document and test IT general controls',
        assignedTo: { userId: 'sample-user-id', userEmail: 'it@company.com' },
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        progress: 60,
        cost: 100000
      }
    ],
    auditFindings: [
      {
        title: 'Segregation of Duties',
        description: 'Inadequate segregation of duties in financial systems',
        severity: 'High',
        category: 'Access Control',
        remediationPlan: 'Implement proper segregation of duties controls',
        assignedTo: { userId: 'sample-user-id', userEmail: 'finance@company.com' },
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Open',
        progress: 25
      }
    ],
    lastAssessmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextAssessmentDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
    lastAuditDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    nextAuditDate: new Date(Date.now() + 92 * 24 * 60 * 60 * 1000),
    documents: [
      {
        title: 'SOX Compliance Program',
        url: '/documents/sox-compliance-program.pdf',
        type: 'Policy',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'finance@company.com' }
      }
    ],
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'finance@company.com', role: 'Chief Financial Officer' },
      { userId: 'sample-user-id', userEmail: 'audit@company.com', role: 'Internal Audit' },
      { userId: 'sample-user-id', userEmail: 'it@company.com', role: 'IT Controls' }
    ],
    tags: ['sox', 'financial', 'internal-controls', 'us'],
    confidentiality: 'Confidential'
  },
  {
    name: 'California Consumer Privacy Act (CCPA)',
    description: 'California state law that enhances privacy rights and consumer protection for residents of California.',
    type: 'Regulation',
    category: 'Data Protection',
    jurisdiction: 'California',
    authority: 'California Attorney General',
    version: '2018',
    effectiveDate: new Date('2020-01-01'),
    reviewFrequency: 'Annually',
    status: 'Active',
    complianceLevel: 'Non-Compliant',
    riskLevel: 'High',
    riskScore: 22,
    complianceCost: {
      annual: 100000,
      oneTime: 300000,
      currency: 'USD'
    },
    requirements: [
      {
        title: 'Consumer Rights Disclosure',
        description: 'Provide notice of consumer rights at or before data collection',
        reference: 'Section 1798.100',
        category: 'Consumer Rights',
        priority: 'Critical',
        status: 'Non-Compliant',
        evidence: []
      },
      {
        title: 'Data Subject Requests',
        description: 'Process consumer requests to know, delete, and opt-out',
        reference: 'Section 1798.120',
        category: 'Consumer Rights',
        priority: 'Critical',
        status: 'Non-Compliant',
        evidence: []
      }
    ],
    gaps: [
      {
        title: 'Privacy Notice Updates',
        description: 'Privacy policy does not include CCPA-mandated disclosures',
        severity: 'Critical',
        impact: 'Potential regulatory enforcement and fines',
        remediationPlan: 'Update privacy policy with CCPA disclosures',
        assignedTo: { userId: 'sample-user-id', userEmail: 'legal@company.com' },
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Open',
        progress: 0,
        cost: 50000
      },
      {
        title: 'Data Subject Request Process',
        description: 'No process in place to handle CCPA data subject requests',
        severity: 'Critical',
        impact: 'Inability to comply with consumer rights',
        remediationPlan: 'Implement data subject request handling process',
        assignedTo: { userId: 'sample-user-id', userEmail: 'legal@company.com' },
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'Open',
        progress: 0,
        cost: 75000
      }
    ],
    auditFindings: [
      {
        title: 'Data Inventory Missing',
        description: 'No comprehensive data inventory for CCPA compliance',
        severity: 'High',
        category: 'Data Management',
        remediationPlan: 'Create comprehensive data inventory',
        assignedTo: { userId: 'sample-user-id', userEmail: 'dpo@company.com' },
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'Open',
        progress: 0
      }
    ],
    lastAssessmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    nextAssessmentDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000),
    lastAuditDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    nextAuditDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000),
    documents: [],
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'legal@company.com', role: 'Legal Counsel' },
      { userId: 'sample-user-id', userEmail: 'dpo@company.com', role: 'Data Protection Officer' }
    ],
    tags: ['ccpa', 'data-protection', 'california', 'privacy'],
    confidentiality: 'Internal'
  },
  {
    name: 'NIST Cybersecurity Framework',
    description: 'Voluntary framework for managing and reducing cybersecurity risk.',
    type: 'Framework',
    category: 'Cybersecurity',
    jurisdiction: 'US',
    authority: 'National Institute of Standards and Technology',
    version: '1.1',
    effectiveDate: new Date('2018-04-16'),
    reviewFrequency: 'Quarterly',
    status: 'Active',
    complianceLevel: 'Partially Compliant',
    riskLevel: 'Medium',
    riskScore: 15,
    complianceCost: {
      annual: 80000,
      oneTime: 150000,
      currency: 'USD'
    },
    requirements: [
      {
        title: 'Identify Function',
        description: 'Develop organizational understanding to manage cybersecurity risk',
        reference: 'ID',
        category: 'Risk Management',
        priority: 'High',
        status: 'Compliant',
        evidence: [
          {
            description: 'Asset inventory and risk assessment',
            url: '/documents/nist-identify-assessment.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' },
            status: 'Approved'
          }
        ]
      },
      {
        title: 'Protect Function',
        description: 'Develop and implement appropriate safeguards',
        reference: 'PR',
        category: 'Security Controls',
        priority: 'High',
        status: 'Partially Compliant',
        evidence: [
          {
            description: 'Security controls implementation plan',
            url: '/documents/nist-protect-plan.pdf',
            uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' },
            status: 'Pending'
          }
        ]
      }
    ],
    gaps: [
      {
        title: 'Incident Response Plan',
        description: 'Incomplete incident response procedures',
        severity: 'Medium',
        impact: 'Delayed response to security incidents',
        remediationPlan: 'Complete incident response plan development',
        assignedTo: { userId: 'sample-user-id', userEmail: 'security@company.com' },
        dueDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        progress: 70,
        cost: 30000
      }
    ],
    auditFindings: [
      {
        title: 'Recovery Procedures',
        description: 'Business continuity and disaster recovery procedures need updating',
        severity: 'Medium',
        category: 'Business Continuity',
        remediationPlan: 'Update recovery procedures and test regularly',
        assignedTo: { userId: 'sample-user-id', userEmail: 'operations@company.com' },
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'Open',
        progress: 20
      }
    ],
    lastAssessmentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    nextAssessmentDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
    lastAuditDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    nextAuditDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
    documents: [
      {
        title: 'NIST CSF Assessment Report',
        url: '/documents/nist-assessment-report.pdf',
        type: 'Report',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' }
      }
    ],
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'security@company.com', role: 'Cybersecurity Manager' },
      { userId: 'sample-user-id', userEmail: 'it@company.com', role: 'IT Security' }
    ],
    tags: ['nist', 'cybersecurity', 'framework', 'us'],
    confidentiality: 'Internal'
  }
];

async function seedCompliance() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guardian');
    console.log('Connected to MongoDB');

    // Clear existing compliance
    await Compliance.deleteMany({});
    console.log('Cleared existing compliance frameworks');

    // Create sample compliance with owner information
    const complianceWithOwners = sampleCompliance.map(comp => ({
      ...comp,
      owner: {
        userId: 'sample-user-id',
        userEmail: 'admin@company.com'
      }
    }));

    // Insert sample compliance
    const createdCompliance = await Compliance.insertMany(complianceWithOwners);
    console.log(`Created ${createdCompliance.length} sample compliance frameworks`);

    // Log created compliance
    createdCompliance.forEach(comp => {
      console.log(`- ${comp.name} (${comp.type}, ${comp.complianceLevel})`);
    });

    console.log('Compliance seeding completed successfully');
  } catch (error) {
    console.error('Error seeding compliance:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedCompliance();
````

## File: guardian/scripts/seed-incidents.ts
````typescript
import mongoose from '../src/lib/mongoose';
import Incident from '../src/models/Incident';

const sampleIncidents = [
  {
    title: 'Suspicious Login Attempts Detected',
    description: 'Multiple failed login attempts detected from unknown IP addresses targeting admin accounts. Security monitoring system triggered alerts for potential brute force attack.',
    summary: 'Potential brute force attack on admin accounts',
    category: 'Security Incident',
    subcategory: 'Unauthorized Access',
    severity: 'High',
    priority: 'High',
    status: 'Investigating',
    stage: 'Analysis',
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    slaTarget: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from detection
    impact: {
      business: 'Potential unauthorized access to sensitive systems',
      financial: 'Estimated $50,000 in investigation and remediation costs',
      operational: 'Increased security monitoring required',
      reputational: 'Low - incident contained internally',
      regulatory: 'May require reporting if data accessed'
    },
    affectedSystems: ['Admin Portal', 'User Management System'],
    affectedUsers: 0,
    affectedData: 'Admin account credentials',
    estimatedCost: 50000,
    actions: [
      {
        action: 'Block suspicious IP addresses',
        description: 'Add detected IP addresses to firewall blacklist',
        assignedTo: { userId: 'sample-user-id', userEmail: 'security@company.com' },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        priority: 'Critical'
      },
      {
        action: 'Review admin account security',
        description: 'Audit all admin accounts for suspicious activity',
        assignedTo: { userId: 'sample-user-id', userEmail: 'it@company.com' },
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        priority: 'High'
      },
      {
        action: 'Implement additional monitoring',
        description: 'Deploy enhanced login monitoring and alerting',
        assignedTo: { userId: 'sample-user-id', userEmail: 'security@company.com' },
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        priority: 'Medium'
      }
    ],
    updates: [
      {
        update: 'Incident reported and initial investigation started',
        userId: 'sample-user-id',
        userEmail: 'security@company.com',
        type: 'Status Change'
      },
      {
        update: 'Suspicious IP addresses identified and blocked',
        userId: 'sample-user-id',
        userEmail: 'security@company.com',
        type: 'Investigation'
      }
    ],
    evidence: [
      {
        title: 'Security Log Analysis',
        description: 'Analysis of failed login attempts and IP addresses',
        type: 'Log File',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' }
      }
    ],
    rootCause: 'Weak password policies and lack of rate limiting on admin accounts',
    contributingFactors: ['No rate limiting on login attempts', 'Admin accounts not using MFA'],
    lessonsLearned: 'Implement rate limiting and mandatory MFA for all admin accounts',
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'security@company.com', role: 'Investigator' },
      { userId: 'sample-user-id', userEmail: 'it@company.com', role: 'System Administrator' }
    ],
    tags: ['security', 'brute-force', 'admin-access'],
    confidentiality: 'Internal'
  },
  {
    title: 'Database Performance Degradation',
    description: 'Customer database experiencing significant performance issues, causing slow response times and occasional timeouts for user queries.',
    summary: 'Database performance issues affecting customer experience',
    category: 'System Outage',
    subcategory: 'Application Failure',
    severity: 'Medium',
    priority: 'High',
    status: 'Contained',
    stage: 'Recovery',
    detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    containedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    slaTarget: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    impact: {
      business: 'Customer experience degraded, potential revenue impact',
      financial: 'Estimated $25,000 in lost productivity and customer support',
      operational: 'Increased customer support calls and complaints',
      reputational: 'Customer frustration with slow service',
      regulatory: 'None'
    },
    affectedSystems: ['Customer Database', 'Web Application'],
    affectedUsers: 1500,
    affectedData: 'Customer query performance',
    estimatedCost: 25000,
    actualCost: 15000,
    actions: [
      {
        action: 'Database optimization',
        description: 'Optimize database queries and indexes',
        assignedTo: { userId: 'sample-user-id', userEmail: 'dba@company.com' },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        priority: 'High'
      },
      {
        action: 'Monitor performance metrics',
        description: 'Implement enhanced database monitoring',
        assignedTo: { userId: 'sample-user-id', userEmail: 'dba@company.com' },
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        priority: 'Medium'
      }
    ],
    updates: [
      {
        update: 'Performance issues detected and investigation started',
        userId: 'sample-user-id',
        userEmail: 'dba@company.com',
        type: 'Status Change'
      },
      {
        update: 'Root cause identified as inefficient queries',
        userId: 'sample-user-id',
        userEmail: 'dba@company.com',
        type: 'Investigation'
      },
      {
        update: 'Temporary fixes applied, performance improved',
        userId: 'sample-user-id',
        userEmail: 'dba@company.com',
        type: 'Resolution'
      }
    ],
    evidence: [
      {
        title: 'Database Performance Report',
        description: 'Analysis of slow queries and performance metrics',
        type: 'Document',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'dba@company.com' }
      }
    ],
    rootCause: 'Inefficient database queries and missing indexes on frequently accessed tables',
    contributingFactors: ['Recent code deployment with unoptimized queries', 'Increased user load'],
    lessonsLearned: 'Implement query performance testing in CI/CD pipeline',
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'dba@company.com', role: 'Database Administrator' },
      { userId: 'sample-user-id', userEmail: 'dev@company.com', role: 'Developer' }
    ],
    tags: ['database', 'performance', 'customer-impact'],
    confidentiality: 'Internal'
  },
  {
    title: 'Phishing Email Campaign Detected',
    description: 'Employees reported receiving suspicious emails appearing to be from IT support requesting password resets. Security team confirmed this is a targeted phishing campaign.',
    summary: 'Targeted phishing campaign against employees',
    category: 'Phishing',
    subcategory: 'Social Engineering',
    severity: 'Medium',
    priority: 'Medium',
    status: 'Resolved',
    stage: 'Lessons Learned',
    detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    containedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    slaTarget: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    impact: {
      business: 'Employee productivity affected by security concerns',
      financial: 'Minimal - no financial loss',
      operational: 'Increased security awareness training required',
      reputational: 'None - handled internally',
      regulatory: 'None'
    },
    affectedSystems: ['Email System'],
    affectedUsers: 50,
    affectedData: 'None - no data compromised',
    estimatedCost: 5000,
    actualCost: 3000,
    actions: [
      {
        action: 'Block phishing domains',
        description: 'Add phishing domains to email security filters',
        assignedTo: { userId: 'sample-user-id', userEmail: 'security@company.com' },
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        priority: 'High'
      },
      {
        action: 'Security awareness training',
        description: 'Conduct additional phishing awareness training',
        assignedTo: { userId: 'sample-user-id', userEmail: 'hr@company.com' },
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        priority: 'Medium'
      }
    ],
    updates: [
      {
        update: 'Phishing campaign reported by multiple employees',
        userId: 'sample-user-id',
        userEmail: 'security@company.com',
        type: 'Status Change'
      },
      {
        update: 'Phishing domains identified and blocked',
        userId: 'sample-user-id',
        userEmail: 'security@company.com',
        type: 'Investigation'
      },
      {
        update: 'Incident resolved, no data compromised',
        userId: 'sample-user-id',
        userEmail: 'security@company.com',
        type: 'Resolution'
      }
    ],
    evidence: [
      {
        title: 'Phishing Email Samples',
        description: 'Examples of phishing emails received by employees',
        type: 'Document',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' }
      }
    ],
    rootCause: 'Sophisticated phishing campaign targeting company employees',
    contributingFactors: ['Employees not recognizing phishing indicators', 'Email security filters not catching all variants'],
    lessonsLearned: 'Enhance email security filters and improve employee training',
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'security@company.com', role: 'Security Team' },
      { userId: 'sample-user-id', userEmail: 'hr@company.com', role: 'Training Coordinator' }
    ],
    tags: ['phishing', 'social-engineering', 'training'],
    confidentiality: 'Internal'
  },
  {
    title: 'Data Backup Failure',
    description: 'Automated backup system failed to complete scheduled database backup. Manual backup initiated but system needs investigation to prevent future failures.',
    summary: 'Automated backup system failure',
    category: 'Infrastructure Issue',
    subcategory: 'Backup Failure',
    severity: 'High',
    priority: 'High',
    status: 'Open',
    stage: 'Detection',
    detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    slaTarget: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from detection
    impact: {
      business: 'Risk of data loss if primary systems fail',
      financial: 'Potential significant cost if data recovery needed',
      operational: 'Manual backup processes required',
      reputational: 'None - internal issue',
      regulatory: 'May violate data retention requirements'
    },
    affectedSystems: ['Backup System', 'Database Servers'],
    affectedUsers: 0,
    affectedData: 'All company data at risk',
    estimatedCost: 100000,
    actions: [
      {
        action: 'Investigate backup system failure',
        description: 'Identify root cause of backup system failure',
        assignedTo: { userId: 'sample-user-id', userEmail: 'it@company.com' },
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        status: 'In Progress',
        priority: 'Critical'
      },
      {
        action: 'Implement manual backup verification',
        description: 'Set up manual backup verification process',
        assignedTo: { userId: 'sample-user-id', userEmail: 'it@company.com' },
        dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
        status: 'Pending',
        priority: 'High'
      }
    ],
    updates: [
      {
        update: 'Backup failure detected during routine monitoring',
        userId: 'sample-user-id',
        userEmail: 'it@company.com',
        type: 'Status Change'
      },
      {
        update: 'Manual backup initiated as temporary measure',
        userId: 'sample-user-id',
        userEmail: 'it@company.com',
        type: 'Investigation'
      }
    ],
    evidence: [
      {
        title: 'Backup System Logs',
        description: 'Error logs from backup system showing failure details',
        type: 'Log File',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'it@company.com' }
      }
    ],
    rootCause: 'Under investigation',
    contributingFactors: ['Backup system maintenance overdue', 'Storage space issues'],
    lessonsLearned: 'TBD - investigation ongoing',
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'it@company.com', role: 'System Administrator' },
      { userId: 'sample-user-id', userEmail: 'dba@company.com', role: 'Database Administrator' }
    ],
    tags: ['backup', 'data-protection', 'infrastructure'],
    confidentiality: 'Internal'
  },
  {
    title: 'Compliance Violation - Unauthorized Data Access',
    description: 'Employee accessed customer data outside of authorized scope. Investigation revealed violation of data access policies and potential GDPR compliance issues.',
    summary: 'Unauthorized access to customer data by employee',
    category: 'Compliance Violation',
    subcategory: 'Data Access',
    severity: 'Critical',
    priority: 'Critical',
    status: 'Investigating',
    stage: 'Analysis',
    detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    slaTarget: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    impact: {
      business: 'Potential regulatory fines and legal action',
      financial: 'Estimated $500,000 in potential fines and legal costs',
      operational: 'Enhanced access controls required',
      reputational: 'Significant damage if made public',
      regulatory: 'GDPR violation - potential reporting required'
    },
    affectedSystems: ['Customer Database', 'Access Control System'],
    affectedUsers: 150,
    affectedData: 'Customer personal information',
    estimatedCost: 500000,
    regulatoryReporting: {
      required: true,
      reported: false,
      authority: 'Data Protection Authority',
      deadline: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours from detection
    },
    legalInvolvement: {
      required: true,
      lawFirm: 'Legal Counsel',
      estimatedCost: 100000
    },
    actions: [
      {
        action: 'Suspend employee access',
        description: 'Immediately suspend all system access for involved employee',
        assignedTo: { userId: 'sample-user-id', userEmail: 'hr@company.com' },
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        priority: 'Critical'
      },
      {
        action: 'Conduct forensic investigation',
        description: 'Detailed investigation of data access patterns and scope',
        assignedTo: { userId: 'sample-user-id', userEmail: 'security@company.com' },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        priority: 'Critical'
      },
      {
        action: 'Prepare regulatory notification',
        description: 'Prepare notification for data protection authority',
        assignedTo: { userId: 'sample-user-id', userEmail: 'legal@company.com' },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        priority: 'Critical'
      }
    ],
    updates: [
      {
        update: 'Unauthorized access detected through access monitoring',
        userId: 'sample-user-id',
        userEmail: 'security@company.com',
        type: 'Status Change'
      },
      {
        update: 'Employee suspended pending investigation',
        userId: 'sample-user-id',
        userEmail: 'hr@company.com',
        type: 'Investigation'
      }
    ],
    evidence: [
      {
        title: 'Access Log Analysis',
        description: 'Detailed analysis of employee access patterns',
        type: 'Log File',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'security@company.com' }
      },
      {
        title: 'Policy Violation Report',
        description: 'Documentation of policy violations and scope',
        type: 'Document',
        uploadedBy: { userId: 'sample-user-id', userEmail: 'legal@company.com' }
      }
    ],
    rootCause: 'Under investigation',
    contributingFactors: ['Insufficient access controls', 'Lack of monitoring', 'Policy violations'],
    lessonsLearned: 'TBD - investigation ongoing',
    stakeholders: [
      { userId: 'sample-user-id', userEmail: 'legal@company.com', role: 'Legal Counsel' },
      { userId: 'sample-user-id', userEmail: 'security@company.com', role: 'Security Investigator' },
      { userId: 'sample-user-id', userEmail: 'hr@company.com', role: 'HR Manager' }
    ],
    tags: ['compliance', 'data-breach', 'gdpr', 'legal'],
    confidentiality: 'Confidential'
  }
];

async function seedIncidents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guardian');
    console.log('Connected to MongoDB');

    // Clear existing incidents
    await Incident.deleteMany({});
    console.log('Cleared existing incidents');

    // Create sample incidents with owner information
    const incidentsWithOwners = sampleIncidents.map(incident => ({
      ...incident,
      reporter: {
        userId: 'sample-user-id',
        userEmail: 'admin@company.com'
      },
      owner: {
        userId: 'sample-user-id',
        userEmail: 'admin@company.com'
      }
    }));

    // Insert sample incidents
    const createdIncidents = await Incident.insertMany(incidentsWithOwners);
    console.log(`Created ${createdIncidents.length} sample incidents`);

    // Log created incidents
    createdIncidents.forEach(incident => {
      console.log(`- ${incident.incidentNumber}: ${incident.title} (${incident.category}, ${incident.severity})`);
    });

    console.log('Incident seeding completed successfully');
  } catch (error) {
    console.error('Error seeding incidents:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedIncidents();
````

## File: guardian/scripts/seed-policies.ts
````typescript
// @ts-nocheck
import mongoose from '../src/lib/mongoose';
import Policy from '../src/models/Policy';

const commonCategories = [
  'IT', 'HR', 'Security', 'Finance', 'Operations', 'Legal', 'Compliance', 'Risk', 'Procurement', 'Marketing', 'Other'
];

async function seedPolicies() {
  await mongoose.connect('mongodb://localhost:27017/guardian');
  const fakePolicies = Array.from({ length: 50 }).map((_, i) => ({
    name: `Demo Policy ${i + 1}`,
    description: `This is a simulated description for policy ${i + 1}.`,
    owner: { userId: `user${i + 1}`, userEmail: `user${i + 1}@example.com` },
    effectiveDate: new Date(Date.now() + Math.random() * 1e10).toISOString().slice(0, 10),
    reviewDate: new Date(Date.now() + Math.random() * 1e10).toISOString().slice(0, 10),
    version: `v${Math.floor(Math.random() * 5) + 1}.0`,
    category: commonCategories[Math.floor(Math.random() * commonCategories.length)],
    attachments: [],
    state: ['Draft', 'Review', 'Approved', 'Rejected'][Math.floor(Math.random() * 4)],
    comments: [],
    changeHistory: [],
  }));
  await Policy.insertMany(fakePolicies);
  console.log('Inserted 50 demo policies!');
  await mongoose.disconnect();
}

seedPolicies().catch(err => { console.error(err); process.exit(1); });
````

## File: guardian/scripts/seed-risks.ts
````typescript
import mongoose from '../src/lib/mongoose';
import Risk from '../src/models/Risk';

const sampleRisks = [
  {
    title: 'Cybersecurity Data Breach',
    description: 'Risk of unauthorized access to sensitive customer data through cyber attacks, potentially leading to data breaches and regulatory penalties.',
    category: 'Cybersecurity',
    subcategory: 'Data Protection',
    status: 'Assessed',
    priority: 'Critical',
    businessUnit: 'IT Security',
    project: 'Data Protection Initiative',
    location: 'Global',
    tags: ['cybersecurity', 'data-breach', 'compliance'],
    confidentiality: 'Confidential',
    riskAppetite: 'Mitigate',
    targetResolutionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    financialImpact: {
      min: 100000,
      max: 5000000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'High',
      impact: 'Very High',
      rationale: 'Recent increase in cyber attacks targeting similar organizations',
      evidence: 'Security audit findings, industry threat intelligence reports'
    },
    mitigationActions: [
      {
        description: 'Implement multi-factor authentication across all systems',
        assignedTo: 'security@company.com',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cost: 50000,
        status: 'In Progress',
        progress: 60
      },
      {
        description: 'Conduct security awareness training for all employees',
        assignedTo: 'hr@company.com',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        cost: 25000,
        status: 'Not Started',
        progress: 0
      }
    ],
    stakeholders: [
      {
        userEmail: 'cto@company.com',
        role: 'Approver'
      },
      {
        userEmail: 'legal@company.com',
        role: 'Reviewer'
      }
    ],
    regulatoryImpact: ['GDPR', 'CCPA', 'SOX']
  },
  {
    title: 'Supply Chain Disruption',
    description: 'Risk of supply chain disruption due to geopolitical tensions, natural disasters, or supplier financial instability.',
    category: 'Supply Chain',
    subcategory: 'Vendor Management',
    status: 'Identified',
    priority: 'High',
    businessUnit: 'Operations',
    project: 'Supply Chain Resilience',
    location: 'Asia-Pacific',
    tags: ['supply-chain', 'vendor-risk', 'operations'],
    confidentiality: 'Internal',
    riskAppetite: 'Mitigate',
    targetResolutionDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 500000,
      max: 2000000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Medium',
      impact: 'High',
      rationale: 'Increasing geopolitical tensions in key supplier regions',
      evidence: 'Market analysis, supplier financial reports'
    },
    mitigationActions: [
      {
        description: 'Diversify supplier base across multiple regions',
        assignedTo: 'procurement@company.com',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        cost: 100000,
        status: 'Not Started',
        progress: 0
      }
    ],
    stakeholders: [
      {
        userEmail: 'operations@company.com',
        role: 'Owner'
      }
    ],
    regulatoryImpact: []
  },
  {
    title: 'Regulatory Compliance Failure',
    description: 'Risk of failing to comply with new industry regulations, leading to fines, penalties, and reputational damage.',
    category: 'Compliance',
    subcategory: 'Regulatory',
    status: 'Monitored',
    priority: 'High',
    businessUnit: 'Legal & Compliance',
    project: 'Regulatory Compliance Program',
    location: 'Global',
    tags: ['compliance', 'regulatory', 'legal'],
    confidentiality: 'Internal',
    riskAppetite: 'Mitigate',
    targetResolutionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 250000,
      max: 1000000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Medium',
      impact: 'High',
      rationale: 'New regulations being introduced in key markets',
      evidence: 'Regulatory updates, compliance gap analysis'
    },
    mitigationActions: [
      {
        description: 'Conduct comprehensive compliance audit',
        assignedTo: 'compliance@company.com',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        cost: 75000,
        status: 'Completed',
        progress: 100
      },
      {
        description: 'Update internal policies and procedures',
        assignedTo: 'legal@company.com',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        cost: 50000,
        status: 'In Progress',
        progress: 40
      }
    ],
    stakeholders: [
      {
        userEmail: 'legal@company.com',
        role: 'Owner'
      },
      {
        userEmail: 'compliance@company.com',
        role: 'Implementer'
      }
    ],
    regulatoryImpact: ['GDPR', 'SOX', 'Industry-specific regulations']
  },
  {
    title: 'Key Personnel Departure',
    description: 'Risk of losing critical personnel with specialized knowledge, potentially disrupting operations and projects.',
    category: 'Operational',
    subcategory: 'Human Resources',
    status: 'Identified',
    priority: 'Medium',
    businessUnit: 'Human Resources',
    project: 'Talent Retention',
    location: 'Global',
    tags: ['hr', 'talent', 'operational'],
    confidentiality: 'Internal',
    riskAppetite: 'Mitigate',
    targetResolutionDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 100000,
      max: 500000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Medium',
      impact: 'Medium',
      rationale: 'Competitive job market and increasing employee mobility',
      evidence: 'Employee satisfaction surveys, market compensation data'
    },
    mitigationActions: [
      {
        description: 'Develop succession planning for key roles',
        assignedTo: 'hr@company.com',
        dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        cost: 30000,
        status: 'Not Started',
        progress: 0
      },
      {
        description: 'Implement knowledge transfer programs',
        assignedTo: 'hr@company.com',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        cost: 20000,
        status: 'Not Started',
        progress: 0
      }
    ],
    stakeholders: [
      {
        userEmail: 'hr@company.com',
        role: 'Owner'
      }
    ],
    regulatoryImpact: []
  },
  {
    title: 'Technology Infrastructure Failure',
    description: 'Risk of critical technology infrastructure failure leading to service outages and business disruption.',
    category: 'Technology',
    subcategory: 'Infrastructure',
    status: 'Mitigated',
    priority: 'High',
    businessUnit: 'IT',
    project: 'Infrastructure Resilience',
    location: 'Data Centers',
    tags: ['technology', 'infrastructure', 'availability'],
    confidentiality: 'Internal',
    riskAppetite: 'Mitigate',
    targetResolutionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 200000,
      max: 1000000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Low',
      impact: 'High',
      rationale: 'Redundant systems and disaster recovery procedures in place',
      evidence: 'Infrastructure audit, disaster recovery testing results'
    },
    mitigationActions: [
      {
        description: 'Implement redundant backup systems',
        assignedTo: 'it@company.com',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cost: 150000,
        status: 'Completed',
        progress: 100
      },
      {
        description: 'Establish disaster recovery procedures',
        assignedTo: 'it@company.com',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        cost: 50000,
        status: 'Completed',
        progress: 100
      }
    ],
    stakeholders: [
      {
        userEmail: 'it@company.com',
        role: 'Owner'
      }
    ],
    regulatoryImpact: []
  },
  {
    title: 'Market Competition Intensification',
    description: 'Risk of increased competition from new market entrants or existing competitors, potentially impacting market share and profitability.',
    category: 'Strategic',
    subcategory: 'Market',
    status: 'Assessed',
    priority: 'Medium',
    businessUnit: 'Strategy',
    project: 'Competitive Intelligence',
    location: 'Global',
    tags: ['strategic', 'competition', 'market'],
    confidentiality: 'Confidential',
    riskAppetite: 'Accept',
    targetResolutionDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 500000,
      max: 3000000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'High',
      impact: 'Medium',
      rationale: 'Market analysis shows increasing competitive activity',
      evidence: 'Market research, competitor analysis reports'
    },
    mitigationActions: [
      {
        description: 'Enhance product differentiation strategy',
        assignedTo: 'strategy@company.com',
        dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        cost: 100000,
        status: 'In Progress',
        progress: 30
      }
    ],
    stakeholders: [
      {
        userEmail: 'strategy@company.com',
        role: 'Owner'
      },
      {
        userEmail: 'marketing@company.com',
        role: 'Reviewer'
      }
    ],
    regulatoryImpact: []
  },
  {
    title: 'Environmental Compliance Violation',
    description: 'Risk of violating environmental regulations, leading to fines, legal action, and reputational damage.',
    category: 'Environmental',
    subcategory: 'Compliance',
    status: 'Identified',
    priority: 'Medium',
    businessUnit: 'Operations',
    project: 'Environmental Compliance',
    location: 'Manufacturing Sites',
    tags: ['environmental', 'compliance', 'regulatory'],
    confidentiality: 'Internal',
    riskAppetite: 'Mitigate',
    targetResolutionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 100000,
      max: 750000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Low',
      impact: 'Medium',
      rationale: 'Strong environmental management systems in place',
      evidence: 'Environmental audit reports, compliance monitoring data'
    },
    mitigationActions: [
      {
        description: 'Conduct environmental compliance audit',
        assignedTo: 'environmental@company.com',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        cost: 40000,
        status: 'Not Started',
        progress: 0
      }
    ],
    stakeholders: [
      {
        userEmail: 'environmental@company.com',
        role: 'Owner'
      }
    ],
    regulatoryImpact: ['Environmental Protection Agency regulations', 'Local environmental laws']
  },
  {
    title: 'Financial Market Volatility',
    description: 'Risk of adverse financial market conditions affecting investment returns, currency exchange rates, and funding availability.',
    category: 'Financial',
    subcategory: 'Market',
    status: 'Monitored',
    priority: 'Medium',
    businessUnit: 'Finance',
    project: 'Financial Risk Management',
    location: 'Global',
    tags: ['financial', 'market', 'volatility'],
    confidentiality: 'Internal',
    riskAppetite: 'Accept',
    targetResolutionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    financialImpact: {
      min: 250000,
      max: 1500000,
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Medium',
      impact: 'Medium',
      rationale: 'Ongoing economic uncertainty and market volatility',
      evidence: 'Market analysis, economic indicators'
    },
    mitigationActions: [
      {
        description: 'Implement hedging strategies for currency exposure',
        assignedTo: 'treasury@company.com',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        cost: 75000,
        status: 'In Progress',
        progress: 70
      }
    ],
    stakeholders: [
      {
        userEmail: 'treasury@company.com',
        role: 'Owner'
      },
      {
        userEmail: 'finance@company.com',
        role: 'Reviewer'
      }
    ],
    regulatoryImpact: []
  }
];

async function seedRisks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guardian');
    console.log('Connected to MongoDB');

    // Clear existing risks
    await Risk.deleteMany({});
    console.log('Cleared existing risks');

    // Create sample risks with owner information
    const risksWithOwners = sampleRisks.map(risk => ({
      ...risk,
      owner: {
        userId: 'sample-user-id',
        userEmail: 'admin@company.com'
      }
    }));

    // Insert sample risks
    const createdRisks = await Risk.insertMany(risksWithOwners);
    console.log(`Created ${createdRisks.length} sample risks`);

    // Log created risks
    createdRisks.forEach(risk => {
      console.log(`- ${risk.title} (${risk.category}, ${risk.priority})`);
    });

    console.log('Risk seeding completed successfully');
  } catch (error) {
    console.error('Error seeding risks:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedRisks();
````

## File: guardian/src/app/api/audit-log/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../lib/mongoose';
import AuditLog from '../../../models/AuditLog';

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Unknown error';
}

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, action, details } = await req.json();
    await connect();
    await AuditLog.create({
      userId,
      userEmail,
      action,
      details,
      timestamp: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connect();
    const logs = await AuditLog.find().sort({ timestamp: -1 }).lean();
    return NextResponse.json({ logs });
  } catch (err: unknown) {
    return NextResponse.json({ logs: [], error: getErrorMessage(err) }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/compliance/[id]/audits/[auditId]/route.ts
````typescript
import { NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose'; // Cascade: Added Types import
import { dbConnect } from '@/lib/mongoose';
import Compliance, { IAuditSession } from '@/models/Compliance'; // Cascade: Added IAuditSession import

// PUT: Update a specific Audit Session
export async function PUT(request: Request, { params }: { params: { id: string, auditId: string } }) {
  await dbConnect();
  try {
    const complianceDoc = await Compliance.findById(params.id);
    if (!complianceDoc) {
      return NextResponse.json({ success: false, error: 'Compliance document not found' }, { status: 404 });
    }

    if (!complianceDoc.auditSessions) {
      return NextResponse.json({ success: false, error: 'Audit session not found' }, { status: 404 });
    }
    const auditSession = complianceDoc.auditSessions.find((session: IAuditSession) => session._id && session._id.toString() === params.auditId);
    if (!auditSession) {
      return NextResponse.json({ success: false, error: 'Audit session not found' }, { status: 404 });
    }

    const body = await request.json();
    auditSession.set(body);
    await complianceDoc.save();

    return NextResponse.json({ success: true, data: auditSession }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Delete a specific Audit Session
export async function DELETE(request: Request, { params }: { params: { id: string, auditId: string } }) {
  await dbConnect();
  try {
    const complianceDoc = await Compliance.findById(params.id);
    if (!complianceDoc) {
      return NextResponse.json({ success: false, error: 'Compliance document not found' }, { status: 404 });
    }

    // Mongoose sub-document removal
    if (!complianceDoc.auditSessions) {
      return NextResponse.json({ success: false, error: 'Audit session not found' }, { status: 404 });
    }
    // Find the index of the audit session to remove it by index, or use pull
    const auditSessionIndex = complianceDoc.auditSessions.findIndex((session: IAuditSession) => session._id && session._id.toString() === params.auditId);

    if (auditSessionIndex === -1) {
      return NextResponse.json({ success: false, error: 'Audit session not found' }, { status: 404 });
    }
    // Remove the subdocument using splice
    complianceDoc.auditSessions.splice(auditSessionIndex, 1);
    
    await complianceDoc.save();

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/compliance/[id]/audits/route.ts
````typescript
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Compliance from '@/models/Compliance';
import { getAuth } from '@clerk/nextjs/server';

// Mock user for development when auth is disabled
const mockUser = {
  userId: 'dev-user-123',
  user: {
    primaryEmailAddress: {
      emailAddress: 'developer@test.com'
    }
  }
};

// GET: List all Audit Sessions for a Compliance document
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const complianceDoc = await Compliance.findById(params.id, 'auditSessions');
    if (!complianceDoc) {
      return NextResponse.json({ success: false, error: 'Compliance document not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: complianceDoc.auditSessions || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// POST: Create a new Audit Session for a Compliance document
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId, user } = mockUser; // Using mock user for development
  if (!userId || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const complianceDoc = await Compliance.findById(params.id);
    if (!complianceDoc) {
      return NextResponse.json({ success: false, error: 'Compliance document not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Create the new audit session object
    const newAuditSession = {
      ...body,
      auditor: {
        userId,
        userEmail: user.primaryEmailAddress?.emailAddress,
      },
    };

    if (!complianceDoc.auditSessions) {
      complianceDoc.auditSessions = [];
    }
    complianceDoc.auditSessions.push(newAuditSession);
    await complianceDoc.save();

    // Return the newly added session, which will be the last one in the array
    const createdSession = complianceDoc.auditSessions[complianceDoc.auditSessions.length - 1];

    return NextResponse.json({ success: true, data: createdSession }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
````

## File: guardian/src/app/api/compliance/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Compliance, { ICompliancePopulatedFolder } from '@/models/Compliance';
import AuditLog from '@/models/AuditLog';
import mongoose from 'mongoose';
import { checkPermission } from '@/lib/permission-utils';
import Folder from '@/models/Folder'; // Import Folder model

// GET /api/compliance/[id] - Get specific compliance framework
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Ensure DB connection
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid compliance ID format' }, { status: 400 });
    }

    const compliance = await Compliance.findById(params.id).populate('folder', '_id name').lean() as ICompliancePopulatedFolder | null;

    if (!compliance) {
      return NextResponse.json(
        { error: 'Compliance framework not found' },
        { status: 404 }
      );
    }

    if (!compliance || !compliance.folder || !compliance.folder._id) { // Check compliance itself for null too
      // This case should ideally not happen if folder is required in schema
      // and data is consistent. Log an error if it does.
      console.error(`Compliance item ${compliance._id} is missing folder information.`);
      return NextResponse.json({ error: 'Compliance item is missing folder data, cannot verify permissions.' }, { status: 500 });
    }

    const hasPermission = await checkPermission(userId, compliance.folder._id.toString(), Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_COMPLIANCE_DETAIL',
      details: `Viewed compliance framework: ${compliance.name} (ID: ${params.id}) in folder ${compliance.folder.name || 'N/A'}` // folder.name is safe due to ICompliancePopulatedFolder
    });

    return NextResponse.json(compliance);

  } catch (error) {
    console.error('Error fetching compliance:', error);
    let message = 'Failed to fetch compliance';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PUT /api/compliance/[id] - Update specific compliance framework
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Ensure DB connection
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid compliance ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { folderId: newFolderId, ...updateData } = body;

    const complianceItem = await Compliance.findById(params.id).populate('folder', '_id name') as (mongoose.Document<unknown, {}, ICompliancePopulatedFolder> & ICompliancePopulatedFolder & { _id: mongoose.Types.ObjectId; }) | null;

    if (!complianceItem) {
      return NextResponse.json({ error: 'Compliance framework not found' }, { status: 404 });
    }

    if (!complianceItem.folder) { // complianceItem itself is checked for null earlier, folder is now typed via ICompliancePopulatedFolder
      console.error(`Compliance item ${complianceItem._id} is missing folder information during update.`);
      return NextResponse.json({ error: 'Compliance item is missing folder data, cannot verify permissions.' }, { status: 500 });
    }

    const currentFolderId = complianceItem.folder._id.toString();
    const currentFolderName = complianceItem.folder.name;

    // Check 'Editor' permission on the current folder
    const canEditInCurrentFolder = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!canEditInCurrentFolder) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    let targetFolderId = currentFolderId;
    let targetFolderName = currentFolderName;

    // Handle folder move
    if (newFolderId && newFolderId.toString() !== currentFolderId) {
      if (!mongoose.Types.ObjectId.isValid(newFolderId)) {
        return NextResponse.json({ error: 'Invalid new folderId format' }, { status: 400 });
      }
      const canMoveToNewFolder = await checkPermission(userId, newFolderId.toString(), Folder, 'Contributor');
      if (!canMoveToNewFolder) {
        return NextResponse.json({ error: 'Forbidden: You do not have contributor rights for the target folder.' }, { status: 403 });
      }
      complianceItem.folder = newFolderId;
      targetFolderId = newFolderId.toString();
      // We'd need to fetch the new folder's name if we want to log it accurately before saving and re-populating
      // For now, we'll populate after save.
    }

    // Apply other updates
    Object.assign(complianceItem, updateData);
    await complianceItem.save();

    const updatedCompliance = await Compliance.findById(complianceItem._id).populate('folder', 'name').lean() as ICompliancePopulatedFolder | null;
    
    if (!updatedCompliance) {
        // This should ideally not happen if save was successful
        console.error(`Failed to re-fetch compliance item ${complianceItem._id} after update.`);
        return NextResponse.json({ error: 'Failed to retrieve updated compliance item.' }, { status: 500 });
    }
    targetFolderName = updatedCompliance.folder.name || 'N/A'; // folder.name is safe

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_COMPLIANCE',
      details: `Updated compliance framework: ${updatedCompliance.name} (ID: ${params.id}) in folder ${targetFolderName}`
    });

    return NextResponse.json(updatedCompliance);

  } catch (error) {
    console.error('Error updating compliance:', error);
    let message = 'Failed to update compliance';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/compliance/[id] - Delete specific compliance framework
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Ensure DB connection
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid compliance ID format' }, { status: 400 });
    }

    // Get the compliance before deletion for audit log and permission check
    const complianceItem = await Compliance.findById(params.id).populate('folder', '_id name').lean() as ICompliancePopulatedFolder | null;
    if (!complianceItem) {
      return NextResponse.json(
        { error: 'Compliance framework not found' },
        { status: 404 }
      );
    }

    // @ts-ignore TODO: Refine ICompliance type for populated folder
    if (!complianceItem.folder || !complianceItem.folder._id) {
      console.error(`Compliance item ${complianceItem._id} is missing folder information during delete.`);
      return NextResponse.json({ error: 'Compliance item is missing folder data, cannot verify permissions.' }, { status: 500 });
    }
    
    const folderId = complianceItem.folder._id.toString();
    const folderName = complianceItem.folder.name;
    const complianceName = complianceItem.name;

    // Check 'Editor' permission on the folder
    const hasPermission = await checkPermission(userId, folderId, Folder, 'Editor');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for this folder.' }, { status: 403 });
    }

    // Delete the compliance
    await Compliance.findByIdAndDelete(params.id);

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_COMPLIANCE',
      details: `Deleted compliance framework: ${complianceName} (ID: ${params.id}) from folder ${folderName}`
    });

    return NextResponse.json({ message: 'Compliance framework deleted successfully' });

  } catch (error) {
    console.error('Error deleting compliance:', error);
    let message = 'Failed to delete compliance';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
````

## File: guardian/src/app/api/compliance/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { SortOrder } from 'mongoose';
import Compliance, { ICompliancePopulatedFolder } from '@/models/Compliance';
import AuditLog from '@/models/AuditLog';
import { getAccessibleFolderIds, checkPermission } from '@/lib/permission-utils';
import Folder from '@/models/Folder'; // Import Folder model
import mongoose from 'mongoose';

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Unknown error';
}

// GET /api/compliance - List compliance frameworks with filtering and pagination
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const complianceLevel = searchParams.get('complianceLevel');
    const owner = searchParams.get('owner');
    const search = searchParams.get('search');

    // Build filter object
    const accessibleFolderIds = await getAccessibleFolderIds(userId, 'Viewer'); // Cascade: Added 'Viewer' role

    // If the user has no accessible folders, they can't see any compliance documents
    // (unless they are a super-admin, a concept not yet implemented here)
    if (accessibleFolderIds.length === 0) {
      return NextResponse.json({
        compliance: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false }
      });
    }

    // Build filter object
    const filter: Record<string, unknown> = {
      folder: { $in: accessibleFolderIds } // Cascade: Filter by accessible folders
    };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (complianceLevel) filter.complianceLevel = complianceLevel;
    if (owner) filter['owner.userId'] = owner;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { authority: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: { [key: string]: SortOrder } = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query with pagination
    const compliance = await Compliance.find(filter)
      .populate('folder', 'name') // Populate folder name
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean() as ICompliancePopulatedFolder[];

    // Get total count for pagination
    const total = await Compliance.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_COMPLIANCE',
      details: `Viewed compliance page ${page} with filters: ${JSON.stringify(filter)}`
    });

    return NextResponse.json({
      compliance,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching compliance:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST /api/compliance - Create new compliance framework
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { folderId, ...complianceInputData } = body;
    
    // Validate required fields
    if (!complianceInputData.name || !complianceInputData.type || !complianceInputData.category || !folderId) {
      return NextResponse.json(
        { error: 'Name, type, category, and folderId are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Invalid folderId format' }, { status: 400 });
    }

    // Check permission to create in the target folder
    const hasPermission = await checkPermission(userId, folderId, Folder, 'Contributor');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to create content in this folder.' }, { status: 403 });
    }

    // Create compliance with owner information
    const newCompliance = new Compliance({
      ...complianceInputData,
      folder: folderId,
      owner: {
        userId,
        userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown'
      }
    });
    
    await newCompliance.save();
    const populatedCompliance = await Compliance.findById(newCompliance._id).populate('folder', 'name') as (mongoose.Document<unknown, {}, ICompliancePopulatedFolder> & ICompliancePopulatedFolder & { _id: mongoose.Types.ObjectId; }) | null;

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'CREATE_COMPLIANCE',
      details: `Created compliance framework: ${populatedCompliance?.name} (ID: ${populatedCompliance?._id}) in folder ${populatedCompliance?.folder?.name || 'N/A'}`
    });

    return NextResponse.json(populatedCompliance, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating compliance:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT /api/compliance - Update compliance framework (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { complianceId, updates } = body;

    if (!complianceId) {
      return NextResponse.json(
        { error: 'Compliance ID is required' },
        { status: 400 }
      );
    }

    // Get the compliance to track changes and check permissions
    const existingCompliance = await Compliance.findById(complianceId).populate('folder', '_id name').lean() as ICompliancePopulatedFolder | null;
    if (!existingCompliance || !existingCompliance.folder || !existingCompliance.folder._id) {
      // Log if folder info is missing, as it's crucial for permissions
      if (existingCompliance) console.error(`Compliance item ${complianceId} is missing folder information during bulk update attempt.`);

      return NextResponse.json(
        { error: 'Compliance framework not found' },
        { status: 404 }
      );
    }

    // Check 'Editor' permission on the current folder
    // existingCompliance and existingCompliance.folder are guaranteed to be non-null here
    const currentFolderId = existingCompliance.folder!._id.toString(); 
    const canEditInCurrentFolder = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!canEditInCurrentFolder) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder of this compliance item.' }, { status: 403 });
    }

    // If folderId is part of updates, check 'Contributor' permission for the new folder
    if (updates.folderId && updates.folderId.toString() !== currentFolderId) {
      if (!mongoose.Types.ObjectId.isValid(updates.folderId)) {
        return NextResponse.json({ error: 'Invalid new folderId format in updates' }, { status: 400 });
      }
      const canMoveToNewFolder = await checkPermission(userId, updates.folderId.toString(), Folder, 'Contributor');
      if (!canMoveToNewFolder) {
        return NextResponse.json({ error: 'Forbidden: You do not have contributor rights for the target folder.' }, { status: 403 });
      }
    }

    // Update the compliance
    // Note: findByIdAndUpdate won't run Mongoose setters or middleware for population by default.
    // We fetch it again if we need the populated new folder name for the audit log.
    await Compliance.findByIdAndUpdate(
      complianceId,
      { ...updates },
      { new: true, runValidators: true }
    );

    // Re-fetch to get potentially updated populated folder for audit log
    const finalUpdatedCompliance = await Compliance.findById(complianceId).populate('folder', 'name').lean() as ICompliancePopulatedFolder | null;
    if (!finalUpdatedCompliance) {
        // Should not happen if update was successful and item still exists
        console.error(`Failed to re-fetch compliance item ${complianceId} after update.`);
        // Fallback to existingCompliance for audit log name, folder might be stale if changed
        await AuditLog.create({
          userId,
          userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
          action: 'UPDATE_COMPLIANCE_ERROR',
          details: `Updated compliance framework (ID: ${complianceId}), but failed to re-fetch for audit log. Initial name: ${existingCompliance.name}. Initial folder: ${existingCompliance.folder.name}`
        });
        return NextResponse.json({ message: 'Update successful, but audit log may be incomplete.' });
    }

    // Log audit trail with change details
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_COMPLIANCE',
      details: `Updated compliance framework: ${finalUpdatedCompliance.name} (ID: ${complianceId}) in folder ${finalUpdatedCompliance.folder?.name || 'N/A'}`
    });

    return NextResponse.json(finalUpdatedCompliance);

  } catch (error: unknown) {
    console.error('Error updating compliance:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/compliance - Delete compliance framework
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const complianceId = searchParams.get('id');

    if (!complianceId) {
      return NextResponse.json(
        { error: 'Compliance ID is required' },
        { status: 400 }
      );
    }

    // Get the compliance before deletion for audit log and permission check
    const compliance = await Compliance.findById(complianceId).populate('folder', '_id name').lean() as ICompliancePopulatedFolder | null;
    if (!compliance || !compliance.folder || !compliance.folder._id) {
      // Log if folder info is missing, as it's crucial for permissions
      if (compliance) console.error(`Compliance item ${complianceId} is missing folder information during delete attempt.`);

      return NextResponse.json(
        { error: 'Compliance framework not found' },
        { status: 404 }
      );
    }

    // Check 'Editor' permission on the folder
    // compliance and compliance.folder are guaranteed to be non-null here
    const folderId = compliance.folder!._id.toString();
    const hasPermission = await checkPermission(userId, folderId, Folder, 'Editor');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the folder containing this compliance item.' }, { status: 403 });
    }

    // Delete the compliance
    await Compliance.findByIdAndDelete(complianceId);

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_COMPLIANCE',
      details: `Deleted compliance framework: ${compliance.name} (ID: ${complianceId}) from folder ${compliance.folder.name}`
    });

    return NextResponse.json({ message: 'Compliance framework deleted successfully' });

  } catch (error) {
    console.error('Error deleting compliance:', error);
    return NextResponse.json(
      { error: 'Failed to delete compliance' },
      { status: 500 }
    );
  }
}
````

## File: guardian/src/app/api/controls/[id]/route.ts
````typescript
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Control, { IControl, IControlPopulatedFolder } from '@/models/Control';
import Folder, { IFolder } from '@/models/Folder';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkPermission } from '@/lib/permission-utils'; // getAccessibleFolderIds not used here
import mongoose, { Document, Types } from 'mongoose';
import AuditLog from '@/models/AuditLog';

// GET: Fetch a single control by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid control ID format' }, { status: 400 });
  }

  try {
    const control = await Control.findById(params.id).populate('folder', '_id name').lean() as IControlPopulatedFolder | null;
    if (!control) {
      return NextResponse.json({ success: false, error: 'Control not found' }, { status: 404 });
    }

    if (!control.folder || !control.folder._id) {
        console.error(`Control ${params.id} is missing folder information after population for GET.`);
        return NextResponse.json({ success: false, error: 'Control is missing folder data, cannot verify permissions.' }, { status: 500 });
    }

    const hasPermission = await checkPermission(userId, control.folder._id.toString(), Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have viewer rights for the folder containing this control.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: control }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching control ${params.id}:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch control' }, { status: 500 });
  }
}

// PUT: Update a control
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid control ID format' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { folderId: newFolderIdFromRequest, ...otherUpdateData } = body;

    const controlInstance = await Control.findById(params.id) as (Document<unknown, {}, IControl> & IControl & { _id: Types.ObjectId; folder: Types.ObjectId }) | null;
    if (!controlInstance) {
      return NextResponse.json({ success: false, error: 'Control not found' }, { status: 404 });
    }

    const currentControlState = await Control.findById(params.id).populate('folder', '_id name').lean() as IControlPopulatedFolder | null;
    if (!currentControlState || !currentControlState.folder || !currentControlState.folder._id) {
      console.error(`Control ${params.id} is missing folder information for PUT.`);
      return NextResponse.json({ success: false, error: 'Control is missing folder data, cannot verify permissions.' }, { status: 500 });
    }
    const definiteCurrentControlState = currentControlState as IControlPopulatedFolder; // Explicitly type after null check
    const currentFolderId = definiteCurrentControlState.folder._id.toString();
    const currentFolderName = currentControlState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    let newFolderDetailsForAudit = "";

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        controlInstance.folder = new Types.ObjectId(newFolderIdStr);
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean<IFolder>();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    Object.assign(controlInstance, otherUpdateData);
    
    // TODO: Add change history logging: controlInstance.changeHistory.push({ userId, userEmail: userPerformingAction?.emailAddresses[0]?.emailAddress, changedFields: [...] });

    await controlInstance.save();

    const userPerformingAction = await currentUser();
    // Determine the name for the audit log
    const controlNameForAudit = ('name' in otherUpdateData && typeof otherUpdateData.name === 'string') ? otherUpdateData.name : definiteCurrentControlState.name;

    await AuditLog.create({
      userId,
      userEmail: userPerformingAction?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_CONTROL',
      details: `Updated control: ${controlNameForAudit} (ID: ${controlInstance._id.toString()})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: controlInstance._id,
      itemType: 'Control',
      folderId: controlInstance.folder,
    });

    const populatedControl = await Control.findById(controlInstance._id).populate('folder', 'name').lean() as IControlPopulatedFolder | null;
    return NextResponse.json({ success: true, data: populatedControl }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating control ${params.id}:`, error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update control' }, { status: 500 });
  }
}

// DELETE: Delete a control
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid control ID format' }, { status: 400 });
  }

  try {
    const controlToDelete = await Control.findById(params.id).populate('folder', '_id name').lean() as IControlPopulatedFolder | null;
    if (!controlToDelete) {
      return NextResponse.json({ success: false, error: 'Control not found' }, { status: 404 });
    }

    if (!controlToDelete.folder || !controlToDelete.folder._id) {
        console.error(`Control ${params.id} is missing folder information for DELETE.`);
        return NextResponse.json({ success: false, error: 'Control is missing folder data, cannot verify permissions.' }, { status: 500 });
    }
    const folderId = controlToDelete.folder._id.toString();
    const folderName = controlToDelete.folder.name;

    const hasDeletePermission = await checkPermission(userId, folderId, Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have editor rights for the folder containing this control.' }, { status: 403 });
    }

    await Control.findByIdAndDelete(params.id);

    const userPerformingAction = await currentUser();
    await AuditLog.create({
      userId,
      userEmail: userPerformingAction?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_CONTROL',
      details: `Deleted control: ${controlToDelete.name} (ID: ${params.id}) from folder ${folderName} (ID: ${folderId}).`,
      itemId: params.id,
      itemType: 'Control',
      folderId: new Types.ObjectId(folderId),
    });

    return NextResponse.json({ success: true, message: 'Control deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting control ${params.id}:`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete control' }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/controls/route.ts
````typescript
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Control, { IControlPopulatedFolder } from '@/models/Control';
import { auth, clerkClient, EmailAddress } from '@clerk/nextjs/server'; // Changed getAuth to auth and added clerkClient
import { getAccessibleFolderIds } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// GET: Fetch all controls
export async function GET(request: Request) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const accessibleFolderIds = await getAccessibleFolderIds(userId, 'Viewer');
    if (accessibleFolderIds.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 }); // No accessible folders, so no controls
    }

    // TODO: Add support for other query parameters if needed, combining with folder filter
    const controls = await Control.find({ folder: { $in: accessibleFolderIds } }).populate('folder', 'name').lean() as unknown as IControlPopulatedFolder[]; // Populate folder name
    return NextResponse.json({ success: true, data: controls }, { status: 200 });
  } catch (error) {
    console.error('Error fetching controls:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch controls' }, { status: 500 });
  }
}

// POST: Create a new control
export async function POST(request: Request) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { folderId, ...controlData } = body;

    if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Valid folderId is required' }, { status: 400 });
    }

    const accessibleFolderIds = await getAccessibleFolderIds(userId, 'Contributor');
    if (!accessibleFolderIds.map(id => id.toString()).includes(folderId.toString())) {
      return NextResponse.json({ error: 'Insufficient permissions for the selected folder' }, { status: 403 });
    }

    // Fetch user details from Clerk to get primary email for the owner field
    let userEmail = 'N/A';
    try {
        const clerkUser = await (await clerkClient()).users.getUser(userId);
        userEmail = clerkUser.emailAddresses.find((email: EmailAddress) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || 'N/A';
    } catch (clerkError) {
        console.warn(`Failed to fetch user email from Clerk for user ${userId}:`, clerkError);
        // Proceed with 'N/A' or handle as a more critical error if email is strictly required
    }

    const newControl = new Control({
      ...controlData,
      folder: folderId,
      owner: { userId, userEmail }, // Set owner using authenticated user
      // changeHistory will be handled by model or specific update routes if needed
    });

    await newControl.save();
    const populatedControl = await Control.findById(newControl._id).populate('folder', 'name').lean() as IControlPopulatedFolder | null;

    return NextResponse.json({ success: true, data: populatedControl }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating control:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    if (error.code === 11000) { // MongoDB duplicate key error (e.g., for controlId)
        return NextResponse.json({ success: false, error: 'A control with this Control ID already exists.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create control' }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/folders/[id]/route.ts
````typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/mongoose';
import Folder, { IFolder } from '@/models/Folder';
import RoleAssignment from '@/models/RoleAssignment';
import Compliance from '@/models/Compliance'; // For checking if folder is empty before delete
import Risk from '@/models/Risk'; // For checking if folder is empty before delete
import Control from '@/models/Control'; // For checking if folder is empty before delete
import Policy from '@/models/Policy'; // For checking if folder is empty before delete
import { getAccessibleFolderIds, checkPermission } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// GET: Fetch a specific folder
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid folder ID format' }, { status: 400 });
  }

  try {
    const hasPermission = await checkPermission(userId, params.id, Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const folder = await Folder.findById(params.id);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json(folder, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching folder ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 });
  }
}

// PUT: Update a specific folder (e.g., rename, move)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid folder ID format' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name && parentId === undefined) {
      return NextResponse.json({ error: 'No update parameters provided (name or parentId)' }, { status: 400 });
    }
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json({ error: 'Folder name cannot be empty' }, { status: 400 });
    }
    if (parentId !== undefined && parentId !== null && !mongoose.Types.ObjectId.isValid(parentId)) {
        return NextResponse.json({ error: 'Invalid new parent folder ID format' }, { status: 400 });
    }

    // Check permission to edit the target folder
    const hasEditPermission = await checkPermission(userId, params.id, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Forbidden to edit this folder' }, { status: 403 });
    }

    const folderToUpdate = await Folder.findById(params.id);
    if (!folderToUpdate) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Handle name update
    if (name !== undefined) {
      folderToUpdate.name = name.trim();
    }

    // Handle moving folder (parentId update)
    if (parentId !== undefined) {
      if (parentId === params.id) {
        return NextResponse.json({ error: 'Cannot set a folder as its own parent' }, { status: 400 });
      }

      if (parentId === null) { // Moving to root
        folderToUpdate.parent = null;
      } else {
        // Check permission for the new parent folder (must be at least Contributor)
        const accessibleNewParentFolders = await getAccessibleFolderIds(userId, 'Contributor');
        if (!accessibleNewParentFolders.map(id => id.toString()).includes(parentId.toString())) {
          return NextResponse.json({ error: 'Insufficient permissions for the new parent folder' }, { status: 403 });
        }
        const newParentFolder = await Folder.findById(parentId);
        if (!newParentFolder) {
          return NextResponse.json({ error: 'New parent folder not found' }, { status: 404 });
        }
        // Prevent circular parenting by checking if new parent is a descendant of the folder being moved
        if (newParentFolder.ancestors && newParentFolder.ancestors.map((id: mongoose.Types.ObjectId) => id.toString()).includes(params.id)) {
            return NextResponse.json({ error: 'Cannot move folder into one of its own descendants' }, { status: 400 });
        }
        folderToUpdate.parent = newParentFolder._id;
      }
    }

    await folderToUpdate.save(); // Pre-save hook will update ancestors if parent changed
    const updatedFolder = await Folder.findById(folderToUpdate._id); // Re-fetch for fresh data

    return NextResponse.json(updatedFolder, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating folder ${params.id}:`, error);
    if (error.name === 'ValidationError' || error.code === 11000) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

// DELETE: Delete a specific folder
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid folder ID format' }, { status: 400 });
  }

  try {
    // User must be 'Owner' of the folder to delete it
    const hasDeletePermission = await checkPermission(userId, params.id, Folder, 'Owner');
    if (!hasDeletePermission) {
      return NextResponse.json({ error: 'Forbidden: Only the folder owner can delete it' }, { status: 403 });
    }

    const folderToDelete = await Folder.findById(params.id);
    if (!folderToDelete) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Check if the folder is empty (no subfolders)
    const subfolderCount = await Folder.countDocuments({ parent: params.id });
    if (subfolderCount > 0) {
      return NextResponse.json({ error: 'Folder is not empty. Delete subfolders first.' }, { status: 400 });
    }

    // Check if the folder contains any GRC items
    const complianceItemCount = await Compliance.countDocuments({ folder: params.id });
    const riskItemCount = await Risk.countDocuments({ folder: params.id });
    const controlItemCount = await Control.countDocuments({ folder: params.id });
    const policyItemCount = await Policy.countDocuments({ folder: params.id });

    if (complianceItemCount > 0 || riskItemCount > 0 || controlItemCount > 0 || policyItemCount > 0) {
      return NextResponse.json({ error: 'Folder is not empty. It contains GRC items.' }, { status: 400 });
    }

    // Delete the folder
    await Folder.findByIdAndDelete(params.id);
    // Delete associated role assignments
    await RoleAssignment.deleteMany({ folderId: params.id });

    return NextResponse.json({ message: 'Folder deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting folder ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/folders/route.ts
````typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/mongoose';
import Folder, { IFolder } from '@/models/Folder';
import RoleAssignment from '@/models/RoleAssignment';
import { getAccessibleFolderIds } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// POST: Create a new folder
export async function POST(request: Request) {
  // Ensure dbConnect is awaited if it returns a Promise and is not already handled within its implementation for multiple calls.
  // Assuming dbConnect handles its own connection state internally.
  await dbConnect(); 
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    let parentFolder: IFolder | null = null;
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
          return NextResponse.json({ error: 'Invalid parent folder ID format' }, { status: 400 });
      }
      // Validate parent folder existence and user's permission to create subfolders in it
      parentFolder = await Folder.findById(parentId);
      if (!parentFolder) {
        return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
      }

      const accessibleParentFolders = await getAccessibleFolderIds(userId, 'Contributor');
      if (!accessibleParentFolders.map(id => id.toString()).includes(parentId.toString())) {
        return NextResponse.json({ error: 'Insufficient permissions to create folder in the selected parent' }, { status: 403 });
      }
    }

    const newFolder = new Folder({
      name: name.trim(),
      owner: userId,
      parent: parentId ? parentFolder?._id : null,
      // ancestors will be set by pre-save hook in Folder model
    });

    await newFolder.save();

    // Assign 'Owner' role to the creator for the new folder
    const ownerRoleAssignment = new RoleAssignment({
      userId: userId,
      role: 'Owner',
      folderId: newFolder._id,
    });
    await ownerRoleAssignment.save();

    // Re-fetch to ensure all fields, including populated ones if any, are fresh for the response
    const populatedFolder = await Folder.findById(newFolder._id);

    return NextResponse.json(populatedFolder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating folder:', error);
    if (error.name === 'ValidationError' || error.code === 11000 /* MongoDB duplicate key error */) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}

// GET: List accessible folders
export async function GET(request: Request) {
  await dbConnect();
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parentIdParam = searchParams.get('parentId');

  try {
    const accessibleFolderIdsStrings = (await getAccessibleFolderIds(userId, 'Viewer')).map(id => id.toString());
    
    // If the user has no accessible folders at all and is not querying a specific parent's children, return empty.
    // This prevents trying to create an empty $in query which might behave unexpectedly or be inefficient.
    if (accessibleFolderIdsStrings.length === 0 && !parentIdParam) {
        return NextResponse.json([], { status: 200 });
    }
    
    const accessibleFolderObjectIds = accessibleFolderIdsStrings.map(idStr => new mongoose.Types.ObjectId(idStr));

    let query: mongoose.FilterQuery<IFolder> = {};

    if (parentIdParam) {
      if (!mongoose.Types.ObjectId.isValid(parentIdParam)) {
        return NextResponse.json({ error: 'Invalid parent folder ID format' }, { status: 400 });
      }
      // User must have access to the parent folder to list its children.
      if (!accessibleFolderIdsStrings.includes(parentIdParam.toString())) {
          return NextResponse.json({ error: 'Cannot access specified parent folder to list children' }, { status: 403 });
      }
      query.parent = new mongoose.Types.ObjectId(parentIdParam);
      // Additionally, ensure listed children are themselves accessible (though direct children of an accessible parent usually are, this is a safeguard)
      query._id = { $in: accessibleFolderObjectIds }; 
    } else {
      // If no parentId is specified, list accessible root folders (folders with no parent)
      query.parent = null;
      query._id = { $in: accessibleFolderObjectIds }; // Only list root folders that are in the accessible list
    }

    // If accessibleFolderObjectIds is empty and it's part of the query (e.g. for root folders or specific parent's children),
    // the $in: [] will correctly result in no folders found, which is the desired behavior.
    const folders = await Folder.find(query).sort({ name: 1 });
    return NextResponse.json(folders, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/incidents/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Incident, { IIncident, IIncidentPopulatedFolder } from '@/models/Incident';
import Folder from '@/models/Folder';
import AuditLog from '@/models/AuditLog';
import { checkPermission } from '@/lib/permission-utils';
import mongoose, { Types } from 'mongoose';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'An unknown error occurred';
}

// GET /api/incidents/[id] - Get specific incident
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser();

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid incident ID format' }, { status: 400 });
    }

    const incident = await Incident.findById(params.id).populate('folder', '_id name').lean() as IIncidentPopulatedFolder | null;

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    if (!incident.folder || !incident.folder._id) {
      console.error(`Incident ${params.id} is missing folder information.`);
      return NextResponse.json({ error: 'Incident is not associated with a folder, cannot verify permissions.' }, { status: 500 });
    }

    const hasPermission = await checkPermission(userId, incident.folder._id.toString(), Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view this incident.' }, { status: 403 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_INCIDENT',
      details: `Viewed incident: ${incident.title} (ID: ${params.id}) in folder ${incident.folder.name}`,
      itemId: incident._id,
      itemType: 'Incident',
      folderId: incident.folder._id
    });

    return NextResponse.json({ success: true, data: incident });
  } catch (error) {
    console.error(`Error fetching incident ${params.id}:`, error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// PUT /api/incidents/[id] - Update specific incident
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser();

    if (!session?.userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid incident ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { folderId: newFolderIdFromRequest, ...otherUpdates } = body;

    const currentIncidentState = await Incident.findById(params.id).populate('folder', '_id name').lean() as IIncidentPopulatedFolder | null;
    if (!currentIncidentState) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    if (!currentIncidentState.folder || !currentIncidentState.folder._id) {
      console.error(`Incident ${params.id} is missing folder information for PUT.`);
      return NextResponse.json({ error: 'Incident is not associated with a folder, cannot verify permissions for update.' }, { status: 500 });
    }
    const currentFolderId = currentIncidentState.folder._id.toString();
    const currentFolderName = currentIncidentState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    const incidentInstance = await Incident.findById(params.id) as (mongoose.Document<unknown, {}, IIncident> & IIncident & { _id: Types.ObjectId; }) | null; 
    if (!incidentInstance) {
        return NextResponse.json({ error: 'Incident not found for update instance.' }, { status: 404 });
    }

    let newFolderDetailsForAudit = "";
    let targetFolderIdForAudit = incidentInstance.folder; 

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        incidentInstance.folder = new Types.ObjectId(newFolderIdStr);
        targetFolderIdForAudit = incidentInstance.folder;
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    // Apply other updates
    Object.keys(otherUpdates).forEach(key => {
      // Ensure not to overwrite folder if it wasn't part of newFolderIdFromRequest logic or other protected fields
      if (key !== 'folder') { 
        (incidentInstance as any)[key] = otherUpdates[key];
      }
    });

    await incidentInstance.save();
    const populatedUpdatedIncident = await Incident.findById(incidentInstance._id).populate('folder', 'name').lean() as IIncidentPopulatedFolder | null;
    
    if (!populatedUpdatedIncident || !populatedUpdatedIncident.folder) { 
        console.error(`Failed to retrieve updated incident ${params.id} with folder details after save.`);
        return NextResponse.json({ error: 'Failed to retrieve updated incident with folder details' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_INCIDENT',
      details: `Updated incident: ${populatedUpdatedIncident.title} (ID: ${params.id})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: populatedUpdatedIncident._id,
      itemType: 'Incident',
      folderId: targetFolderIdForAudit
    });

    return NextResponse.json({ success: true, data: populatedUpdatedIncident });
  } catch (error) {
    console.error(`Error updating incident ${params.id}:`, error);
    let message = getErrorMessage(error);
    if (error instanceof mongoose.Error.ValidationError) {
        message = error.message;
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/incidents/[id] - Delete specific incident
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser();

    if (!session?.userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid incident ID format' }, { status: 400 });
    }

    const incidentToDelete = await Incident.findById(params.id).populate('folder', '_id name').lean() as IIncidentPopulatedFolder | null;
    if (!incidentToDelete) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    if (!incidentToDelete.folder || !incidentToDelete.folder._id) {
      console.error(`Incident ${params.id} is missing folder information for DELETE.`);
      return NextResponse.json({ error: 'Incident is not associated with a folder, cannot verify permissions for delete.' }, { status: 500 });
    }

    const hasDeletePermission = await checkPermission(userId, incidentToDelete.folder._id.toString(), Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this incident.' }, { status: 403 });
    }

    const deletedResult = await Incident.findByIdAndDelete(params.id);
    if (!deletedResult) {
      // Should ideally be caught by the findById check above, but as a safeguard
      return NextResponse.json({ error: 'Incident not found during delete operation, possibly already deleted.' }, { status: 404 });
    }

    await AuditLog.create({
      userId,
      userEmail: user.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_INCIDENT',
      details: `Deleted incident: ${incidentToDelete.title} (ID: ${params.id}) from folder ${incidentToDelete.folder.name}.`,
      itemId: incidentToDelete._id,
      itemType: 'Incident',
      folderId: incidentToDelete.folder._id
    });

    return NextResponse.json({ success: true, message: 'Incident deleted successfully' });
  } catch (error) {
    console.error(`Error deleting incident ${params.id}:`, error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/incidents/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Incident, { IIncidentPopulatedFolder, IIncident } from '@/models/Incident'; // Added IIncidentPopulatedFolder, IIncident
import Folder from '@/models/Folder'; // Added Folder model
import AuditLog from '@/models/AuditLog';
import { getAccessibleFolderIds, checkPermission } from '@/lib/permission-utils'; // Added permission utils
import mongoose, { Types } from 'mongoose'; // Added mongoose and Types

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Unknown error';
}

// GET /api/incidents - List incidents with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'detectedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const priority = searchParams.get('priority');
    const owner = searchParams.get('owner');
    const search = searchParams.get('search');

    // Build filter object
    const accessibleFolderIds = await getAccessibleFolderIds(userId, 'Viewer');
    if (accessibleFolderIds.length === 0) {
      return NextResponse.json({
        incidents: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false }
      });
    }
    const filter: Record<string, any> = { folder: { $in: accessibleFolderIds } };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;
    if (owner) filter['owner.userId'] = owner;
    
    if (search) {
      filter.$or = [
        { incidentNumber: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: Record<string, unknown> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const incidents = await Incident.find(filter)
      .populate('folder', 'name') // Populate folder name
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean() as IIncidentPopulatedFolder[];

    // Get total count for pagination
    const total = await Incident.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_INCIDENTS',
      details: `Viewed incidents page ${page}. Filters: ${JSON.stringify(filter)}. Found: ${total} in ${accessibleFolderIds.length} accessible folders.`
    });

    return NextResponse.json({
      incidents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST /api/incidents - Create new incident
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { folderId, ...incidentInputData } = body;

    if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Valid folderId is required' }, { status: 400 });
    }

    const hasPermission = await checkPermission(userId, folderId, Folder, 'Contributor');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions for the selected folder or folder not found' }, { status: 403 });
    }
    
    // Validate required fields
    if (!incidentInputData.title || !incidentInputData.description || !incidentInputData.category || !incidentInputData.severity) {
      return NextResponse.json(
        { error: 'Title, description, category, and severity are required' },
        { status: 400 }
      );
    }

    // Set default values
    const incidentData = {
      ...incidentInputData,
      folder: folderId,
      detectedAt: incidentInputData.detectedAt || new Date(),
      reportedAt: incidentInputData.reportedAt || new Date(),
      reporter: {
        userId,
        userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown'
      },
      owner: {
        userId: incidentInputData.owner?.userId || userId,
        userEmail: incidentInputData.owner?.userEmail || user?.emailAddresses[0]?.emailAddress || 'unknown'
      }
    };

    const newIncident = new Incident(incidentData);
    await newIncident.save();
    const populatedIncident = await Incident.findById(newIncident._id).populate('folder', 'name').lean() as IIncidentPopulatedFolder | null;

    // Log audit trail
    if (!populatedIncident || !populatedIncident.folder) {
      console.error(`Failed to retrieve created incident ${newIncident._id} with folder details after save.`);
      return NextResponse.json({ success: false, error: 'Failed to retrieve created incident with folder details for audit logging' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'CREATE_INCIDENT',
      details: `Created incident: ${populatedIncident.title} (ID: ${populatedIncident._id}) in folder ${populatedIncident.folder.name}`,
      itemId: populatedIncident._id,
      itemType: 'Incident',
      folderId: populatedIncident.folder._id as Types.ObjectId
    });

    return NextResponse.json(populatedIncident, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT /api/incidents - Update incident (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { incidentId, folderId: newFolderIdFromRequest, ...otherUpdates } = body;

    if (!incidentId || !mongoose.Types.ObjectId.isValid(incidentId)) {
      return NextResponse.json({ error: 'Valid incidentId is required' }, { status: 400 });
    }

    const currentIncidentState = await Incident.findById(incidentId).populate('folder', '_id name').lean() as IIncidentPopulatedFolder | null;
    if (!currentIncidentState) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    if (!currentIncidentState.folder || !currentIncidentState.folder._id) {
      return NextResponse.json({ error: 'Incident is not associated with a folder, cannot verify permissions.' }, { status: 500 });
    }
    const currentFolderId = currentIncidentState.folder._id.toString();
    const currentFolderName = currentIncidentState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    const incidentInstance = await Incident.findById(incidentId);
    if (!incidentInstance) {
        return NextResponse.json({ error: 'Incident not found for update instance.' }, { status: 404 });
    }

    let newFolderDetailsForAudit = "";
    let targetFolderIdForAudit = incidentInstance.folder; 

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        incidentInstance.folder = new Types.ObjectId(newFolderIdStr);
        targetFolderIdForAudit = incidentInstance.folder;
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    Object.assign(incidentInstance, otherUpdates);
    await incidentInstance.save();

    const populatedUpdatedIncident = await Incident.findById(incidentInstance._id).populate('folder', 'name').lean() as IIncidentPopulatedFolder | null;
    if (!populatedUpdatedIncident || !populatedUpdatedIncident.folder) {
        return NextResponse.json({ error: 'Failed to retrieve updated incident with folder details' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_INCIDENT',
      details: `Updated incident: ${populatedUpdatedIncident.title} (ID: ${populatedUpdatedIncident._id})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: populatedUpdatedIncident._id,
      itemType: 'Incident',
      folderId: targetFolderIdForAudit
    });

    return NextResponse.json(populatedUpdatedIncident);

  } catch (error: unknown) {
    console.error('Error updating incident:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/incidents - Delete incident
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const incidentId = searchParams.get('id');

    if (!incidentId || !mongoose.Types.ObjectId.isValid(incidentId)) {
      return NextResponse.json({ error: 'Valid incidentId is required from query parameters' }, { status: 400 });
    }

    const incidentToDelete = await Incident.findById(incidentId).populate('folder', '_id name').lean() as IIncidentPopulatedFolder | null;
    if (!incidentToDelete) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    if (!incidentToDelete.folder || !incidentToDelete.folder._id) {
      return NextResponse.json({ error: 'Incident is not associated with a folder, cannot verify permissions for delete.' }, { status: 500 });
    }

    const hasDeletePermission = await checkPermission(userId, incidentToDelete.folder._id.toString(), Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ error: 'Forbidden to delete this incident from its current folder' }, { status: 403 });
    }

    await Incident.findByIdAndDelete(incidentId);

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_INCIDENT',
      details: `Deleted incident: ${incidentToDelete.title} (ID: ${incidentId}) from folder ${incidentToDelete.folder.name}.`,
      itemId: incidentToDelete._id,
      itemType: 'Incident',
      folderId: incidentToDelete.folder._id
    });

    return NextResponse.json({ message: 'Incident deleted successfully' });

  } catch (error) {
    console.error('Error deleting incident:', error);
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    );
  }
}
````

## File: guardian/src/app/api/policies/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Policy, { IPolicy, IPolicyPopulatedFolder } from '@/models/Policy';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkPermission, getAccessibleFolderIds } from '@/lib/permission-utils';
import Folder from '@/models/Folder'; // Import Folder model
import mongoose, { Types } from 'mongoose'; // Added Types
import AuditLog from '@/models/AuditLog'; // Uncommented AuditLog

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unknown error occurred';
}

// GET /api/policies/[id] - Get specific policy
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser(); // For audit log email, if used

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid policy ID format' }, { status: 400 });
    }

    const policy = await Policy.findById(params.id).populate('folder', '_id name').lean() as IPolicyPopulatedFolder | null;

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    if (!policy.folder || !policy.folder._id) { // folder is now typed as IPopulatedFolderMin via IPolicyPopulatedFolder
      return NextResponse.json({ error: 'Policy is not associated with a folder, cannot verify permissions.' }, { status: 500 });
    }

    const hasPermission = await checkPermission(userId, policy.folder._id.toString(), Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_POLICY',
      details: `Viewed policy: ${policy.name} (ID: ${params.id}) in folder ${policy.folder.name}`,
      itemId: policy._id,
      itemType: 'Policy',
      folderId: policy.folder._id
    });

    return NextResponse.json({ success: true, data: policy });
  } catch (error) {
    console.error(`Error fetching policy ${params.id}:`, error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// PUT /api/policies/[id] - Update specific policy
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser(); // For audit log email, if used

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid policy ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { folderId: newFolderIdFromRequest, ...otherUpdates } = body;

    const currentPolicyState = await Policy.findById(params.id).populate('folder', '_id name').lean() as IPolicyPopulatedFolder | null;
    if (!currentPolicyState) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }
    if (!currentPolicyState.folder || !currentPolicyState.folder._id) {
      console.error(`Policy ${params.id} is missing folder information for PUT.`);
      return NextResponse.json({ error: 'Policy is not associated with a folder, cannot verify permissions for update.' }, { status: 500 });
    }
    const currentFolderId = currentPolicyState.folder._id.toString();
    const currentFolderName = currentPolicyState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    const policyInstance = await Policy.findById(params.id); // Get the Mongoose document for update
    if (!policyInstance) { // Should be caught by currentPolicyState check, but good to be safe
        return NextResponse.json({ error: 'Policy not found for update instance.' }, { status: 404 });
    }

    let newFolderDetailsForAudit = "";
    let targetFolderIdForAudit = policyInstance.folder; // existing folder by default

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        policyInstance.folder = new Types.ObjectId(newFolderIdStr);
        targetFolderIdForAudit = policyInstance.folder;
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    Object.keys(otherUpdates).forEach(key => {
      if (key !== 'comments' && key !== 'attachments') { // folderId is already handled
        (policyInstance as any)[key] = otherUpdates[key];
      }
    });

    await policyInstance.save();
    const populatedPolicy = await Policy.findById(policyInstance._id).populate('folder', 'name').lean() as IPolicyPopulatedFolder | null;
    
    if (!populatedPolicy || !populatedPolicy.folder) { 
        console.error(`Failed to retrieve updated policy ${params.id} with folder details after save.`);
        return NextResponse.json({ error: 'Failed to retrieve updated policy with folder details' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_POLICY',
      details: `Updated policy: ${populatedPolicy.name} (ID: ${params.id})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: populatedPolicy._id,
      itemType: 'Policy',
      folderId: targetFolderIdForAudit
    });

    return NextResponse.json({ success: true, data: populatedPolicy });
  } catch (error) {
    console.error(`Error updating policy ${params.id}:`, error);
    let message = getErrorMessage(error);
    if (error instanceof mongoose.Error.ValidationError) {
        message = error.message;
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/policies/[id] - Delete specific policy
export async function DELETE(
  request: NextRequest, // request is unused but part of the signature
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser(); // For audit log email, if used

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid policy ID format' }, { status: 400 });
    }

    const policyToDelete = await Policy.findById(params.id).populate('folder', '_id name').lean() as IPolicyPopulatedFolder | null;
    if (!policyToDelete) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    if (!policyToDelete.folder || !policyToDelete.folder._id) { // folder is now typed
      return NextResponse.json({ error: 'Policy is not associated with a folder, cannot verify permissions for delete.' }, { status: 500 });
    }

    const hasDeletePermission = await checkPermission(userId, policyToDelete.folder._id.toString(), Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ error: 'Forbidden to delete this policy from its current folder' }, { status: 403 });
    }

    const deletedPolicy = await Policy.findByIdAndDelete(params.id);
    if (!deletedPolicy) {
      // Should not happen if found before, but good to check
      return NextResponse.json({ error: 'Policy not found during delete operation' }, { status: 404 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_POLICY',
      details: `Deleted policy: ${policyToDelete.name} (ID: ${params.id}) from folder ${policyToDelete.folder.name}.`,
      itemId: policyToDelete._id,
      itemType: 'Policy',
      folderId: policyToDelete.folder._id
    });

    return NextResponse.json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    console.error(`Error deleting policy ${params.id}:`, error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/policies/attachments/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');
    const savedFiles = [];
    for (const file of files) {
      if (typeof file === 'object' && 'arrayBuffer' in file && file.name) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), 'public', fileName);
        await fs.writeFile(filePath, buffer);
        savedFiles.push({ url: `/${fileName}`, name: file.name });
      }
    }
    return NextResponse.json({ success: true, files: savedFiles });
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
      message = (err as { message: string }).message;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/policies/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Standardized db connection
import Policy, { IPolicyPopulatedFolder } from '@/models/Policy'; // Adjusted path assuming models are in @/models
import AuditLog from '@/models/AuditLog'; // Added AuditLog
import { auth, currentUser } from '@clerk/nextjs/server';
import { getAccessibleFolderIds } from '@/lib/permission-utils';
import mongoose, { Types } from 'mongoose'; // Added Types

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Unknown error';
}

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    // Forcing await auth() as it's consistently a promise
    const session = await auth(); 
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const currentUserId = session.userId;

    const accessibleFolderIds = await getAccessibleFolderIds(currentUserId, 'Viewer');
    if (accessibleFolderIds.length === 0) {
      return NextResponse.json({ policies: [], pagination: { total: 0 } }); // Basic pagination info
    }

    // Basic pagination and sorting (can be expanded like in risks route)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const policies = await Policy.find({ folder: { $in: accessibleFolderIds } })
      .populate('folder', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as IPolicyPopulatedFolder[];
    
    const total = await Policy.countDocuments({ folder: { $in: accessibleFolderIds } });

    return NextResponse.json({ 
      policies, 
      pagination: { 
        page, 
        limit, 
        total, 
        totalPages: Math.ceil(total / limit) 
      } 
    });

    // Log audit trail for viewing policies
    await AuditLog.create({
      userId: currentUserId,
      userEmail: (await currentUser())?.emailAddresses[0]?.emailAddress || 'unknown', // Re-fetch current user for email
      action: 'VIEW_POLICIES',
      details: `Viewed policies page ${page}, limit ${limit}. Accessible folders: ${accessibleFolderIds.length}`
      // We don't have a specific item or folder ID for a list view, so we omit them or use a general marker if necessary
    });

  } catch (err: unknown) {
    console.error('Error fetching policies:', err);
    return NextResponse.json({ policies: [], error: getErrorMessage(err), pagination: {total: 0} }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const session = await auth();
    const user = await currentUser();

    if (!session?.userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.userId;

    const body = await req.json();
    const { folderId, ...policyInputData } = body;

    if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Valid folderId is required' }, { status: 400 });
    }

    const accessibleContributorFolders = await getAccessibleFolderIds(userId, 'Contributor');
    if (!accessibleContributorFolders.map(id => id.toString()).includes(folderId.toString())) {
      return NextResponse.json({ error: 'Insufficient permissions for the selected folder or folder not found' }, { status: 403 });
    }

    const newPolicy = new Policy({
      ...policyInputData,
      folder: folderId,
      owner: {
        userId: userId,
        userEmail: user.emailAddresses[0]?.emailAddress || 'N/A'
      },
      state: policyInputData.state || 'Draft', // Keep existing state logic or default to Draft
    });
    
    await newPolicy.save();
    const populatedPolicy = await Policy.findById(newPolicy._id).populate('folder', 'name').lean() as IPolicyPopulatedFolder | null;

    if (!populatedPolicy || !populatedPolicy.folder) {
      console.error(`Failed to retrieve created policy ${newPolicy._id} with folder details after save.`);
      // Potentially rollback or log critical error, but for now, proceed without audit if this rare case happens
      return NextResponse.json({ success: false, error: 'Failed to retrieve created policy with folder details for audit logging' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user.emailAddresses[0]?.emailAddress || 'N/A',
      action: 'CREATE_POLICY',
      details: `Created policy: ${populatedPolicy.name} (ID: ${populatedPolicy._id}) in folder ${populatedPolicy.folder.name}`,
      itemId: populatedPolicy._id,
      itemType: 'Policy',
      folderId: populatedPolicy.folder._id as Types.ObjectId // Cast because it's populated
    });

    return NextResponse.json({ success: true, policy: populatedPolicy }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating policy:', err);
    let message = getErrorMessage(err);
    if (err instanceof mongoose.Error.ValidationError) {
        message = err.message;
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/risks/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Risk, { IRiskPopulatedFolder } from '@/models/Risk';
import AuditLog from '@/models/AuditLog';
import mongoose, { Types } from 'mongoose';
import Folder from '@/models/Folder'; // Added Folder model
import { checkPermission } from '@/lib/permission-utils'; // Removed getAccessibleFolderIds as checkPermission is more direct here
import dbConnect from '@/lib/dbConnect';

// GET /api/risks/[id] - Get specific risk
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Ensure DB connection
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid risk ID format' }, { status: 400 });
    }

    const risk = await Risk.findById(params.id).populate('folder', '_id name').lean() as IRiskPopulatedFolder | null;

    if (!risk) {
      return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
    }

    if (!risk.folder || !risk.folder._id) {
        console.error(`Risk ${params.id} is missing folder information for GET.`);
        return NextResponse.json({ success: false, error: 'Risk is not associated with a folder, cannot verify permissions.' }, { status: 500 });
    }

    const hasPermission = await checkPermission(userId, risk.folder._id.toString(), Folder, 'Viewer');
    if (!hasPermission) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_RISK',
      details: `Viewed risk: ${risk.title} (ID: ${params.id}) in folder ${risk.folder.name}`,
      itemId: risk._id,
      itemType: 'Risk',
      folderId: risk.folder._id
    });

    return NextResponse.json(risk);

  } catch (error) {
    console.error('Error fetching risk:', error);
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PUT /api/risks/[id] - Update specific risk
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Ensure DB connection
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid risk ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { folderId: newFolderIdFromRequest, ...otherUpdates } = body;

    const currentRiskState = await Risk.findById(params.id).populate('folder', '_id name').lean() as IRiskPopulatedFolder | null;

    if (!currentRiskState) {
      return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
    }
    if (!currentRiskState.folder || !currentRiskState.folder._id) {
      console.error(`Risk ${params.id} is missing folder information for PUT.`);
      return NextResponse.json({ error: 'Risk is not associated with a folder, cannot verify permissions for update.' }, { status: 500 });
    }
    const currentFolderId = currentRiskState.folder._id.toString();
    const currentFolderName = currentRiskState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    const riskInstance = await Risk.findById(params.id); // Get the Mongoose document for update
    if (!riskInstance) { // Should be caught by currentRiskState check, but good to be safe
        return NextResponse.json({ error: 'Risk not found for update instance.' }, { status: 404 });
    }

    let newFolderDetailsForAudit = "";
    let targetFolderIdForAudit = riskInstance.folder; // existing folder by default

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        riskInstance.folder = new Types.ObjectId(newFolderIdStr);
        targetFolderIdForAudit = riskInstance.folder;
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    Object.assign(riskInstance, otherUpdates);
    await riskInstance.save();

    const populatedRisk = await Risk.findById(riskInstance._id).populate('folder', 'name').lean() as IRiskPopulatedFolder | null;
    if (!populatedRisk || !populatedRisk.folder) {
        console.error(`Failed to retrieve updated risk ${params.id} with folder details after save.`);
        return NextResponse.json({ error: 'Failed to retrieve updated risk with folder details' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_RISK',
      details: `Updated risk: ${populatedRisk.title} (ID: ${params.id})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: populatedRisk._id,
      itemType: 'Risk',
      folderId: targetFolderIdForAudit
    });

    return NextResponse.json(populatedRisk);

  } catch (error) {
    console.error('Error updating risk:', error);
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/risks/[id] - Delete specific risk
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect(); // Ensure DB connection
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid risk ID format' }, { status: 400 });
    }

    const riskToDeleteState = await Risk.findById(params.id).populate('folder', '_id name').lean() as IRiskPopulatedFolder | null;
    if (!riskToDeleteState) {
      return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
    }

    if (!riskToDeleteState.folder || !riskToDeleteState.folder._id) {
      console.error(`Risk ${params.id} is missing folder information for DELETE.`);
      return NextResponse.json({ success: false, error: 'Risk is not associated with a folder, cannot verify permissions for delete.' }, { status: 500 });
    }
    const folderId = riskToDeleteState.folder._id.toString();
    const folderName = riskToDeleteState.folder.name;

    const hasDeletePermission = await checkPermission(userId, folderId, Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have editor rights for the folder containing this risk.' }, { status: 403 });
    }

    await Risk.findByIdAndDelete(params.id);

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_RISK',
      details: `Deleted risk: ${riskToDeleteState.title} (ID: ${params.id}) from folder ${folderName} (ID: ${folderId}).`,
      itemId: riskToDeleteState._id,
      itemType: 'Risk',
      folderId: riskToDeleteState.folder._id
    });

    return NextResponse.json({ message: 'Risk deleted successfully' });

  } catch (error) {
    console.error('Error deleting risk:', error);
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
````

## File: guardian/src/app/api/risks/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Risk, { IRiskPopulatedFolder } from '@/models/Risk';
import AuditLog from '@/models/AuditLog';
import dbConnect from '@/lib/dbConnect';
import { getAccessibleFolderIds, checkPermission } from '@/lib/permission-utils';
import Folder from '@/models/Folder';
import mongoose, { SortOrder, Types } from 'mongoose'; // Added mongoose and getAccessibleFolderIds, ensured SortOrder is imported if it was only in the original snippet

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Unknown error';
}

// GET /api/risks - List risks with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const owner = searchParams.get('owner');
    const search = searchParams.get('search');

    // Build filter object
    const accessibleFolderIds = await getAccessibleFolderIds(userId, 'Viewer');
    if (accessibleFolderIds.length === 0) {
      return NextResponse.json({
        risks: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false }
      });
    }

    const filter: Record<string, any> = { folder: { $in: accessibleFolderIds } }; // Changed to 'any' for $or type, added folder filter
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (owner) filter['owner.userId'] = owner;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: { [key: string]: SortOrder } = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query with pagination
    const risks = await Risk.find(filter)
      .populate('folder', 'name') // Populate folder name
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean() as IRiskPopulatedFolder[];

    // Get total count for pagination
    const total = await Risk.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Log audit trail
    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'VIEW_RISKS',
      details: `Viewed risks page ${page} with filters: ${JSON.stringify(filter)}`
    });

    return NextResponse.json({
      risks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching risks:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST /api/risks - Create new risk
export async function POST(request: NextRequest) {
  await dbConnect(); // Ensure DB connection is established
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { folderId, ...riskInputData } = body;

    if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Valid folderId is required' }, { status: 400 });
    }

    const accessibleContributorFolders = await getAccessibleFolderIds(userId, 'Contributor');
    if (!accessibleContributorFolders.map(id => id.toString()).includes(folderId.toString())) {
      return NextResponse.json({ error: 'Insufficient permissions for the selected folder or folder not found' }, { status: 403 });
    }
    
    // Validate required fields
    if (!riskInputData.title || !riskInputData.description || !riskInputData.category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    // Create risk with owner information and folderId
    const riskData = {
      ...riskInputData,
      folder: folderId,
      owner: {
        userId,
        userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown'
      }
    };

    const newRisk = new Risk(riskData);
    await newRisk.save();
    const populatedRisk = await Risk.findById(newRisk._id).populate('folder', 'name').lean() as IRiskPopulatedFolder | null;
    if (!populatedRisk || !populatedRisk.folder) {
        console.error(`Failed to retrieve created risk ${newRisk._id} with folder details after save.`);
        return NextResponse.json({ error: 'Failed to retrieve created risk with folder details' }, { status: 500 });
    }

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'CREATE_RISK',
      details: `Created risk: ${populatedRisk.title} (ID: ${populatedRisk._id}) in folder ${populatedRisk.folder.name}`,
      itemId: populatedRisk._id,
      itemType: 'Risk',
      folderId: populatedRisk.folder._id
    });

    return NextResponse.json(populatedRisk, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating risk:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT /api/risks - Update risk (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { riskId: riskIdToUpdate, folderId: newFolderIdFromRequest, ...otherUpdates } = body;

    if (!riskIdToUpdate || !mongoose.Types.ObjectId.isValid(riskIdToUpdate)) {
      return NextResponse.json({ error: 'Valid Risk ID is required' }, { status: 400 });
    }

    const currentRiskState = await Risk.findById(riskIdToUpdate).populate('folder', '_id name').lean() as IRiskPopulatedFolder | null;
    if (!currentRiskState || !currentRiskState.folder || !currentRiskState.folder._id) {
      console.error(`Risk ${riskIdToUpdate} is missing folder information for PUT.`);
      return NextResponse.json({ error: 'Risk not found or missing folder data, cannot verify permissions.' }, { status: 404 });
    }
    const currentFolderId = currentRiskState.folder._id.toString();
    const currentFolderName = currentRiskState.folder.name;

    const hasEditPermission = await checkPermission(userId, currentFolderId, Folder, 'Editor');
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the current folder.' }, { status: 403 });
    }

    const riskInstance = await Risk.findById(riskIdToUpdate);
    if (!riskInstance) { // Should be caught by currentRiskState check, but good to be safe
        return NextResponse.json({ error: 'Risk not found for update instance.' }, { status: 404 });
    }

    let newFolderDetailsForAudit = "";
    let targetFolderIdForAudit = riskInstance.folder; // existing folder by default

    if (newFolderIdFromRequest !== undefined) {
      const newFolderIdStr = newFolderIdFromRequest.toString();
      if (!mongoose.Types.ObjectId.isValid(newFolderIdStr)) {
        return NextResponse.json({ error: 'Invalid new folder ID format' }, { status: 400 });
      }
      if (newFolderIdStr !== currentFolderId) {
        const hasMovePermission = await checkPermission(userId, newFolderIdStr, Folder, 'Contributor');
        if (!hasMovePermission) {
          return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions for the new target folder.' }, { status: 403 });
        }
        riskInstance.folder = new Types.ObjectId(newFolderIdStr);
        targetFolderIdForAudit = riskInstance.folder;
        const newFolderDoc = await Folder.findById(newFolderIdStr).lean();
        newFolderDetailsForAudit = ` to folder ${newFolderDoc ? newFolderDoc.name : `ID ${newFolderIdStr}`}`;
      }
    }

    Object.assign(riskInstance, otherUpdates);
    await riskInstance.save();

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'UPDATE_RISK',
      details: `Updated risk: ${riskInstance.title} (ID: ${riskIdToUpdate})${newFolderDetailsForAudit}. Original folder: ${currentFolderName} (ID: ${currentFolderId}).`,
      itemId: riskInstance._id,
      itemType: 'Risk',
      folderId: targetFolderIdForAudit,
    });

    const populatedRisk = await Risk.findById(riskInstance._id).populate('folder', 'name').lean() as IRiskPopulatedFolder | null;
    return NextResponse.json(populatedRisk);

  } catch (error: unknown) {
    console.error('Error updating risk:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/risks - Delete risk
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const riskIdToDelete = searchParams.get('id');

    if (!riskIdToDelete || !mongoose.Types.ObjectId.isValid(riskIdToDelete)) {
      return NextResponse.json({ error: 'Valid Risk ID is required from query parameters' }, { status: 400 });
    }

    const riskToDeleteState = await Risk.findById(riskIdToDelete).populate('folder', '_id name').lean() as IRiskPopulatedFolder | null;
    if (!riskToDeleteState || !riskToDeleteState.folder || !riskToDeleteState.folder._id) {
      console.error(`Risk ${riskIdToDelete} is missing folder information for DELETE.`);
      return NextResponse.json({ error: 'Risk not found or missing folder data, cannot verify permissions.' }, { status: 404 });
    }
    const folderId = riskToDeleteState.folder._id.toString();
    const folderName = riskToDeleteState.folder.name;

    const hasDeletePermission = await checkPermission(userId, folderId, Folder, 'Editor');
    if (!hasDeletePermission) {
      return NextResponse.json({ error: 'Forbidden: You do not have editor rights for the folder containing this risk.' }, { status: 403 });
    }

    await Risk.findByIdAndDelete(riskIdToDelete);

    await AuditLog.create({
      userId,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'unknown',
      action: 'DELETE_RISK',
      details: `Deleted risk: ${riskToDeleteState.title} (ID: ${riskIdToDelete}) from folder ${folderName} (ID: ${folderId}).`,
      itemId: riskIdToDelete,
      itemType: 'Risk',
      folderId: new Types.ObjectId(folderId),
    });

    return NextResponse.json({ message: 'Risk deleted successfully' });

  } catch (error) {
    console.error('Error deleting risk:', error);
    return NextResponse.json(
      { error: 'Failed to delete risk' },
      { status: 500 }
    );
  }
}
````

## File: guardian/src/app/api/role-assignments/[assignmentId]/route.ts
````typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/mongoose';
import RoleAssignment, { RoleType } from '@/models/RoleAssignment';
import Folder from '@/models/Folder'; // To check folder owner for 'Owner' role modifications
import { checkPermission } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// PUT: Update a specific role assignment (e.g., change role)
export async function PUT(request: Request, { params }: { params: { assignmentId: string } }) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.assignmentId)) {
    return NextResponse.json({ error: 'Invalid role assignment ID format' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { role: newRole } = body;

    if (!newRole || !['Owner', 'Editor', 'Contributor', 'Viewer'].includes(newRole)) {
      return NextResponse.json({ error: 'Valid new role is required (Owner, Editor, Contributor, Viewer)' }, { status: 400 });
    }

    const assignmentToUpdate = await RoleAssignment.findById(params.assignmentId).populate('folderId');
    if (!assignmentToUpdate) {
      return NextResponse.json({ error: 'Role assignment not found' }, { status: 404 });
    }

    const folderId = assignmentToUpdate.folderId._id.toString(); // Populated folderId
    const targetFolder = await Folder.findById(folderId); // Re-fetch for owner info
    if (!targetFolder) {
        return NextResponse.json({ error: 'Associated folder not found. This should not happen.' }, { status: 500 });
    }

    // Check if performing user has 'Owner' permission on the target folder to manage roles
    const hasPermissionToManageRoles = await checkPermission(performingUserId, folderId, Folder, 'Owner');
    if (!hasPermissionToManageRoles) {
      return NextResponse.json({ error: 'Forbidden: Only folder owners can modify roles.' }, { status: 403 });
    }
    
    // Prevent changing role TO 'Owner' if the target user is not the original folder owner
    // And prevent changing role FROM 'Owner' for the original folder owner (they must always retain owner status implicitly)
    if (newRole === 'Owner' && assignmentToUpdate.userId !== targetFolder.owner) {
        return NextResponse.json({ error: 'The Owner role can only be held by the original folder creator.' }, { status: 403 });
    }
    if (assignmentToUpdate.role === 'Owner' && assignmentToUpdate.userId === targetFolder.owner && newRole !== 'Owner') {
        return NextResponse.json({ error: 'The original folder owner cannot have their Owner role changed or removed.' }, { status: 403 });
    }
    // Prevent changing role TO 'Owner' if the performing user is not the folder owner themselves.
    if (newRole === 'Owner' && performingUserId !== targetFolder.owner) {
        return NextResponse.json({ error: 'Only the original folder owner can assign/set the Owner role.' }, { status: 403 });
    }

    assignmentToUpdate.role = newRole as RoleType;
    await assignmentToUpdate.save();

    // Re-populate folderId after save if needed, or just return the updated assignment
    const finalAssignment = await RoleAssignment.findById(assignmentToUpdate._id).populate('folderId', 'name');

    return NextResponse.json(finalAssignment, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating role assignment ${params.assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to update role assignment' }, { status: 500 });
  }
}

// DELETE: Delete a specific role assignment
export async function DELETE(request: Request, { params }: { params: { assignmentId: string } }) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.assignmentId)) {
    return NextResponse.json({ error: 'Invalid role assignment ID format' }, { status: 400 });
  }

  try {
    const assignmentToDelete = await RoleAssignment.findById(params.assignmentId).populate('folderId');
    if (!assignmentToDelete) {
      return NextResponse.json({ error: 'Role assignment not found' }, { status: 404 });
    }

    const folderId = assignmentToDelete.folderId._id.toString();
    const targetFolder = await Folder.findById(folderId); // Re-fetch for owner info
    if (!targetFolder) {
        return NextResponse.json({ error: 'Associated folder not found. This should not happen.' }, { status: 500 });
    }

    // Check if performing user has 'Owner' permission on the target folder to manage roles
    const hasPermissionToManageRoles = await checkPermission(performingUserId, folderId, Folder, 'Owner');
    if (!hasPermissionToManageRoles) {
      return NextResponse.json({ error: 'Forbidden: Only folder owners can delete roles.' }, { status: 403 });
    }

    // Prevent deleting the 'Owner' role for the original folder owner
    if (assignmentToDelete.role === 'Owner' && assignmentToDelete.userId === targetFolder.owner) {
      return NextResponse.json({ error: 'Cannot delete the Owner role for the original folder owner.' }, { status: 403 });
    }

    await RoleAssignment.findByIdAndDelete(params.assignmentId);
    return NextResponse.json({ message: 'Role assignment deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting role assignment ${params.assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to delete role assignment' }, { status: 500 });
  }
}
````

## File: guardian/src/app/api/role-assignments/route.ts
````typescript
import { NextResponse } from 'next/server';
import { auth, clerkClient, User } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/mongoose';
import RoleAssignment, { IRoleAssignment, RoleType } from '@/models/RoleAssignment';
import Folder from '@/models/Folder';
import { checkPermission } from '@/lib/permission-utils';
import mongoose from 'mongoose';

// POST: Create a new role assignment
export async function POST(request: Request) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userIdToAssign, emailToAssign, role, folderId } = body;

    if ((!userIdToAssign && !emailToAssign) || (userIdToAssign && emailToAssign)) {
      return NextResponse.json({ error: 'Either userIdToAssign or emailToAssign must be provided, but not both.' }, { status: 400 });
    }
    if (!role || !['Owner', 'Editor', 'Contributor', 'Viewer'].includes(role)) {
      return NextResponse.json({ error: 'Valid role is required (Owner, Editor, Contributor, Viewer)' }, { status: 400 });
    }
    if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: 'Valid folderId is required' }, { status: 400 });
    }

    // Check if performing user has 'Owner' permission on the target folder to manage roles
    const hasPermissionToManageRoles = await checkPermission(performingUserId, folderId, Folder, 'Owner');
    if (!hasPermissionToManageRoles) {
      return NextResponse.json({ error: 'Forbidden: Only folder owners can assign roles.' }, { status: 403 });
    }

    let targetUserId = userIdToAssign;
    if (emailToAssign) {
        try {
            const users = await (await clerkClient()).users.getUserList({ emailAddress: [emailToAssign] });
            if (users.data.length === 0) {
                return NextResponse.json({ error: `User with email '${emailToAssign}' not found.` }, { status: 404 });
            }
            targetUserId = users.data[0].id;
        } catch (clerkError) {
            console.error('Clerk API error fetching user by email:', clerkError);
            return NextResponse.json({ error: 'Failed to find user by email via Clerk.' }, { status: 500 });
        }
    }

    if (!targetUserId) {
        return NextResponse.json({ error: 'Target user ID could not be determined.' }, { status: 400 });
    }

    // Prevent assigning 'Owner' role if the performing user is not the folder owner or trying to assign Owner to someone else
    // The folder owner is determined by the Folder model's owner field, not just by having an 'Owner' role.
    const targetFolder = await Folder.findById(folderId);
    if (!targetFolder) {
        return NextResponse.json({ error: 'Target folder not found.' }, { status: 404 });
    }
    if (role === 'Owner' && targetFolder.owner !== performingUserId) {
        return NextResponse.json({ error: 'Only the original folder owner can assign the Owner role.' }, { status: 403 });
    }
    if (role === 'Owner' && targetUserId !== targetFolder.owner) {
        // This check is a bit redundant if the above holds, but good for clarity.
        // It means you cannot make someone else an 'Owner' if they are not the original folder.owner.
        // The original owner always retains an implicit Owner role. This prevents transfer of true ownership via role assignment.
        return NextResponse.json({ error: 'The Owner role can only be held by the original folder creator.' }, { status: 403 });
    }

    // Check for existing assignment for this user on this folder
    const existingAssignment = await RoleAssignment.findOne({ userId: targetUserId, folderId });
    if (existingAssignment) {
      if (existingAssignment.role === role) {
        return NextResponse.json({ error: 'User already has this role on this folder.' }, { status: 409 }); // Conflict
      }
      // If role is different, we'll update it via PUT to /api/role-assignments/[assignmentId] instead of creating a new one.
      // Or, for simplicity here, we can just update it.
      existingAssignment.role = role as RoleType;
      await existingAssignment.save();
      return NextResponse.json(existingAssignment, { status: 200 });
    }

    const newRoleAssignment = new RoleAssignment({
      userId: targetUserId,
      role,
      folderId,
    });

    await newRoleAssignment.save();
    return NextResponse.json(newRoleAssignment, { status: 201 });

  } catch (error: any) {
    console.error('Error creating role assignment:', error);
    if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('duplicate key')) { // Handle unique index violation
      return NextResponse.json({ error: 'This role assignment already exists or conflicts with an existing one.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create role assignment' }, { status: 500 });
  }
}

// GET: List role assignments (e.g., for a folder or a user)
export async function GET(request: Request) {
  await dbConnect();
  const session = await auth();
  const performingUserId = session?.userId;

  if (!performingUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  const userIdParam = searchParams.get('userId'); // User whose roles are being listed

  try {
    let query: mongoose.FilterQuery<IRoleAssignment> = {};

    if (folderId) {
      if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return NextResponse.json({ error: 'Invalid folder ID format' }, { status: 400 });
      }
      // To list roles for a folder, performing user must be at least 'Viewer' of that folder.
      const hasPermissionToList = await checkPermission(performingUserId, folderId, Folder, 'Viewer');
      if (!hasPermissionToList) {
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions to view roles for this folder.' }, { status: 403 });
      }
      query.folderId = folderId;
    }

    if (userIdParam) {
      // If querying for a specific user's roles, only that user or an admin (not implemented yet) should be able to see them.
      // For now, let's restrict this to the user themselves or if they are also querying a folder they have access to.
      if (userIdParam !== performingUserId && !folderId) { // If not querying own roles and not scoping by a folder
          return NextResponse.json({ error: 'Forbidden: Can only list your own roles or roles for a folder you can access.' }, { status: 403 });
      }
      query.userId = userIdParam;
    }
    
    // If no specific folderId or userIdParam is given, it implies listing all roles the performingUser can see.
    // This could be a large list and might need admin privileges or further scoping in a real app.
    // For now, if neither is provided, we'll assume they want to see their own assignments across all folders they have a role on.
    if (!folderId && !userIdParam) {
        query.userId = performingUserId;
    }

    const assignments = await RoleAssignment.find(query).populate('folderId', 'name'); // Populate folder name
    
    // Enhance assignments with user email from Clerk (if listing for a folder)
    if (folderId && assignments.length > 0) {
        const userIdsToFetch = Array.from(new Set(assignments.map(a => a.userId)));
        try {
            const users = await (await clerkClient()).users.getUserList({ userId: userIdsToFetch });
            const userMap = new Map(users.data.map((u: User) => [u.id, u.emailAddresses[0]?.emailAddress || 'N/A']));
            
            const populatedAssignments = assignments.map(a => {
                const assignmentObj = a.toObject(); // Convert Mongoose doc to plain object to add properties
                return {
                    ...assignmentObj,
                    userEmail: userMap.get(a.userId)
                };
            });
            return NextResponse.json(populatedAssignments, { status: 200 });
        } catch (clerkError) {
            console.error('Clerk API error fetching user details for role assignments:', clerkError);
            // Return assignments without email if Clerk fails, rather than failing the whole request
            return NextResponse.json(assignments, { status: 200 }); 
        }
    }

    return NextResponse.json(assignments, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching role assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch role assignments' }, { status: 500 });
  }
}
````

## File: guardian/src/app/dashboard/activity/page.tsx
````typescript
"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from '@clerk/nextjs';
import { Download, Eye, Calendar, Activity, AlertTriangle, CheckCircle, XCircle, FileText, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';

function getUserRole(user: { id: string } | null | undefined) {
  if (!user) return 'Viewer';
  if (typeof window !== 'undefined') {
    let adminId = localStorage.getItem('adminUserId');
    if (!adminId) {
      localStorage.setItem('adminUserId', user.id);
      adminId = user.id;
    }
    if (user.id === adminId) return 'Admin';
  }
  return 'Viewer';
}

interface ActivityLog {
  _id: string;
  action: string;
  description: string;
  category: string;
  severity: string;
  userId: string;
  userEmail: string;
  timestamp: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, unknown>;
}

export default function ActivityPage() {
  const { user } = useUser();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    action: '',
    search: '',
    dateRange: '7d'
  });
  const role = getUserRole(user);

  const fetchActivities = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/audit-log?${params}`);
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (role === 'Admin') {
      fetchActivities();
    }
  }, [role, fetchActivities]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <XCircle className="w-4 h-4 text-danger" />;
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'Medium':
        return <AlertTriangle className="w-4 h-4 text-accent" />;
      case 'Low':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Info':
        return <Activity className="w-4 h-4 text-primary" />;
      default:
        return <Activity className="w-4 h-4 text-muted" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'badge bg-danger';
      case 'High':
        return 'badge bg-warning text-danger';
      case 'Medium':
        return 'badge bg-accent text-primary';
      case 'Low':
        return 'badge bg-success';
      case 'Info':
        return 'badge bg-primary';
      default:
        return 'badge bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Authentication':
        return <Shield className="w-4 h-4 text-primary" />;
      case 'Data Access':
        return <FileText className="w-4 h-4 text-success" />;
      case 'Configuration':
        return <Target className="w-4 h-4 text-accent" />;
      case 'System':
        return <Activity className="w-4 h-4 text-warning" />;
      default:
        return <Activity className="w-4 h-4 text-muted" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'text-success';
      case 'UPDATE':
        return 'text-warning';
      case 'DELETE':
        return 'text-danger';
      case 'LOGIN':
        return 'text-primary';
      case 'LOGOUT':
        return 'text-muted';
      default:
        return 'text-muted';
    }
  };

  if (role !== 'Admin') {
    return <div className="p-8 text-red-600 font-bold">Access denied. Only Admins can view the Activity Log.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Activity Log</h1>
          <p className="text-muted">Monitor system activities and user actions</p>
        </div>
        <Button
          onClick={() => {/* TODO: Export activity log */}}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Activities</p>
              <p className="text-2xl font-bold text-primary">{activities.length}</p>
            </div>
            <Activity className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Critical Events</p>
              <p className="text-2xl font-bold text-danger">
                {activities.filter(a => a.severity === 'Critical').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-danger" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">High Severity</p>
              <p className="text-2xl font-bold text-warning">
                {activities.filter(a => a.severity === 'High').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Today&apos;s Activities</p>
              <p className="text-2xl font-bold text-accent">
                {activities.filter(a => {
                  const today = new Date();
                  const activityDate = new Date(a.timestamp);
                  return activityDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Search activities..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="select"
          >
            <option value="">All Categories</option>
            <option value="Authentication">Authentication</option>
            <option value="Data Access">Data Access</option>
            <option value="Configuration">Configuration</option>
            <option value="System">System</option>
          </select>
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="select"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Info">Info</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="select"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </Card>

      {/* Activity List */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Category</th>
                <th>Severity</th>
                <th>User</th>
                <th>Resource</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id} className="hover:bg-background">
                  <td>
                    <div>
                      <div className="text-sm font-medium text-primary">
                        <span className={getActionColor(activity.action)}>
                          {activity.action}
                        </span>
                      </div>
                      <div className="text-sm text-muted truncate max-w-xs">
                        {activity.description}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(activity.category)}
                      <span className="text-sm text-muted">{activity.category}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(activity.severity)}
                      <span className={getSeverityColor(activity.severity)}>
                        {activity.severity}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-muted">
                      {activity.userEmail}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {activity.resourceName}
                      </div>
                      <div className="text-xs text-muted">
                        {activity.resourceType}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-muted">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {/* TODO: View activity details */}}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-primary mb-4">Activity by Category</h3>
          <div className="space-y-3">
            {['Authentication', 'Data Access', 'Configuration', 'System'].map((category) => {
              const count = activities.filter(a => a.category === category).length;
              return (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="font-medium text-primary">{category}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-primary mb-4">Activity by Severity</h3>
          <div className="space-y-3">
            {['Critical', 'High', 'Medium', 'Low', 'Info'].map((severity) => {
              const count = activities.filter(a => a.severity === severity).length;
              return (
                <div key={severity} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(severity)}
                    <span className={`text-sm font-medium ${getSeverityColor(severity)}`}>
                      {count}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${getSeverityColor(severity)}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
````

## File: guardian/src/app/dashboard/compliance/page.tsx
````typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Clock, Shield, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditSessionManager } from '@/components/compliance/AuditSessionManager';
import { Input } from '@/components/ui/Input';

interface Compliance {
  _id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  complianceLevel: string;
  authority: string;
  jurisdiction: string;
  owner: {
    userId: string;
    userEmail: string;
  };
  requirements: Record<string, unknown>[];
  gaps: Record<string, unknown>[];
  auditSessions: {
    _id: string;
    title: string;
    status: string;
    auditStartDate: string;
    auditEndDate?: string;
    auditor: { userEmail: string; };
    auditFindings: {
      severity: string;
      status: string;
    }[];
  }[];
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
  tags: string[];
}

export default function CompliancePage() {
  const [compliance, setCompliance] = useState<Compliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComplianceForm, setShowComplianceForm] = useState(false);
  const [selectedCompliance, setSelectedCompliance] = useState<Compliance | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    type: '',
    complianceLevel: '',
    search: ''
  });
  const [view, setView] = useState<'list' | 'dashboard'>('list');

  const fetchCompliance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/compliance?${params}`);
      const data = await response.json();
      setCompliance(data.compliance || []);
    } catch (error) {
      console.error('Error fetching compliance:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  const handleDeleteCompliance = async (complianceId: string) => {
    if (!confirm('Are you sure you want to delete this compliance framework?')) return;

    try {
      const response = await fetch(`/api/compliance/${complianceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCompliance();
      }
    } catch (error) {
      console.error('Error deleting compliance:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Inactive': return <XCircle className="w-4 h-4 text-muted" />;
      case 'Under Review': return <Clock className="w-4 h-4 text-warning" />;
      case 'Superseded': return <AlertTriangle className="w-4 h-4 text-accent" />;
      default: return <FileText className="w-4 h-4 text-muted" />;
    }
  };

  const getComplianceLevelColor = (level: string) => {
    switch (level) {
      case 'Compliant': return 'badge bg-success';
      case 'Partially Compliant': return 'badge bg-warning text-danger';
      case 'Non-Compliant': return 'badge bg-danger';
      case 'Under Assessment': return 'badge bg-accent text-primary';
      default: return 'badge bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Regulation': return <Shield className="w-4 h-4 text-primary" />;
      case 'Standard': return <FileText className="w-4 h-4 text-success" />;
      case 'Framework': return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'Policy': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <FileText className="w-4 h-4 text-muted" />;
    }
  };

  const calculateComplianceScore = (c: Compliance) => {
    if (!c.requirements || c.requirements.length === 0) return 100;
    const applicable = c.requirements.filter(r => r.status !== 'Not Applicable');
    if (applicable.length === 0) return 100;
    const met = applicable.filter(r => r.status === 'Met').length;
    const partial = applicable.filter(r => r.status === 'Partially Met').length;
    return Math.round(((met + (partial * 0.5)) / applicable.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (selectedCompliance) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedCompliance(null)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">{selectedCompliance.name}</h1>
            <p className="text-muted line-clamp-1">{selectedCompliance.description}</p>
          </div>
        </div>
        
        <Tabs defaultValue="audit-sessions" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audit-sessions">Audit Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <h3 className="text-lg font-bold mb-4">Framework Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-semibold">Type:</span> {selectedCompliance.type}</div>
                <div><span className="font-semibold">Category:</span> {selectedCompliance.category}</div>
                <div><span className="font-semibold">Status:</span> {selectedCompliance.status}</div>
                <div><span className="font-semibold">Compliance Level:</span> {selectedCompliance.complianceLevel}</div>
                <div><span className="font-semibold">Authority:</span> {selectedCompliance.authority}</div>
                <div><span className="font-semibold">Jurisdiction:</span> {selectedCompliance.jurisdiction}</div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="audit-sessions">
            <AuditSessionManager
              complianceId={selectedCompliance._id}
              sessions={selectedCompliance.auditSessions}
              onSessionsUpdate={fetchCompliance}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Compliance Management</h1>
          <p className="text-muted">Track and manage regulatory compliance frameworks</p>
        </div>
        <Button onClick={() => setShowComplianceForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Framework
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-muted">Total Frameworks</p><p className="text-2xl font-bold text-primary">{compliance.length}</p></div><Shield className="w-8 h-8 text-primary" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-muted">Compliant</p><p className="text-2xl font-bold text-success">{compliance.filter(c => c.complianceLevel === 'Compliant').length}</p></div><CheckCircle className="w-8 h-8 text-success" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-muted">Open Gaps</p><p className="text-2xl font-bold text-warning">{compliance.reduce((total, c) => total + (c.gaps?.filter(g => g.status !== 'Closed').length || 0), 0)}</p></div><AlertTriangle className="w-8 h-8 text-warning" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-muted">Critical Findings</p><p className="text-2xl font-bold text-danger">{compliance.reduce((total, c) => total + (c.auditSessions?.reduce((sTotal, s) => sTotal + (s.auditFindings?.filter(f => f.severity === 'Critical' && f.status !== 'Closed').length || 0), 0) || 0), 0)}</p></div><XCircle className="w-8 h-8 text-danger" /></div></Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Input type="text" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>List</Button>
            <Button variant={view === 'dashboard' ? 'primary' : 'secondary'} onClick={() => setView('dashboard')}>Dashboard</Button>
          </div>
        </div>
      </Card>

      {view === 'dashboard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compliance.map((framework) => (
            <Card key={framework._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">{getTypeIcon(framework.type)}<span className="text-sm text-muted">{framework.type}</span></div>
                {getStatusIcon(framework.status)}
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{framework.name}</h3>
              <p className="text-sm text-muted mb-4 line-clamp-2">{framework.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-sm text-muted">Score:</span><span className={`text-sm font-medium ${getScoreColor(calculateComplianceScore(framework))}`}>{calculateComplianceScore(framework)}%</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-muted">Open Gaps:</span><span className="text-sm font-medium text-warning">{framework.gaps?.filter(g => g.status !== 'Closed').length || 0}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t"><div className="flex items-center justify-between"><span className={getComplianceLevelColor(framework.complianceLevel)}>{framework.complianceLevel}</span><div className="flex items-center gap-2"><Button variant="secondary" size="icon" onClick={() => setSelectedCompliance(framework)}><Eye className="w-4 h-4" /></Button><Button variant="primary" size="icon" onClick={() => { setSelectedCompliance(framework); setShowComplianceForm(true);}}><Edit className="w-4 h-4" /></Button></div></div></div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Level</TableHead><TableHead>Score</TableHead><TableHead>Owner</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {compliance.map((framework) => (
                  <TableRow key={framework._id}>
                    <TableCell><div className="font-medium text-primary">{framework.name}</div><div className="text-sm text-muted truncate max-w-xs">{framework.description}</div></TableCell>
                    <TableCell><div className="flex items-center gap-2">{getTypeIcon(framework.type)}<span className="text-sm text-muted">{framework.type}</span></div></TableCell>
                    <TableCell><div className="flex items-center gap-2">{getStatusIcon(framework.status)}<span className="text-sm text-muted">{framework.status}</span></div></TableCell>
                    <TableCell><span className={getComplianceLevelColor(framework.complianceLevel)}>{framework.complianceLevel}</span></TableCell>
                    <TableCell><span className={`text-sm font-medium ${getScoreColor(calculateComplianceScore(framework))}`}>{calculateComplianceScore(framework)}%</span></TableCell>
                    <TableCell><div className="text-sm text-muted">{framework.owner.userEmail}</div></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Button variant="secondary" size="icon" onClick={() => setSelectedCompliance(framework)}><Eye className="w-4 h-4" /></Button><Button variant="primary" size="icon" onClick={() => { setSelectedCompliance(framework); setShowComplianceForm(true);}}><Edit className="w-4 h-4" /></Button><Button variant="danger" size="icon" onClick={() => handleDeleteCompliance(framework._id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {showComplianceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <h2 className="text-xl font-bold text-primary mb-4">{selectedCompliance ? 'Edit' : 'Add'} Framework</h2>
            <p className="text-muted mb-4">Compliance form component will be implemented here.</p>
            <div className="flex gap-2">
              <Button onClick={() => { fetchCompliance(); setShowComplianceForm(false); setSelectedCompliance(null); }}>Save</Button>
              <Button variant="secondary" onClick={() => { setShowComplianceForm(false); setSelectedCompliance(null); }}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
````

## File: guardian/src/app/dashboard/controls/page.tsx
````typescript
'use client';

import React, { useState, useEffect } from 'react';
import { ControlTable } from '@/components/controls/ControlTable';
import { ControlModal } from '@/components/controls/ControlModal';
import { Button } from '@/components/ui/Button'; // Assuming a UI library button component exists
// Removed local Control interface, using imported IControlPopulatedFolder as Control

import { IControlPopulatedFolder as Control } from '@/models/Control';

export default function ControlsPage() {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);

  const fetchControls = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/controls');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.success) {
        setControls(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch controls:", error);
      // Here you would add a user-facing error message (e.g., using a toast library)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchControls();
  }, []);

  const handleEdit = (control: Control) => {
    setSelectedControl(control);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedControl(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedControl(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Control Library</h1>
        <Button onClick={handleAddNew}>
          Add New Control
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading controls...</p>
          {/* You could add a spinner component here */}
        </div>
      ) : (
        <ControlTable
          controls={controls}
          onEdit={handleEdit}
          onRefresh={fetchControls}
        />
      )}

      {isModalOpen && (
        <ControlModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={fetchControls}
          control={selectedControl}
        />
      )}
    </div>
  );
}
````

## File: guardian/src/app/dashboard/documents/page.tsx
````typescript
"use client";
import { useState, useEffect, useCallback } from "react";
import { Eye, Edit, Trash2, FileText, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';

interface Document {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  status: string;
  version: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: {
    userId: string;
    userEmail: string;
  };
  uploadedAt: string;
  lastModified: string;
  tags: string[];
  accessLevel: string;
}

export default function DocumentRepositoryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    search: ''
  });
  const [view, setView] = useState<'list' | 'grid'>('list');

  const fetchDocuments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/documents?${params}`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Published':
        return <FileText className="w-4 h-4 text-success" />;
      case 'Draft':
        return <FileText className="w-4 h-4 text-warning" />;
      case 'Under Review':
        return <FileText className="w-4 h-4 text-accent" />;
      case 'Archived':
        return <FileText className="w-4 h-4 text-muted" />;
      default:
        return <FileText className="w-4 h-4 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'badge bg-success';
      case 'Draft':
        return 'badge bg-warning text-danger';
      case 'Under Review':
        return 'badge bg-accent text-primary';
      case 'Archived':
        return 'badge bg-muted';
      default:
        return 'badge bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Policy':
        return <FileText className="w-4 h-4 text-primary" />;
      case 'Procedure':
        return <FileText className="w-4 h-4 text-success" />;
      case 'Form':
        return <FileText className="w-4 h-4 text-accent" />;
      case 'Template':
        return <FileText className="w-4 h-4 text-warning" />;
      default:
        return <FileText className="w-4 h-4 text-muted" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Document Management</h1>
          <p className="text-muted">Manage and organize organizational documents</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Documents</p>
              <p className="text-2xl font-bold text-primary">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Published</p>
              <p className="text-2xl font-bold text-success">
                {documents.filter(d => d.status === 'Published').length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Drafts</p>
              <p className="text-2xl font-bold text-warning">
                {documents.filter(d => d.status === 'Draft').length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-warning" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Under Review</p>
              <p className="text-2xl font-bold text-accent">
                {documents.filter(d => d.status === 'Under Review').length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search documents..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="select"
            >
              <option value="">All Types</option>
              <option value="Policy">Policy</option>
              <option value="Procedure">Procedure</option>
              <option value="Form">Form</option>
              <option value="Template">Template</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="select"
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'secondary'}
              onClick={() => setView('list')}
            >
              List View
            </Button>
            <Button
              variant={view === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setView('grid')}
            >
              Grid View
            </Button>
          </div>
        </div>
      </Card>

      {/* Documents Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <Card key={document._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(document.type)}
                  <span className="text-sm text-muted">{document.type}</span>
                </div>
                {getStatusIcon(document.status)}
              </div>
              
              <h3 className="text-lg font-semibold text-primary mb-2">{document.title}</h3>
              <p className="text-sm text-muted mb-4 line-clamp-2">{document.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Version:</span>
                  <span className="text-sm font-medium">{document.version}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Size:</span>
                  <span className="text-sm font-medium">{formatFileSize(document.fileSize)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Uploaded:</span>
                  <span className="text-sm font-medium">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className={getStatusColor(document.status)}>
                    {document.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedDocument(document);
                        setShowUploadModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteDocument(document._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Documents List View */}
      {view === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document._id} className="hover:bg-background">
                    <td>
                      <div>
                        <div className="text-sm font-medium text-primary">
                          {document.title}
                        </div>
                        <div className="text-sm text-muted truncate max-w-xs">
                          {document.description}
                        </div>
                        <div className="text-xs text-muted">
                          by {document.uploadedBy.userEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(document.type)}
                        <span className="text-sm text-muted">{document.type}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(document.status)}
                        <span className={getStatusColor(document.status)}>
                          {document.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium">{document.version}</span>
                    </td>
                    <td>
                      <span className="text-sm text-muted">{formatFileSize(document.fileSize)}</span>
                    </td>
                    <td>
                      <div className="text-sm text-muted">
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedDocument(document)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedDocument(document);
                            setShowUploadModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteDocument(document._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <h2 className="text-xl font-bold text-primary mb-4">
              {selectedDocument ? 'Edit Document' : 'Upload Document'}
            </h2>
            <p className="text-muted mb-4">Document upload form will be implemented here.</p>
            <div className="flex gap-2">
              <Button onClick={() => {
                fetchDocuments();
                setShowUploadModal(false);
                setSelectedDocument(null);
              }}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => {
                setShowUploadModal(false);
                setSelectedDocument(null);
              }}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
````

## File: guardian/src/app/dashboard/incidents/page.tsx
````typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Edit, Trash2, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';

interface Incident {
  _id: string;
  incidentNumber: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  priority: string;
  reportedBy: {
    userId: string;
    userEmail: string;
  };
  assignedTo?: {
    userId: string;
    userEmail: string;
  };
  reportedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  attachments: string[];
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    category: '',
    priority: '',
    search: ''
  });
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const fetchIncidents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/incidents?${params}`);
      const data = await response.json();
      setIncidents(data.incidents || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleDeleteIncident = async (incidentId: string) => {
    if (!confirm('Are you sure you want to delete this incident?')) return;

    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchIncidents();
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-primary" />;
      case 'Resolved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Closed':
        return <CheckCircle className="w-4 h-4 text-muted" />;
      case 'Escalated':
        return <XCircle className="w-4 h-4 text-danger" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'badge bg-warning text-danger';
      case 'In Progress':
        return 'badge bg-accent text-primary';
      case 'Resolved':
        return 'badge bg-success';
      case 'Closed':
        return 'badge bg-muted';
      case 'Escalated':
        return 'badge bg-danger';
      default:
        return 'badge bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'badge bg-danger';
      case 'High':
        return 'badge bg-warning text-danger';
      case 'Medium':
        return 'badge bg-accent text-primary';
      case 'Low':
        return 'badge bg-success';
      default:
        return 'badge bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-danger';
      case 'High':
        return 'text-warning';
      case 'Medium':
        return 'text-accent';
      case 'Low':
        return 'text-success';
      default:
        return 'text-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Incident Management</h1>
          <p className="text-muted">Track and manage security incidents and issues</p>
        </div>
        <Button
          onClick={() => setShowIncidentForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Report Incident
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Incidents</p>
              <p className="text-2xl font-bold text-primary">{incidents.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Open</p>
              <p className="text-2xl font-bold text-warning">
                {incidents.filter(i => i.status === 'Open').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">In Progress</p>
              <p className="text-2xl font-bold text-accent">
                {incidents.filter(i => i.status === 'In Progress').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-accent" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Resolved</p>
              <p className="text-2xl font-bold text-success">
                {incidents.filter(i => i.status === 'Resolved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search incidents..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="select"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Escalated">Escalated</option>
            </select>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="select"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="select"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'secondary'}
              onClick={() => setView('list')}
            >
              List View
            </Button>
            <Button
              variant={view === 'kanban' ? 'primary' : 'secondary'}
              onClick={() => setView('kanban')}
            >
              Kanban View
            </Button>
          </div>
        </div>
      </Card>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
            <Card key={status}>
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                {getStatusIcon(status)}
                {status}
                <span className="text-sm text-muted">
                  ({incidents.filter(i => i.status === status).length})
                </span>
              </h3>
              <div className="space-y-3">
                {incidents
                  .filter(incident => incident.status === status)
                  .map((incident) => (
                    <Card key={incident._id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-primary">
                            {incident.incidentNumber}
                          </h4>
                          <span className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted line-clamp-2">
                          {incident.title}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                          <span>{incident.reportedBy.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setSelectedIncident(incident);
                              setShowIncidentForm(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Incidents List View */}
      {view === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Incident</th>
                  <th>Status</th>
                  <th>Severity</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident._id} className="hover:bg-background">
                    <td>
                      <div>
                        <div className="text-sm font-medium text-primary">
                          {incident.incidentNumber}
                        </div>
                        <div className="text-sm text-muted truncate max-w-xs">
                          {incident.title}
                        </div>
                        <div className="text-xs text-muted">
                          by {incident.reportedBy.userEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(incident.status)}
                        <span className={getStatusColor(incident.status)}>
                          {incident.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`text-sm font-medium ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm text-muted">
                        {incident.assignedTo?.userEmail || 'Unassigned'}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-muted">
                        {new Date(incident.reportedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setShowIncidentForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteIncident(incident._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Incident Form Modal */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <h2 className="text-xl font-bold text-primary mb-4">
              {selectedIncident ? 'Edit Incident' : 'Report Incident'}
            </h2>
            <p className="text-muted mb-4">Incident form component will be implemented here.</p>
            <div className="flex gap-2">
              <Button onClick={() => {
                fetchIncidents();
                setShowIncidentForm(false);
                setSelectedIncident(null);
              }}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => {
                setShowIncidentForm(false);
                setSelectedIncident(null);
              }}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
````

## File: guardian/src/app/dashboard/policies/page.tsx
````typescript
"use client";
import { useEffect, useState, useRef, Fragment, useCallback } from "react";
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { useUser } from '@clerk/nextjs';
import { Dialog } from '@headlessui/react';

const states = ["Draft", "Review", "Approved", "Rejected"] as const;
type PolicyState = typeof states[number];

interface Comment {
  _id: string;
  text: string;
  userId: string;
  createdAt: string;
}

interface Policy {
  _id: string;
  name: string;
  description?: string;
  owner?: { userId: string; userEmail: string };
  effectiveDate?: string;
  reviewDate?: string;
  version?: string;
  category?: string;
  attachments?: { url: string, name: string }[];
  state: PolicyState;
  comments: Comment[];
}

function getUserRole(user: unknown) {
  if (!user || typeof user !== 'object' || user === null) return 'Viewer';
  const userObj = user as { id: string; primaryEmailAddress?: { emailAddress?: string } };
  if (typeof window !== 'undefined') {
    let adminId = localStorage.getItem('adminUserId');
    if (!adminId) {
      localStorage.setItem('adminUserId', userObj.id);
      adminId = userObj.id;
    }
    if (userObj.id === adminId) return 'Admin';
  }
  const email = userObj.primaryEmailAddress?.emailAddress || '';
  if (email.includes('manager')) return 'Manager';
  return 'Viewer';
}

// Helper to normalize attachments
function normalizeAttachments(attachments: unknown): { url: string, name: string }[] {
  if (!attachments) return [];
  if (Array.isArray(attachments) && attachments.length > 0) {
    if (typeof attachments[0] === 'object' && attachments[0] !== null && 'url' in attachments[0] && 'name' in attachments[0]) {
      return attachments as { url: string, name: string }[];
    } else if (attachments.every((a: unknown) => typeof a === 'string')) {
      return (attachments as string[]).map(s => ({ url: s, name: s }));
    }
  }
  return [];
}

const commonCategories = [
  'IT', 'HR', 'Security', 'Finance', 'Operations', 'Legal', 'Compliance', 'Risk', 'Procurement', 'Marketing', 'Other'
];

export default function PoliciesPage() {
  const { user } = useUser();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newEffectiveDate, setNewEffectiveDate] = useState("");
  const [newReviewDate, setNewReviewDate] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [notif, setNotif] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const role = getUserRole(user);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [commentModal, setCommentModal] = useState<{ open: boolean, policyId: string | null }>({ open: false, policyId: null });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPolicy, setModalPolicy] = useState<Policy | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, policy: Policy | null }>({ open: false, policy: null });
  const [editModal, setEditModal] = useState<{ open: boolean, policy: Policy | null }>({ open: false, policy: null });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    effectiveDate: '',
    reviewDate: '',
    version: '',
    category: '',
  });
  const [addAttachments, setAddAttachments] = useState<{ url: string, name: string }[]>([]);
  const [editAttachments, setEditAttachments] = useState<{ url: string, name: string }[]>([]);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentModal, setAttachmentModal] = useState<{ open: boolean, policy: Policy | null }>({ open: false, policy: null });
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);

  const fetchPolicies = useCallback(async () => {
    const res = await fetch('/api/policies', {
      headers: user ? {
        'x-user-id': user.id,
        'x-user-email': user.primaryEmailAddress?.emailAddress || '',
      } : {},
    });
    const data = await res.json();
    setPolicies(data.policies || []);
  }, [user]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const addPolicy = async () => {
    if (!newName.trim() || !newDescription.trim() || !newEffectiveDate || !newReviewDate || !newVersion.trim() || !newCategory.trim()) {
      setNotif('Please fill in all required fields.');
      return;
    }
    await fetch('/api/policies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? {
          'x-user-id': user.id,
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        } : {}),
      },
      body: JSON.stringify({
        name: newName,
        description: newDescription,
        owner: user ? { userId: user.id, userEmail: user.primaryEmailAddress?.emailAddress || '' } : undefined,
        effectiveDate: newEffectiveDate,
        reviewDate: newReviewDate,
        version: newVersion,
        category: newCategory,
        attachments: normalizeAttachments(addAttachments),
      }),
    });
    setNewName("");
    setNewDescription("");
    setNewEffectiveDate("");
    setNewReviewDate("");
    setNewVersion("");
    setNewCategory("");
    setAddAttachments([]);
    setModalOpen(false);
    setNotif(`Policy '${newName}' created as Draft.`);
    setTimeout(() => setNotif(null), 3000);
    fetchPolicies();
  };

  const fetchPolicyById = async (id: string) => {
    const res = await fetch(`/api/policies`);
    const data = await res.json();
    const found = data.policies.find((p: Policy) => p._id === id);
    setModalPolicy(found);
  };

  const addComment = async () => {
    if (!newComment.trim() || !modalPolicy) return;
    await fetch('/api/policies', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? {
          'x-user-id': user.id,
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        } : {}),
      },
      body: JSON.stringify({
        id: modalPolicy._id,
        comment: {
          text: newComment,
          userId: user?.id || '',
          userEmail: user?.primaryEmailAddress?.emailAddress || '',
        },
      }),
    });
    setNewComment("");
    setEditingCommentId(null);
    setEditingText("");
    await fetchPolicyById(modalPolicy._id);
    fetchPolicies();
  };

  const saveEditComment = async (commentId: string) => {
    if (!editingText.trim() || !modalPolicy) return;
    await fetch('/api/policies', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? {
          'x-user-id': user.id,
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        } : {}),
      },
      body: JSON.stringify({
        id: modalPolicy._id,
        commentId,
        commentText: editingText,
      }),
    });
    setEditingCommentId(null);
    setEditingText("");
    await fetchPolicyById(modalPolicy._id);
    fetchPolicies();
  };

  const deleteComment = async (commentId: string) => {
    if (!modalPolicy) return;
    await fetch('/api/policies', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? {
          'x-user-id': user.id,
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        } : {}),
      },
      body: JSON.stringify({
        id: modalPolicy._id,
        commentId,
        delete: true,
      }),
    });
    setEditingCommentId(null);
    setEditingText("");
    await fetchPolicyById(modalPolicy._id);
    fetchPolicies();
  };

  // Multi-string filter
  const filteredPolicies = policies.filter(policy => {
    const terms = search.toLowerCase().split(' ').filter(Boolean);
    return terms.every(term =>
      policy.name?.toLowerCase().includes(term) ||
      policy.description?.toLowerCase().includes(term) ||
      policy.owner?.userEmail?.toLowerCase().includes(term) ||
      (policy.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString().toLowerCase() : '').includes(term) ||
      (policy.reviewDate ? new Date(policy.reviewDate).toLocaleDateString().toLowerCase() : '').includes(term) ||
      policy.version?.toLowerCase().includes(term) ||
      policy.category?.toLowerCase().includes(term) ||
      policy.state?.toLowerCase().includes(term)
    ) && (filter === "all" || policy.state === filter);
  });

  const paginatedPolicies = filteredPolicies.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredPolicies.length / rowsPerPage);

  // Open edit modal and prefill form
  const openEditModal = (policy: Policy) => {
    setEditForm({
      name: policy.name || '',
      description: policy.description || '',
      effectiveDate: policy.effectiveDate ? policy.effectiveDate.slice(0, 10) : '',
      reviewDate: policy.reviewDate ? policy.reviewDate.slice(0, 10) : '',
      version: policy.version || '',
      category: policy.category || '',
    });
    setEditModal({ open: true, policy });
    setEditAttachments([]);
  };

  // Handle edit form change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  // Handle edit category change
  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm(f => ({ ...f, category: e.target.value }));
  };

  // Save edit
  const saveEditPolicy = async () => {
    if (!editModal.policy) return;
    await fetch('/api/policies', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? {
          'x-user-id': user.id,
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        } : {}),
      },
      body: JSON.stringify({
        id: editModal.policy._id,
        name: editForm.name,
        description: editForm.description,
        effectiveDate: editForm.effectiveDate,
        reviewDate: editForm.reviewDate,
        version: editForm.version,
        category: editForm.category,
        attachments: normalizeAttachments(editAttachments),
      }),
    });
    setEditModal({ open: false, policy: null });
    fetchPolicies();
  };

  // Handler to open the modal
  const openAttachmentModal = (policy: Policy) => {
    setAttachmentModal({ open: true, policy: { ...policy, attachments: normalizeAttachments(policy.attachments) } });
  };

  // Handler to add files
  const handleAttachmentModalAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachmentModal.policy && files.length > 0) {
      // Upload files to backend
      const formData = new FormData();
      files.forEach(file => formData.append('file', file));
      const uploadRes = await fetch('/api/policies/attachments', {
        method: 'POST',
        body: formData,
      });
      if (uploadRes.ok) {
        const { files: uploadedFiles } = await uploadRes.json();
        const currentAttachments = normalizeAttachments(attachmentModal.policy.attachments);
        const newAttachments = [
          ...currentAttachments,
          ...uploadedFiles
        ];
        // Optimistically update modal state
        setAttachmentModal(m => m.policy ? { ...m, policy: { ...m.policy, attachments: newAttachments } } : m);
        updatePolicyAttachments(attachmentModal.policy._id, newAttachments);
      }
    }
    e.target.value = '';
  };

  // Handler to delete an attachment
  const handleAttachmentModalDelete = (idx: number) => {
    if (!attachmentModal.policy) return;
    const currentAttachments = normalizeAttachments(attachmentModal.policy.attachments);
    const newAttachments = [...currentAttachments];
    newAttachments.splice(idx, 1);
    // Optimistically update modal state
    setAttachmentModal(m => m.policy ? { ...m, policy: { ...m.policy, attachments: newAttachments } } : m);
    updatePolicyAttachments(attachmentModal.policy._id, newAttachments);
  };

  // Backend update helper
  const updatePolicyAttachments = async (policyId: string, attachments: { url: string, name: string }[]) => {
    // Optimistically update modal state
    setAttachmentModal(m => (
      m.policy && m.policy._id === policyId
        ? { ...m, policy: { ...m.policy, attachments } }
        : m
    ));
    await fetch('/api/policies', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? {
          'x-user-id': user.id,
          'x-user-email': user.primaryEmailAddress?.emailAddress || '',
        } : {}),
      },
      body: JSON.stringify({ id: policyId, attachments }),
    });
    fetchPolicies();
    // Fetch the updated policy and update the modal state for consistency
    const res = await fetch(`/api/policies`);
    const data = await res.json();
    const found = data.policies.find((p: Policy) => p._id === policyId);
    setAttachmentModal(m => ({ ...m, policy: found ? { ...found, attachments: normalizeAttachments(found.attachments) } : m.policy }));
    // Also update editModal if open for this policy
    setEditModal(m => (m.open && m.policy && m.policy._id === policyId)
      ? { ...m, policy: { ...m.policy, attachments: normalizeAttachments(found.attachments) } }
      : m
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Policies</h1>
      {notif && (
        <div className="mb-4 p-2 bg-primary text-white rounded">{notif}</div>
      )}
      {role === 'Admin' || role === 'Manager' ? (
        <div className="mb-6">
          <Button type="button" onClick={() => setModalOpen(true)}>
            Add Policy
          </Button>
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)} as={Fragment}>
            <div className="modal">
              <div className="modal-content">
                <Dialog.Title className="text-xl font-bold mb-4">Add New Policy</Dialog.Title>
                <form onSubmit={e => { e.preventDefault(); addPolicy(); }} className="flex flex-col gap-3">
                  <Input name="name" placeholder="Policy Name" required />
                  <Input name="description" placeholder="Description" required />
                  <Input name="effectiveDate" type="date" placeholder="Effective Date" required />
                  <Input name="reviewDate" type="date" placeholder="Review Date" required />
                  <Input name="version" placeholder="Version" required />
                  <select name="category" className="select" required>
                    <option value="">Select category...</option>
                    {commonCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-4 items-end">
                    <div className="flex flex-col flex-1">
                      <label className="block mb-1 font-medium">Attachments</label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => addFileInputRef.current?.click()} title="Upload attachments" className="p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v9A2.25 2.25 0 0113.5 20.25h-3A2.25 2.25 0 018.25 18V9m7.5 0H8.25" /></svg>
                        </button>
                        <input
                          type="file"
                          multiple
                          ref={addFileInputRef}
                          style={{ display: 'none' }}
                          onChange={e => {
                            const files = Array.from(e.target.files || []);
                            setAddAttachments(prev => [
                              ...prev,
                              ...files.map(f => ({ url: URL.createObjectURL(f), name: f.name }))
                            ]);
                            e.target.value = '';
                          }}
                        />
                        {addAttachments.length > 0 && (
                          <ul className="flex flex-wrap gap-2 ml-2">
                            {addAttachments.map((file, i) => (
                              <li key={i} className="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs flex items-center gap-1">
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{file.name}</a>
                                <button type="button" onClick={() => setAddAttachments(files => files.filter((_, idx) => idx !== i))}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" variant="primary">Save</Button>
                    <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog>
        </div>
      ) : null}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Search policies..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="select" value={filter} onChange={e => setFilter(e.target.value as PolicyState)}>
            <option value="">All States</option>
            {states.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Effective</th>
              <th>Review</th>
              <th>Version</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPolicies.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-2 text-center text-muted">No policies found.</td>
              </tr>
            ) : (
              paginatedPolicies.map((policy) => (
                <tr key={policy._id}>
                  <td>{policy.name}</td>
                  <td>{policy.description}</td>
                  <td>{policy.owner?.userEmail}</td>
                  <td>{policy.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString() : <span className="text-muted">N/A</span>}</td>
                  <td>{policy.reviewDate ? new Date(policy.reviewDate).toLocaleDateString() : <span className="text-muted">N/A</span>}</td>
                  <td>{policy.version}</td>
                  <td>{policy.category}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => openEditModal(policy)}>Edit</Button>
                      <Button variant="danger" onClick={() => setDeleteModal({ open: true, policy })}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
      {/* Pagination and row count dropdown */}
      <div className="flex items-center gap-4 mt-4">
        <label>Rows per page:</label>
        <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded p-1 bg-white text-black dark:bg-gray-800 dark:text-white">
          {[5, 10, 20, 50].map(n => <option key={n} value={n} className="bg-white text-black dark:bg-gray-800 dark:text-white">{n}</option>)}
        </select>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>&lt;</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>&gt;</button>
      </div>
      {/* Comment Modal */}
      <Dialog open={commentModal.open} onClose={() => { setCommentModal({ open: false, policyId: null }); setModalPolicy(null); }} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-lg shadow-xl relative">
            <Dialog.Title className="text-xl font-bold mb-4">Comments</Dialog.Title>
            {modalPolicy && (
              <div>
                <ul className="mb-4">
                  {modalPolicy.comments?.map((c, i) => (
                    <li key={c._id || i} className="flex items-center gap-2 mb-2">
                      {editingCommentId === c._id ? (
                        <>
                          <input
                            type="text"
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveEditComment(c._id);
                              if (e.key === 'Escape') { setEditingCommentId(null); setEditingText(""); }
                            }}
                            className="border rounded p-1 text-xs flex-1"
                            autoFocus
                          />
                          <button className="text-blue-600 text-xs font-semibold" onClick={() => saveEditComment(c._id)} title="Save">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          </button>
                          <button className="text-muted text-xs ml-1" onClick={() => { setEditingCommentId(null); setEditingText(""); }} title="Cancel">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{c.text}</span>
                          {(user?.id === c.userId || role === 'Admin') && (
                            <>
                              <button className="text-blue-600 text-xs font-semibold" onClick={() => { setEditingCommentId(c._id); setEditingText(c.text); }} title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.182 1.045a.75.75 0 01-.91-.91L3.455 16.18 16.862 4.487z" /></svg>
                              </button>
                              <button className="text-red-600 text-xs font-semibold" onClick={() => deleteComment(c._id)} title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <form onSubmit={e => { e.preventDefault(); addComment(); }}>
                  <input name="comment" type="text" placeholder="Add comment" className="border rounded p-1 mr-2 w-2/3" value={newComment} onChange={e => setNewComment(e.target.value)} />
                  <Button type="submit" variant="primary">Add</Button>
                </form>
              </div>
            )}
            <button className="absolute top-2 right-2 text-muted hover:text-primary text-2xl" onClick={() => { setCommentModal({ open: false, policyId: null }); setModalPolicy(null); }} aria-label="Close">&times;</button>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Delete Policy Modal */}
      <Dialog open={deleteModal.open} onClose={() => setDeleteModal({ open: false, policy: null })} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-md shadow-xl relative">
            <Dialog.Title className="text-xl font-bold mb-4">Delete Policy</Dialog.Title>
            <div className="mb-4">Are you sure you want to delete the policy <span className="font-semibold">{deleteModal.policy?.name}</span>? This action cannot be undone.</div>
            <div className="flex gap-4 justify-end">
              <Button variant="secondary" onClick={() => setDeleteModal({ open: false, policy: null })}>Cancel</Button>
              <Button variant="primary" onClick={async () => {
                if (deleteModal.policy) {
                  await fetch('/api/policies', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(user ? {
                        'x-user-id': user.id,
                        'x-user-email': user.primaryEmailAddress?.emailAddress || '',
                      } : {}),
                    },
                    body: JSON.stringify({ id: deleteModal.policy._id }),
                  });
                  setDeleteModal({ open: false, policy: null });
                  fetchPolicies();
                }
              }}>Delete</Button>
            </div>
            <button className="absolute top-2 right-2 text-muted hover:text-primary text-2xl" onClick={() => setDeleteModal({ open: false, policy: null })} aria-label="Close">&times;</button>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Edit Policy Modal */}
      <Dialog open={editModal.open} onClose={() => setEditModal({ open: false, policy: null })} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-2xl shadow-xl relative">
            <Dialog.Title className="text-xl font-bold mb-4">Edit Policy</Dialog.Title>
            <form onSubmit={e => { e.preventDefault(); saveEditPolicy(); }} className="flex flex-col gap-3">
              <Input name="name" placeholder="Policy Name" required value={editForm.name} onChange={handleEditChange} />
              <Input name="description" placeholder="Description" required value={editForm.description} onChange={handleEditChange} />
              <Input name="effectiveDate" type="date" placeholder="Effective Date" required value={editForm.effectiveDate} onChange={handleEditChange} />
              <Input name="reviewDate" type="date" placeholder="Review Date" required value={editForm.reviewDate} onChange={handleEditChange} />
              <Input name="version" placeholder="Version" required value={editForm.version} onChange={handleEditChange} />
              <select name="category" className="select" required value={editForm.category} onChange={handleEditCategoryChange}>
                <option value="">Select category...</option>
                {commonCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="flex gap-4 items-end">
                <div className="flex flex-col flex-1">
                  <label className="block mb-1 font-medium">Attachments</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (editModal.policy) openAttachmentModal(editModal.policy);
                      }}
                      title="Manage attachments"
                      className="p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v9A2.25 2.25 0 0113.5 20.25h-3A2.25 2.25 0 018.25 18V9m7.5 0H8.25" /></svg>
                    </button>
                    {Array.isArray(editModal.policy?.attachments) && editModal.policy.attachments.length === 1 && (
                      <a
                        href={editModal.policy.attachments[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-xs text-blue-400 underline truncate max-w-[120px]"
                      >
                        {editModal.policy.attachments[0].name}
                      </a>
                    )}
                    {Array.isArray(editModal.policy?.attachments) && editModal.policy.attachments.length > 1 && (
                      <span className="ml-1 text-xs text-blue-400">({editModal.policy.attachments.length})</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" variant="primary">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setEditModal({ open: false, policy: null })}>Cancel</Button>
              </div>
            </form>
            <button className="absolute top-2 right-2 text-muted hover:text-primary text-2xl" onClick={() => setEditModal({ open: false, policy: null })} aria-label="Close">&times;</button>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Attachments Modal */}
      <Dialog open={attachmentModal.open} onClose={() => setAttachmentModal({ open: false, policy: null })} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-lg shadow-xl relative">
            <Dialog.Title className="text-xl font-bold mb-4">Attachments</Dialog.Title>
            {attachmentModal.policy && (
              <div>
                <ul className="mb-4">
                  {(attachmentModal.policy.attachments || []).length === 0 && (
                    <li className="text-muted">No attachments.</li>
                  )}
                  {(attachmentModal.policy.attachments || []).map((file, i) => (
                    <li key={i} className="flex items-center gap-2 mb-2">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{file.name}</a>
                      <button className="text-red-600 text-xs font-semibold" onClick={() => handleAttachmentModalDelete(i)} title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mt-2">
                  <button type="button" onClick={() => attachmentFileInputRef.current?.click()} title="Upload attachments" className="p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v9A2.25 2.25 0 0113.5 20.25h-3A2.25 2.25 0 018.25 18V9m7.5 0H8.25" /></svg>
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={attachmentFileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleAttachmentModalAdd}
                  />
                </div>
              </div>
            )}
            <button className="absolute top-2 right-2 text-muted hover:text-primary text-2xl" onClick={() => setAttachmentModal({ open: false, policy: null })} aria-label="Close">&times;</button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
````

## File: guardian/src/app/dashboard/risks/page.tsx
````typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Edit, Trash2, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import RiskForm from '@/components/risks/RiskForm';

interface Risk {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  owner: {
    userId: string;
    userEmail: string;
  };
  currentAssessment?: {
    likelihood: string;
    impact: string;
    score: number;
  };
  identifiedDate: string;
  nextReviewDate?: string;
  tags: string[];
}

// Temporary placeholder components
const RiskMatrix = ({ risks }: { risks: Risk[] }) => (
  <Card className="text-center py-8">
    <p className="text-muted">Risk Matrix visualization will be implemented here.</p>
    <p className="text-sm text-muted mt-2">Showing {risks.length} risks</p>
  </Card>
);

const RiskFilters = ({ filters, onFiltersChange }: { filters: Record<string, string>; onFiltersChange: (filters: Record<string, string>) => void }) => (
  <div className="flex gap-2">
    <Input
      type="text"
      placeholder="Search risks..."
      value={filters.search}
      onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
    />
    <select
      value={filters.status}
      onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
      className="select"
    >
      <option value="">All Status</option>
      <option value="Identified">Identified</option>
      <option value="Assessed">Assessed</option>
      <option value="Mitigated">Mitigated</option>
      <option value="Closed">Closed</option>
    </select>
    <select
      value={filters.category}
      onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
      className="select"
    >
      <option value="">All Categories</option>
      <option value="Strategic">Strategic</option>
      <option value="Operational">Operational</option>
      <option value="Financial">Financial</option>
      <option value="Compliance">Compliance</option>
      <option value="Technology">Technology</option>
    </select>
  </div>
);

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [view, setView] = useState<'list' | 'matrix'>('list');

  const fetchRisks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/risks?${params}`);
      const data = await response.json();
      setRisks(data.risks || []);
    } catch (error) {
      console.error('Error fetching risks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const handleDeleteRisk = async (riskId: string) => {
    if (!confirm('Are you sure you want to delete this risk?')) return;

    try {
      const response = await fetch(`/api/risks/${riskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchRisks();
      }
    } catch (error) {
      console.error('Error deleting risk:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Identified':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'Assessed':
        return <Clock className="w-4 h-4 text-primary" />;
      case 'Mitigated':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Closed':
        return <CheckCircle className="w-4 h-4 text-muted" />;
      case 'Escalated':
        return <XCircle className="w-4 h-4 text-danger" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'badge bg-danger';
      case 'High':
        return 'badge bg-warning text-danger';
      case 'Medium':
        return 'badge bg-accent text-primary';
      case 'Low':
        return 'badge bg-success';
      default:
        return 'badge bg-muted';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 4) return 'text-success';
    if (score <= 8) return 'text-warning';
    if (score <= 15) return 'text-accent';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Risk Management</h1>
          <p className="text-muted">Manage and monitor organizational risks</p>
        </div>
        <Button
          onClick={() => setShowRiskForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Risk
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Risks</p>
              <p className="text-2xl font-bold text-primary">{risks.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">High Priority</p>
              <p className="text-2xl font-bold text-danger">
                {risks.filter(r => r.priority === 'High' || r.priority === 'Critical').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-danger" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Open Risks</p>
              <p className="text-2xl font-bold text-warning">
                {risks.filter(r => r.status !== 'Closed').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-warning" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Mitigated</p>
              <p className="text-2xl font-bold text-success">
                {risks.filter(r => r.status === 'Mitigated').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <RiskFilters filters={filters} onFiltersChange={setFilters} />
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'secondary'}
              onClick={() => setView('list')}
            >
              List View
            </Button>
            <Button
              variant={view === 'matrix' ? 'primary' : 'secondary'}
              onClick={() => setView('matrix')}
            >
              Risk Matrix
            </Button>
          </div>
        </div>
      </Card>

      {/* Risk Matrix View */}
      {view === 'matrix' && (
        <RiskMatrix risks={risks} />
      )}

      {/* Risk List View */}
      {view === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Score</th>
                  <th>Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((risk) => (
                  <tr key={risk._id} className="hover:bg-background">
                    <td>
                      <div>
                        <div className="text-sm font-medium text-primary">
                          {risk.title}
                        </div>
                        <div className="text-sm text-muted truncate max-w-xs">
                          {risk.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-muted">{risk.category}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(risk.status)}
                        <span className="text-sm text-muted">{risk.status}</span>
                      </div>
                    </td>
                    <td>
                      <span className={getPriorityColor(risk.priority)}>
                        {risk.priority}
                      </span>
                    </td>
                    <td>
                      {risk.currentAssessment?.score ? (
                        <span className={`text-sm font-medium ${getRiskScoreColor(risk.currentAssessment.score)}`}>
                          {risk.currentAssessment.score}
                        </span>
                      ) : (
                        <span className="text-sm text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="text-sm text-muted">
                        {risk.owner.userEmail}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedRisk(risk)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedRisk(risk);
                            setShowRiskForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteRisk(risk._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Risk Form Modal */}
      {showRiskForm && (
        <RiskForm
          risk={selectedRisk}
          onClose={() => {
            setShowRiskForm(false);
            setSelectedRisk(null);
          }}
          onSave={() => {
            fetchRisks();
            setShowRiskForm(false);
            setSelectedRisk(null);
          }}
        />
      )}
    </div>
  );
}
````

## File: guardian/src/app/dashboard/layout.tsx
````typescript
import Sidebar from '../../components/Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
````

## File: guardian/src/app/dashboard/page.tsx
````typescript
"use client";

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import Breadcrumb from '../../components/Breadcrumb';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const initialWidgets = [
  {
    id: 'compliance',
    content: (
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted mb-2">Compliance Score</span>
        <span className="text-4xl font-bold text-primary mb-1">92%</span>
        <span className="text-sm text-muted">Your organization is 92% compliant with current policies.</span>
      </div>
    ),
  },
  {
    id: 'risks',
    content: (
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted mb-2">Open Risks</span>
        <span className="text-4xl font-bold text-danger mb-1">7</span>
        <span className="text-sm text-muted">There are 7 open risks requiring attention.</span>
      </div>
    ),
  },
  {
    id: 'policies',
    content: (
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted mb-2">Active Policies</span>
        <span className="text-4xl font-bold text-success mb-1">15</span>
        <span className="text-sm text-muted">15 policies are currently active and enforced.</span>
      </div>
    ),
  },
  {
    id: 'compliance-trend',
    content: (
      <div className="flex flex-col items-start w-full">
        <span className="text-sm text-muted mb-2">Compliance Trend</span>
        <Line
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Compliance %',
                data: [85, 88, 90, 91, 92, 92],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.2)',
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: { min: 80, max: 100, ticks: { stepSize: 5 } },
            },
          }}
        />
      </div>
    ),
  },
];

export default function DashboardPage() {
  const [widgets, setWidgets] = useState(initialWidgets);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(widgets);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setWidgets(reordered);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
      <h1 className="text-3xl font-bold text-primary mb-4">Dashboard</h1>
      <p className="text-lg text-muted mb-8">Welcome to your Guardian dashboard. Select a section from the sidebar to get started.</p>
      {/* Dashboard Grid System with Drag-and-Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard-widgets" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {widgets.map((widget, idx) => (
                <Draggable key={widget.id} draggableId={widget.id} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>{widget.content}</Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* Button Showcase */}
      <div className="flex gap-4 mb-8">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="muted">Muted</Button>
      </div>
      {/* Sample Table */}
      <Card>
        <h2 className="text-xl font-bold text-primary mb-4">Team Members</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>Admin</td>
              <td><span className="badge bg-success">Active</span></td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>Manager</td>
              <td><span className="badge bg-danger">Inactive</span></td>
            </tr>
            <tr>
              <td>Carol</td>
              <td>Analyst</td>
              <td><span className="badge bg-success">Active</span></td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
````

## File: guardian/src/app/sign-in/[[...rest]]/page.tsx
````typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
````

## File: guardian/src/app/globals.css
````css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

body {
  @apply bg-white text-gray-900 font-sans transition-colors duration-200;
}
.dark body {
  @apply bg-gray-950 text-gray-100;
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
````

## File: guardian/src/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
````

## File: guardian/src/app/page.tsx
````typescript
"use client";
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-950 text-white">
      <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-lg p-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Guardian GRC</h1>
        <p className="mb-6 text-lg text-gray-300 text-center">Welcome to your Governance, Risk, and Compliance platform.<br/>Sign in to access your dashboard.</p>
        <SignIn afterSignInUrl="/dashboard" appearance={{ elements: { card: 'bg-white dark:bg-gray-900' } }} />
      </div>
      <footer className="mt-10 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Guardian GRC. All rights reserved.
      </footer>
    </div>
  );
}
````

## File: guardian/src/components/compliance/AuditSessionManager.tsx
````typescript
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
// We will create this modal in the next step
import { AuditSessionModal } from './AuditSessionModal'; 

interface AuditSession {
  _id: string;
  title: string;
  status: string;
  auditStartDate: string;
  auditEndDate?: string;
  auditor: { userEmail: string; };
}

interface AuditSessionManagerProps {
  complianceId: string;
  sessions: AuditSession[];
  onSessionsUpdate: () => void;
}

export function AuditSessionManager({ complianceId, sessions, onSessionsUpdate }: AuditSessionManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AuditSession | null>(null);

  const handleEdit = (session: AuditSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this audit session?')) return;

    try {
      await fetch(`/api/compliance/${complianceId}/audits/${sessionId}`, { method: 'DELETE' });
      onSessionsUpdate();
    } catch (error) {
      console.error('Failed to delete audit session:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Audit Sessions</h3>
        <Button onClick={() => {
          setSelectedSession(null);
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Audit Session
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.auditor.userEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(session.auditStartDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(session)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(session._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AuditSessionModal
          complianceId={complianceId}
          session={selectedSession}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            onSessionsUpdate();
          }}
        />
      )}
    </div>
  );
}
````

## File: guardian/src/components/compliance/AuditSessionModal.tsx
````typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'; // Assuming a Select component exists

interface AuditSession {
  _id: string;
  title: string;
  status: string;
  auditStartDate: string;
  auditEndDate?: string;
  scopeDescription?: string;
}

interface AuditSessionModalProps {
  complianceId: string;
  session: AuditSession | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuditSessionModal({ complianceId, session, onClose, onSuccess }: AuditSessionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    status: 'Planned',
    auditStartDate: '',
    auditEndDate: '',
    scopeDescription: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        status: session.status,
        auditStartDate: session.auditStartDate ? new Date(session.auditStartDate).toISOString().split('T')[0] : '',
        auditEndDate: session.auditEndDate ? new Date(session.auditEndDate).toISOString().split('T')[0] : '',
        scopeDescription: session.scopeDescription || '',
      });
    } else {
      // Reset for new session form
      setFormData({
        title: '',
        status: 'Planned',
        auditStartDate: new Date().toISOString().split('T')[0],
        auditEndDate: '',
        scopeDescription: '',
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const url = session
      ? `/api/compliance/${complianceId}/audits/${session._id}`
      : `/api/compliance/${complianceId}/audits`;
    const method = session ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save audit session');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving audit session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-4">
          {session ? 'Edit Audit Session' : 'New Audit Session'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'Planned' | 'In Progress' | 'Completed' | 'Cancelled' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="auditStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <Input
                id="auditStartDate"
                name="auditStartDate"
                type="date"
                value={formData.auditStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="auditEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <Input
                id="auditEndDate"
                name="auditEndDate"
                type="date"
                value={formData.auditEndDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="scopeDescription" className="block text-sm font-medium text-gray-700">Scope Description</label>
            <textarea
              id="scopeDescription"
              name="scopeDescription"
              rows={3}
              value={formData.scopeDescription}
              onChange={handleChange}
              className="textarea w-full"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
````

## File: guardian/src/components/controls/ControlModal.tsx
````typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface Control {
  _id?: string;
  controlId: string;
  name: string;
  description: string;
  family: string;
  sourceFramework: string;
  status: 'Active' | 'Draft' | 'Retired';
  effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Assessed';
}

interface ControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  control: Control | null; // Pass control data for editing
}

export const ControlModal: React.FC<ControlModalProps> = ({ isOpen, onClose, onSuccess, control }) => {
  const [formData, setFormData] = useState<Partial<Control>>({
    controlId: '',
    name: '',
    description: '',
    family: '',
    sourceFramework: '',
    status: 'Draft',
    effectiveness: 'Not Assessed',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (control) {
      setFormData(control);
    } else {
      // Reset form for new entry
      setFormData({
        controlId: '', name: '', description: '', family: '', sourceFramework: '', status: 'Draft', effectiveness: 'Not Assessed'
      });
    }
  }, [control, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = control ? `/api/controls/${control._id}` : '/api/controls';
    const method = control ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save control');
      }
      
      onSuccess(); // Refresh the parent list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Submission failed:', error);
      // Display error to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{control ? 'Edit Control' : 'Add New Control'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="controlId">Control ID</Label>
              <Input id="controlId" name="controlId" value={formData.controlId} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="family">Family</Label>
              <Input id="family" name="family" value={formData.family} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="sourceFramework">Source Framework</Label>
              <Input id="sourceFramework" name="sourceFramework" value={formData.sourceFramework} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'Draft' | 'Active' | 'Retired' }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Control'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
````

## File: guardian/src/components/controls/ControlTable.tsx
````typescript
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; // Assuming a UI library button component exists

// Define the Control type again for props
interface Control {
  _id: string;
  controlId: string;
  name: string;
  family: string;
  status: string;
  effectiveness: string;
}

interface ControlTableProps {
  controls: Control[];
  onEdit: (control: Control) => void;
  onRefresh: () => void; // To allow for actions like delete to trigger a refresh
}

export const ControlTable: React.FC<ControlTableProps> = ({ controls, onEdit, onRefresh }) => {
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this control?')) {
      return;
    }
    try {
      const res = await fetch(`/api/controls/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onRefresh(); // Refresh the list after deleting
    } catch (error) {
      console.error('Failed to delete control:', error);
      // Add user-facing error message
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectiveness</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {controls.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No controls found.</td>
            </tr>
          ) : (
            controls.map((control) => (
              <tr key={control._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{control.controlId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{control.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.family}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.effectiveness}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" onClick={() => onEdit(control)}>Edit</Button>
                  <Button variant="destructive" className="ml-2" onClick={() => handleDelete(control._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
````

## File: guardian/src/components/risks/RiskForm.tsx
````typescript
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface MitigationAction {
  description: string;
  assignedTo: string;
  dueDate?: string;
  cost?: number;
}

interface Stakeholder {
  userEmail: string;
  role: string;
}

interface Risk {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: string;
  priority: string;
  businessUnit?: string;
  project?: string;
  location?: string;
  tags: string[];
  confidentiality: string;
  targetResolutionDate?: string;
  nextReviewDate?: string;
  financialImpact?: {
    min?: number;
    max?: number;
    currency: string;
  };
  currentAssessment?: {
    likelihood: string;
    impact: string;
    rationale?: string;
    evidence?: string;
  };
  mitigationActions: MitigationAction[];
  stakeholders: Stakeholder[];
  regulatoryImpact: string[];
}

interface RiskFormProps {
  risk?: Risk;
  onClose: () => void;
  onSave: () => void;
}

const RISK_CATEGORIES = [
  'Strategic', 'Operational', 'Financial', 'Compliance', 'Technology', 
  'Cybersecurity', 'Legal', 'Reputational', 'Environmental', 'Health & Safety',
  'Supply Chain', 'Market', 'Credit', 'Liquidity', 'Other'
];

const LIKELIHOOD_LEVELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
const IMPACT_LEVELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
const STATUS_OPTIONS = ['Identified', 'Assessed', 'Mitigated', 'Monitored', 'Closed', 'Escalated'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export default function RiskForm({ risk, onClose, onSave }: RiskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    status: 'Identified',
    priority: 'Medium',
    businessUnit: '',
    project: '',
    location: '',
    tags: [] as string[],
    confidentiality: 'Internal',
    targetResolutionDate: '',
    nextReviewDate: '',
    financialImpact: {
      min: '',
      max: '',
      currency: 'USD'
    },
    currentAssessment: {
      likelihood: 'Medium',
      impact: 'Medium',
      rationale: '',
      evidence: ''
    },
    mitigationActions: [] as MitigationAction[],
    stakeholders: [] as Stakeholder[],
    regulatoryImpact: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [newMitigationAction, setNewMitigationAction] = useState({
    description: '',
    assignedTo: '',
    dueDate: '',
    cost: ''
  });

  useEffect(() => {
    if (risk) {
      setFormData({
        title: risk.title || '',
        description: risk.description || '',
        category: risk.category || '',
        subcategory: risk.subcategory || '',
        status: risk.status || 'Identified',
        priority: risk.priority || 'Medium',
        businessUnit: risk.businessUnit || '',
        project: risk.project || '',
        location: risk.location || '',
        tags: risk.tags || [],
        confidentiality: risk.confidentiality || 'Internal',
        targetResolutionDate: risk.targetResolutionDate ? new Date(risk.targetResolutionDate).toISOString().split('T')[0] : '',
        nextReviewDate: risk.nextReviewDate ? new Date(risk.nextReviewDate).toISOString().split('T')[0] : '',
        financialImpact: {
          min: risk.financialImpact?.min?.toString() || '',
          max: risk.financialImpact?.max?.toString() || '',
          currency: risk.financialImpact?.currency || 'USD'
        },
        currentAssessment: {
          likelihood: risk.currentAssessment?.likelihood || 'Medium',
          impact: risk.currentAssessment?.impact || 'Medium',
          rationale: risk.currentAssessment?.rationale || '',
          evidence: risk.currentAssessment?.evidence || ''
        },
        mitigationActions: risk.mitigationActions || [],
        stakeholders: risk.stakeholders || [],
        regulatoryImpact: risk.regulatoryImpact || []
      });
    }
  }, [risk]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        financialImpact: {
          ...formData.financialImpact,
          min: formData.financialImpact.min ? parseFloat(formData.financialImpact.min) : undefined,
          max: formData.financialImpact.max ? parseFloat(formData.financialImpact.max) : undefined
        }
      };

      const url = risk ? `/api/risks/${risk._id}` : '/api/risks';
      const method = risk ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving risk:', error);
      alert('Error saving risk');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addMitigationAction = () => {
    if (newMitigationAction.description.trim()) {
      setFormData({
        ...formData,
        mitigationActions: [...formData.mitigationActions, {
          ...newMitigationAction,
          cost: newMitigationAction.cost ? parseFloat(newMitigationAction.cost) : undefined,
          dueDate: newMitigationAction.dueDate || undefined
        }]
      });
      setNewMitigationAction({
        description: '',
        assignedTo: '',
        dueDate: '',
        cost: ''
      });
    }
  };

  const removeMitigationAction = (index: number) => {
    setFormData({
      ...formData,
      mitigationActions: formData.mitigationActions.filter((_, i) => i !== index)
    });
  };

  const calculateRiskScore = () => {
    const likelihoodScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const impactScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    
    const likelihoodScore = likelihoodScores[formData.currentAssessment.likelihood as keyof typeof likelihoodScores] || 3;
    const impactScore = impactScores[formData.currentAssessment.impact as keyof typeof impactScores] || 3;
    
    return likelihoodScore * impactScore;
  };

  const getRiskLevel = (score: number) => {
    if (score <= 4) return 'Low';
    if (score <= 8) return 'Medium';
    if (score <= 15) return 'High';
    return 'Critical';
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 4) return 'text-success';
    if (score <= 8) return 'text-warning';
    if (score <= 15) return 'text-accent';
    return 'text-danger';
  };

  const riskScore = calculateRiskScore();
  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">{risk ? 'Edit Risk' : 'Add New Risk'}</h2>
            <Button variant="secondary" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Risk Title *
              </label>
              <Input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select"
              >
                <option value="">Select Category</option>
                {RISK_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="select"
              >
                {PRIORITY_OPTIONS.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
            />
          </div>

          {/* Risk Assessment */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Risk Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Likelihood
                </label>
                <select
                  value={formData.currentAssessment.likelihood}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentAssessment: { ...formData.currentAssessment, likelihood: e.target.value }
                  })}
                  className="select"
                >
                  {LIKELIHOOD_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Impact
                </label>
                <select
                  value={formData.currentAssessment.impact}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentAssessment: { ...formData.currentAssessment, impact: e.target.value }
                  })}
                  className="select"
                >
                  {IMPACT_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Risk Score Display */}
            <div className="mt-4 p-4 bg-background rounded-md border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">Risk Score:</span>
                <span className={`text-lg font-bold ${getRiskScoreColor(riskScore)}`}>
                  {riskScore} ({riskLevel})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Assessment Rationale
                </label>
                <textarea
                  rows={3}
                  value={formData.currentAssessment.rationale}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentAssessment: { ...formData.currentAssessment, rationale: e.target.value }
                  })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Supporting Evidence
                </label>
                <textarea
                  rows={3}
                  value={formData.currentAssessment.evidence}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentAssessment: { ...formData.currentAssessment, evidence: e.target.value }
                  })}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Mitigation Actions */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Mitigation Actions</h3>
            
            {formData.mitigationActions.map((action, index) => (
              <Card key={index} className="p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-primary">Action {index + 1}</h4>
                  <Button
                    variant="danger"
                    onClick={() => removeMitigationAction(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted mb-2">{action.description}</p>
                <div className="text-xs text-muted">
                  Assigned to: {action.assignedTo} | Due: {action.dueDate} | Cost: ${action.cost}
                </div>
              </Card>
            ))}

            <Card className="p-4">
              <h4 className="font-medium text-primary mb-3">Add New Action</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Description</label>
                  <Input
                    type="text"
                    value={newMitigationAction.description}
                    onChange={(e) => setNewMitigationAction({ ...newMitigationAction, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Assigned To</label>
                  <Input
                    type="email"
                    value={newMitigationAction.assignedTo}
                    onChange={(e) => setNewMitigationAction({ ...newMitigationAction, assignedTo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Due Date</label>
                  <Input
                    type="date"
                    value={newMitigationAction.dueDate}
                    onChange={(e) => setNewMitigationAction({ ...newMitigationAction, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Estimated Cost</label>
                  <Input
                    type="number"
                    value={newMitigationAction.cost}
                    onChange={(e) => setNewMitigationAction({ ...newMitigationAction, cost: e.target.value })}
                  />
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={addMitigationAction}
                className="mt-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Business Unit
                </label>
                <Input
                  type="text"
                  value={formData.businessUnit}
                  onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Project
                </label>
                <Input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Target Resolution Date
                </label>
                <Input
                  type="date"
                  value={formData.targetResolutionDate}
                  onChange={(e) => setFormData({ ...formData, targetResolutionDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Next Review Date
                </label>
                <Input
                  type="date"
                  value={formData.nextReviewDate}
                  onChange={(e) => setFormData({ ...formData, nextReviewDate: e.target.value })}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-primary mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-accent text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary hover:text-danger"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-border pt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {risk ? 'Update Risk' : 'Create Risk'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
````

## File: guardian/src/components/ui/Badge.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        primary: "bg-blue-100 text-blue-800 border-blue-200",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        muted: "bg-gray-100 text-gray-800 border-gray-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
````

## File: guardian/src/components/ui/Button.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
````

## File: guardian/src/components/ui/Card.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        elevated: "bg-white border-gray-200 shadow-md",
        interactive: "bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200",
        dark: "bg-gray-900 border-gray-700 text-white",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
````

## File: guardian/src/components/ui/index.ts
````typescript
// UI Components Export - Enterprise GRC Application
// Centralized export for all design system components

export { Button, buttonVariants } from './Button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card'
export { Input, inputVariants } from './Input'
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './Table'
export { Badge, badgeVariants } from './Badge'

// Re-export utility functions
export { cn } from '@/lib/utils'
export { tokens, componentTokens, getColor, getSpacing, getTypography, getBorderRadius, getShadow } from '@/lib/design-tokens'
````

## File: guardian/src/components/ui/Input.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      },
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
````

## File: guardian/src/components/ui/Select.tsx
````typescript
'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]')}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Label>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
````

## File: guardian/src/components/ui/Table.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      variant: {
        default: "border-collapse",
        striped: "border-collapse",
        bordered: "border-collapse border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(tableVariants({ variant, className }))}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
````

## File: guardian/src/components/ui/tabs.tsx
````typescript
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
````

## File: guardian/src/components/Breadcrumb.tsx
````typescript
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-muted mb-4" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={item.label} className="flex items-center">
          {item.href && idx !== items.length - 1 ? (
            <Link href={item.href} className="hover:underline hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-primary">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <ChevronRightIcon className="mx-2 w-4 h-4 text-muted" />
          )}
        </span>
      ))}
    </nav>
  );
}
````

## File: guardian/src/components/Sidebar.tsx
````typescript
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HomeIcon, FileTextIcon, CheckCircledIcon, BadgeIcon, GearIcon, ActivityLogIcon } from '@radix-ui/react-icons';
import ThemeToggle from './ThemeToggle';
import { SignOutButton, useUser } from '@clerk/nextjs';
import UserProfileSidebar from './UserProfileSidebar';
import { Button } from '@/components/ui/Button';

function getUserRole(userId: string | undefined) {
  if (typeof window !== 'undefined' && userId) {
    const adminId = localStorage.getItem('adminUserId');
    if (adminId && userId === adminId) return 'Admin';
  }
  return 'Viewer';
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Policies', href: '/dashboard/policies', icon: <FileTextIcon /> },
  { name: 'Risks', href: '/dashboard/risks', icon: <CheckCircledIcon /> },
  { name: 'Compliance', href: '/dashboard/compliance', icon: <BadgeIcon /> },
];

export default function Sidebar() {
  const { user } = useUser();
  const [role, setRole] = useState('Viewer');
  useEffect(() => {
    if (user) setRole(getUserRole(user.id));
  }, [user]);

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col p-4 space-y-2 min-h-screen">
      <UserProfileSidebar />
      <div className="text-2xl font-bold text-primary mb-8">Guardian</div>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-foreground"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
        {role === 'Admin' && (
          <Link
            href="/dashboard/activity"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-foreground"
          >
            <span className="text-xl"><ActivityLogIcon /></span>
            <span>Activity Log</span>
          </Link>
        )}
      </nav>
      {role === 'Admin' && (
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-sidebar-accent transition-colors mb-2 text-sidebar-foreground hover:text-sidebar-foreground"
        >
          <span className="text-xl"><GearIcon /></span>
          <span>Settings</span>
        </Link>
      )}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <ThemeToggle />
        <SignOutButton>
          <Button variant="danger" className="w-full mt-2">
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </aside>
  );
}
````

## File: guardian/src/components/ThemeToggle.tsx
````typescript
"use client";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Button } from '@/components/ui/Button';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check local storage or system preference
    const dark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  return (
    <Button
      variant="secondary"
      onClick={toggleTheme}
      className="p-2 rounded-full"
      aria-label="Toggle dark mode"
    >
      {isDark ? <SunIcon className="w-5 h-5 text-warning" /> : <MoonIcon className="w-5 h-5 text-muted" />}
    </Button>
  );
}
````

## File: guardian/src/components/UserProfileSidebar.tsx
````typescript
"use client";
import { UserButton, useUser } from '@clerk/nextjs';

function getUserRole(user: unknown) {
  if (!user || typeof user !== 'object' || user === null) return 'Viewer';
  const userObj = user as { id: string };
  // Check localStorage for adminUserId
  if (typeof window !== 'undefined') {
    let adminId = localStorage.getItem('adminUserId');
    if (!adminId) {
      // First user to sign in becomes admin
      localStorage.setItem('adminUserId', userObj.id);
      adminId = userObj.id;
    }
    if (userObj.id === adminId) return 'Admin';
  }
  return 'Viewer';
}

export default function UserProfileSidebar() {
  const { user } = useUser();
  if (!user) return null;
  const role = getUserRole(user);
  return (
    <div className="flex flex-col items-center mb-8">
      <UserButton afterSignOutUrl="/" />
      <div className="mt-2 text-sm text-center">
        <div className="font-semibold text-sidebar-foreground">{user.fullName || user.username || user.primaryEmailAddress?.emailAddress}</div>
        <div className="text-xs text-muted">{user.primaryEmailAddress?.emailAddress}</div>
        <div className="mt-1 text-xs text-primary font-bold">Role: {role}</div>
      </div>
    </div>
  );
}
````

## File: guardian/src/lib/dbConnect.ts
````typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
````

## File: guardian/src/lib/design-tokens.ts
````typescript
// Design System Tokens - Enterprise GRC Application
// This file defines all design constants for consistent styling across the application

export const tokens = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // Secondary Colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Main secondary
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Semantic Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main danger
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Neutral Colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      dark: '#0f172a',
      'dark-secondary': '#1e293b',
    },
    // Text Colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      muted: '#94a3b8',
      inverse: '#ffffff',
    },
    // Border Colors
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8',
    }
  },

  // Spacing Scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Typography Scale
  typography: {
    // Font Sizes
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    // Font Weights
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    // Line Heights
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-Index Scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// Component-specific tokens
export const componentTokens = {
  // Button variants
  button: {
    sizes: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    },
    variants: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
      danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
      ghost: 'bg-transparent hover:bg-neutral-100 focus:ring-neutral-500',
    }
  },

  // Card variants
  card: {
    base: 'bg-white rounded-lg border border-border-light shadow-sm',
    elevated: 'bg-white rounded-lg border border-border-light shadow-md',
    interactive: 'bg-white rounded-lg border border-border-light shadow-sm hover:shadow-md transition-shadow',
  },

  // Input variants
  input: {
    base: 'w-full rounded-md border border-border-medium px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
    error: 'w-full rounded-md border border-danger-500 px-3 py-2 text-sm focus:border-danger-500 focus:ring-1 focus:ring-danger-500',
  },

  // Table styles
  table: {
    header: 'bg-neutral-50 text-neutral-700 font-medium text-sm',
    row: 'border-b border-border-light hover:bg-neutral-50',
    cell: 'px-4 py-3 text-sm',
  },

  // Badge variants
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    variants: {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-danger-100 text-danger-800',
    }
  }
};

// Utility functions for design tokens
export const getColor = (colorPath: string) => {
  const path = colorPath.split('.');
  let value: unknown = tokens.colors;
  for (const key of path) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return value;
};

export const getSpacing = (size: keyof typeof tokens.spacing) => tokens.spacing[size];
export const getTypography = (type: keyof typeof tokens.typography.sizes) => tokens.typography.sizes[type];
export const getBorderRadius = (size: keyof typeof tokens.borderRadius) => tokens.borderRadius[size];
export const getShadow = (size: keyof typeof tokens.shadows) => tokens.shadows[size];
````

## File: guardian/src/lib/mongoose.ts
````typescript
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/guardian';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { connect as dbConnect };
````

## File: guardian/src/lib/permission-utils.ts
````typescript
import mongoose, { LeanDocument } from 'mongoose';
import Folder, { IFolder } from '@/models/Folder';
import RoleAssignment, { IRoleAssignment, RoleType } from '@/models/RoleAssignment';

// Define role hierarchy (e.g., Owner can do everything Editor can do)
const roleHierarchy: Record<RoleType, number> = {
  'Owner': 3,
  'Editor': 2,
  'Contributor': 1, // Can create items, maybe edit own items
  'Viewer': 0,
};

export async function checkPermission(
  userId: string, // Clerk User ID
  resourceId: string | mongoose.Types.ObjectId, // ID of the GRC object (Risk, Control, etc.)
  resourceModel: mongoose.Model<any & { folder?: mongoose.Types.ObjectId | IFolder; owner?: string }>, // Added owner to type hint
  requiredRole: RoleType
): Promise<boolean> {
  if (!userId) {
    console.warn('checkPermission called without userId');
    return false; // No user, no permission
  }

  const resource: LeanDocument<any & { folder?: mongoose.Types.ObjectId; owner?: string }> | null = 
    await resourceModel.findById(resourceId).select('folder owner').lean();
  if (!resource) {
    console.warn(`Resource ${resourceId.toString()} not found in model ${resourceModel.modelName}.`);
    return false; // Resource not found
  }

  // Case 1: Direct ownership of the resource itself (if applicable and grants max permissions)
  // This depends on whether GRC items have an 'owner' field and if that implies full control, bypassing folder permissions.
  // For now, assuming permissions are primarily folder-based as per the plan.
  // if (resource.owner && resource.owner === userId && roleHierarchy['Owner'] >= roleHierarchy[requiredRole]) {
  //   return true;
  // }

  if (!resource.folder) {
    console.warn(`Resource ${resourceId.toString()} in ${resourceModel.modelName} has no folder assigned.`);
    return false; // Resource not in a folder (should not happen if 'folder' is required)
  }

  const folderId = resource.folder as mongoose.Types.ObjectId; // Assert as ObjectId after check
  let currentFolderToCheck: LeanDocument<IFolder> | null = await Folder.findById(folderId).lean();

  while (currentFolderToCheck) {
    // Check direct role assignment on this folder
    const assignment: LeanDocument<IRoleAssignment> | null = await RoleAssignment.findOne({ 
      userId, 
      folderId: currentFolderToCheck._id as mongoose.Types.ObjectId, 
      role: { $exists: true } 
    }).lean();

    if (assignment && roleHierarchy[assignment.role as RoleType] >= roleHierarchy[requiredRole]) {
      return true; // Permission granted through this folder
    }

    // Check if the user is the direct owner of this folder in the hierarchy
    if (currentFolderToCheck.owner && currentFolderToCheck.owner === userId && roleHierarchy['Owner'] >= roleHierarchy[requiredRole]) {
      return true; // Permission granted through folder ownership
    }

    // Move to parent folder for next iteration if it exists
    if (currentFolderToCheck.parent) {
      currentFolderToCheck = currentFolderToCheck.parent ? await Folder.findById(currentFolderToCheck.parent).lean() : null;
    } else {
      currentFolderToCheck = null; // Reached root, no more parents
    }
  }

  return false; // No sufficient role found in the folder hierarchy
}

export async function getAccessibleFolderIds(userId: string, minRole: RoleType): Promise<string[]> {
  if (!userId) return [];
  
  const accessibleFolderIds = new Set<string>();

  // 1. Folders where user has a direct role assignment meeting minRole
  const directAssignments: LeanDocument<IRoleAssignment>[] = await RoleAssignment.find({ userId }).lean();
  for (const assignment of directAssignments) {
    if (roleHierarchy[assignment.role as RoleType] >= roleHierarchy[minRole]) {
      accessibleFolderIds.add(assignment.folderId.toString());
      // Add all subfolders as well, since permission cascades down
      const subFolders: LeanDocument<Pick<IFolder, '_id'>>[] = await Folder.find({ ancestors: assignment.folderId }).select('_id').lean();
      subFolders.forEach(sf => accessibleFolderIds.add((sf._id as mongoose.Types.ObjectId).toString()));
    }
  }

  // 2. Folders directly owned by the user (implies 'Owner' role)
  if (roleHierarchy['Owner'] >= roleHierarchy[minRole]) {
    const ownedFolders: LeanDocument<Pick<IFolder, '_id' | 'ancestors' | 'owner'>>[] = await Folder.find({ owner: userId }).select('_id ancestors owner').lean();
    for (const folder of ownedFolders) {
      accessibleFolderIds.add((folder._id as mongoose.Types.ObjectId).toString());
      // Add all subfolders of owned folders
      const subFoldersOfOwned: LeanDocument<Pick<IFolder, '_id'>>[] = await Folder.find({ ancestors: folder._id as mongoose.Types.ObjectId }).select('_id').lean();
      subFoldersOfOwned.forEach(sf => accessibleFolderIds.add((sf._id as mongoose.Types.ObjectId).toString()));
    }
  }
  
  // Deduplicate and return
  return Array.from(accessibleFolderIds);
}
````

## File: guardian/src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: guardian/src/models/AuditLog.ts
````typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userEmail: string;
  action: string;
  details?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String }, // Optional based on interface
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
````

## File: guardian/src/models/ChangeLog.ts
````typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IChangeLog extends Document {
  changedBy: {
    userId: string;
    userEmail: string;
  };
  fieldName: string;
  oldValue: string;
  newValue: string;
  changeDate: Date;
}

export const ChangeLogSchema: Schema = new Schema({
  changedBy: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  fieldName: {
    type: String,
    required: true,
  },
  oldValue: {
    type: String,
  },
  newValue: {
    type: String,
  },
  changeDate: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });
````

## File: guardian/src/models/Compliance.ts
````typescript
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { IFolder } from './Folder'; // Import IFolder for type referencing
// import { IControl } from './Control'; // If linkedControls are to be populated
// import { IRisk } from './Risk'; // If linkedRisks are to be populated
// import { IPolicy } from './Policy'; // If linkedPolicies are to be populated

// Minimal interface for a populated folder with only _id and name
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// Interface for Requirement (subdocument)
export interface IRequirement extends Document {
  title: string;
  description?: string;
  reference?: string;
  category?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Under Review' | 'Met' | 'Partially Met' | 'Not Applicable'; // Added Met, Partially Met, Not Applicable from virtual
  evidence?: Array<{
    description?: string;
    url?: string;
    uploadedBy?: { userId?: string; userEmail?: string };
    uploadedAt: Date;
    reviewedBy?: { userId?: string; userEmail?: string };
    reviewedAt?: Date;
    status: 'Pending' | 'Approved' | 'Rejected';
  }>;
  controls?: string[]; // Consider Types.ObjectId[] | IControl[] if populating
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  notes?: string;
}

// Interface for Gap (subdocument)
export interface IGap extends Document {
  title: string;
  description: string;
  requirementId?: Types.ObjectId | IRequirement;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  impact?: string;
  remediationPlan?: string;
  assignedTo?: { userId?: string; userEmail?: string };
  dueDate?: Date;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  progress: number;
  cost?: number;
  completedDate?: Date;
  notes?: string;
}

// Interface for AuditFinding (subdocument)
export interface IAuditFinding extends Document {
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category?: string;
  requirementId?: Types.ObjectId | IRequirement;
  evidence?: Array<{
    description?: string;
    url?: string;
    uploadedBy?: { userId?: string; userEmail?: string };
    uploadedAt: Date;
  }>;
  remediationPlan?: string;
  assignedTo?: { userId?: string; userEmail?: string };
  dueDate?: Date;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  progress: number;
  completedDate?: Date;
  notes?: string;
}

// Interface for AuditSession (subdocument for Compliance)
export interface IAuditSession extends Document {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  auditor?: { userId?: string; userEmail?: string; name?: string };
  status?: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  scope?: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

// Schema for AuditSession (subdocument for Compliance)
const AuditSessionSchema = new Schema<IAuditSession>({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  auditor: {
    userId: { type: String },
    userEmail: { type: String },
    name: { type: String },
  },
  status: { 
    type: String, 
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Planned' 
  },
  scope: { type: String },
}, { timestamps: true });

// Main Compliance Interface
export interface ICompliance extends Document {
  name: string;
  description?: string;
  type: 'Regulation' | 'Standard' | 'Framework' | 'Policy';
  category: 'Data Protection' | 'Cybersecurity' | 'Financial' | 'Environmental' | 
            'Health & Safety' | 'Quality Management' | 'Information Security' |
            'Business Continuity' | 'Risk Management' | 'Other';
  jurisdiction?: string;
  authority?: string;
  version?: string;
  effectiveDate?: Date;
  reviewFrequency: 'Monthly' | 'Quarterly' | 'Annually' | 'Biennially';
  status: 'Active' | 'Inactive' | 'Superseded' | 'Under Review';
  complianceLevel: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Under Assessment';
  owner: { userId: string; userEmail: string };
  stakeholders?: Array<{ userId?: string; userEmail?: string; role?: string }>;
  requirements?: IRequirement[];
  gaps?: IGap[];
  auditFindings?: IAuditFinding[];
  auditSessions?: IAuditSession[]; // Added audit sessions
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  documents?: Array<{
    title?: string;
    url?: string;
    type?: 'Policy' | 'Procedure' | 'Evidence' | 'Report' | 'Other';
    uploadedBy?: { userId?: string; userEmail?: string };
    uploadedAt: Date;
  }>;
  complianceCost?: { annual?: number; oneTime?: number; currency: string };
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore?: number;
  linkedRisks?: Array<Types.ObjectId /*| IRisk*/>; // Assuming IRisk exists
  linkedControls?: Array<Types.ObjectId /*| IControl*/>; // Assuming IControl exists
  linkedPolicies?: Array<Types.ObjectId /*| IPolicy*/>; // Assuming IPolicy exists
  comments?: Array<{ text: string; userId?: string; userEmail?: string; date: Date }>;
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date: Date;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }>;
  tags?: string[];
  confidentiality: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  folder: Types.ObjectId | IPopulatedFolderMin; // Updated to use IPopulatedFolderMin // Link to the folder

  // Virtuals
  complianceScore?: number;
  openGapsCount?: number;
  criticalFindingsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Compliance document with folder populated minimally
export interface ICompliancePopulatedFolder extends Omit<ICompliance, 'folder'> {
  folder: IPopulatedFolderMin;
}

const RequirementSchema = new Schema<IRequirement>({
  title: { type: String, required: true },
  description: { type: String },
  reference: { type: String }, // Regulatory reference number
  category: { type: String },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Compliant', 'Non-Compliant', 'Partially Compliant', 'Under Review'], 
    default: 'Under Review' 
  },
  evidence: [{ 
    description: String,
    url: String,
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now },
    reviewedBy: { userId: String, userEmail: String },
    reviewedAt: Date,
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    }
  }],
  controls: [{ type: String }], // IDs of related controls
  lastReviewDate: { type: Date },
  nextReviewDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const GapSchema = new Schema<IGap>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  impact: { type: String },
  remediationPlan: { type: String },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  cost: { type: Number },
  completedDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const AuditFindingSchema = new Schema<IAuditFinding>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  category: { type: String },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' },
  evidence: [{ 
    description: String,
    url: String,
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  remediationPlan: { type: String },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  completedDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const ComplianceSchema = new Schema<ICompliance>({
  // Basic Information
  name: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['Regulation', 'Standard', 'Framework', 'Policy'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: [
      'Data Protection', 'Cybersecurity', 'Financial', 'Environmental', 
      'Health & Safety', 'Quality Management', 'Information Security',
      'Business Continuity', 'Risk Management', 'Other'
    ],
    required: true 
  },
  
  // Regulatory Information
  jurisdiction: { type: String }, // e.g., 'EU', 'US', 'Global'
  authority: { type: String }, // e.g., 'GDPR', 'ISO', 'NIST'
  version: { type: String },
  effectiveDate: { type: Date },
  reviewFrequency: { 
    type: String, 
    enum: ['Monthly', 'Quarterly', 'Annually', 'Biennially'], 
    default: 'Annually' 
  },
  
  // Status & Lifecycle
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Superseded', 'Under Review'], 
    default: 'Active' 
  },
  complianceLevel: { 
    type: String, 
    enum: ['Compliant', 'Non-Compliant', 'Partially Compliant', 'Under Assessment'], 
    default: 'Under Assessment' 
  },
  
  // Ownership & Responsibility
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  stakeholders: [{
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String }, // e.g., 'Reviewer', 'Approver', 'Implementer'
  }],
  
  // Requirements & Controls
  requirements: [RequirementSchema],
  gaps: [GapSchema],
  auditFindings: [AuditFindingSchema],
  auditSessions: [AuditSessionSchema], // Added audit sessions schema
  
  // Timeline
  lastAssessmentDate: { type: Date },
  nextAssessmentDate: { type: Date },
  lastAuditDate: { type: Date },
  nextAuditDate: { type: Date },
  
  // Documentation
  documents: [{ 
    title: String,
    url: String,
    type: { 
      type: String, 
      enum: ['Policy', 'Procedure', 'Evidence', 'Report', 'Other'] 
    },
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Financial Impact
  complianceCost: {
    annual: { type: Number },
    oneTime: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  
  // Risk Assessment
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  riskScore: { type: Number, min: 1, max: 25 },
  
  // Integration
  linkedRisks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Risk' }],
  linkedControls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Control' }], // IDs of related controls
  linkedPolicies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  
  // Comments & Collaboration
  comments: [{
    text: { type: String, required: true },
    userId: { type: String },
    userEmail: { type: String },
    date: { type: Date, default: Date.now },
  }],
  
  // Audit Trail
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
  }],
  
  // Tags & Classification
  tags: [{ type: String }],
  confidentiality: { 
    type: String, 
    enum: ['Public', 'Internal', 'Confidential', 'Restricted'], 
    default: 'Internal' 
  },
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for compliance score calculation
ComplianceSchema.virtual('complianceScore').get(function(this: ICompliance) {
  if (!this.requirements || this.requirements.length === 0) return 0;
  
  const totalRequirements = this.requirements.length;
  const compliantRequirements = this.requirements.filter(req => req.status === 'Compliant').length;
  const partiallyCompliantRequirements = this.requirements.filter(req => req.status === 'Partially Compliant').length;
  
  return Math.round(((compliantRequirements + (partiallyCompliantRequirements * 0.5)) / totalRequirements) * 100);
});

// Virtual for gap count
ComplianceSchema.virtual('openGapsCount').get(function(this: ICompliance) {
  if (!this.gaps) return 0;
  return this.gaps.filter(gap => gap.status !== 'Closed').length;
});

// Virtual for critical findings count
ComplianceSchema.virtual('criticalFindingsCount').get(function(this: ICompliance) {
  if (!this.auditFindings) return 0;
  return this.auditFindings.filter(finding => 
    finding.severity === 'Critical' && finding.status !== 'Closed'
  ).length;
});

// Virtual for calculating compliance score
ComplianceSchema.virtual('complianceScore').get(function(this: ICompliance) {
  if (!this.requirements || this.requirements.length === 0) {
    return 100;
  }
  const applicableRequirements = this.requirements.filter(
    (req: { status: string; }) => req.status !== 'Not Applicable'
  );
  if (applicableRequirements.length === 0) {
    return 100;
  }
  const metCount = applicableRequirements.filter(
    (req: { status: string; }) => req.status === 'Met'
  ).length;
  const partiallyMetCount = applicableRequirements.filter(
    (req: { status: string; }) => req.status === 'Partially Met'
  ).length;
  
  const score = ((metCount + (partiallyMetCount * 0.5)) / applicableRequirements.length) * 100;
  return Math.round(score);
});

// Pre-save middleware to update compliance level based on score
ComplianceSchema.pre<ICompliance>('save', function(this: ICompliance, next) { // Added this type for clarity
  const score = this.complianceScore ?? 0; // Handle potentially undefined score
  if (score >= 90) {
    this.complianceLevel = 'Compliant';
  } else if (score >= 70) {
    this.complianceLevel = 'Partially Compliant';
  } else {
    this.complianceLevel = 'Non-Compliant';
  }
  next();
});

// Indexes for performance
ComplianceSchema.index({ type: 1, status: 1 });
ComplianceSchema.index({ category: 1, complianceLevel: 1 });
ComplianceSchema.index({ owner: 1 });
ComplianceSchema.index({ nextAssessmentDate: 1 });
ComplianceSchema.index({ nextAuditDate: 1 });
ComplianceSchema.index({ tags: 1 });
ComplianceSchema.index({ jurisdiction: 1, authority: 1 });
ComplianceSchema.index({ folder: 1 }); // Index for folder field

export const Compliance = (mongoose.models.Compliance as Model<ICompliance>) || mongoose.model<ICompliance>('Compliance', ComplianceSchema);
export default Compliance;
````

## File: guardian/src/models/Control.ts
````typescript
import mongoose, { Document, Schema, Types } from 'mongoose';
import { IFolder } from './Folder'; // Import IFolder for type referencing
import { ChangeLogSchema, IChangeLog } from './ChangeLog';

// Minimal interface for a populated folder reference
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// New Base Interface
export interface IControlBase {
  controlId: string;
  name: string;
  description: string;
  family: string;
  sourceFramework: string;
  version: string;
  owner: {
    userId: string;
    userEmail: string;
  };
  status: 'Active' | 'Draft' | 'Retired';
  effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Assessed';
  changeHistory: IChangeLog[];
  // folder will be defined in extending interfaces
  createdAt?: Date; // from timestamps
  updatedAt?: Date; // from timestamps
  _id?: Types.ObjectId; // Mongoose _id
}

// IControl for Mongoose Document
export interface IControl extends IControlBase, Document {
  folder: Types.ObjectId; // In the document, folder is an ObjectId
  // Fields from IControlBase are inherited
}

const ControlSchema: Schema = new Schema({
  controlId: {
    type: String,
    required: [true, 'A unique Control ID is required.'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Control name is required.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Control description is required.'],
  },
  family: {
    type: String,
    required: [true, 'Control family or category is required.'],
  },
  sourceFramework: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: '1.0',
  },
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Retired'],
    default: 'Draft',
  },
  effectiveness: {
    type: String,
    enum: ['Effective', 'Partially Effective', 'Ineffective', 'Not Assessed'],
    default: 'Not Assessed',
  },
  changeHistory: [ChangeLogSchema],
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// IControlPopulatedFolder for lean queries with populated folder
export interface IControlPopulatedFolder extends IControlBase {
  folder: IPopulatedFolderMin; // Populated folder
  _id: Types.ObjectId; // Ensure _id is present and correctly typed for lean objects
}

export default mongoose.models.Control || mongoose.model<IControl>('Control', ControlSchema);
````

## File: guardian/src/models/Folder.ts
````typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  parent?: mongoose.Types.ObjectId | IFolder; // Self-referencing for hierarchy
  owner: string; // Clerk User ID
  ancestors?: (mongoose.Types.ObjectId | IFolder)[]; // For easier querying of hierarchy
  // Potentially: organizationId if multi-tenant
}

const FolderSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  owner: { type: String, required: true }, // Clerk User ID
  ancestors: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
}, { timestamps: true });

// Middleware to manage ancestors path for easier hierarchical queries
FolderSchema.pre('save', async function(this: IFolder, next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentFolder = await mongoose.model('Folder').findById(this.parent);
      if (parentFolder) {
        this.ancestors = [...(parentFolder.ancestors || []), parentFolder._id];
      } else {
        this.ancestors = []; // Parent not found, reset ancestors
      }
    } else {
      this.ancestors = []; // No parent, root folder
    }
  }
  next();
});

FolderSchema.index({ parent: 1, name: 1 }); // For efficient lookup within a folder

export default mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);
````

## File: guardian/src/models/Incident.ts
````typescript
import mongoose, { Document, Schema, Types, Model } from '../lib/mongoose';

const IncidentUpdateSchema = new mongoose.Schema({
  update: { type: String, required: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['Status Change', 'Investigation', 'Resolution', 'Escalation', 'Communication'], 
    default: 'Status Change' 
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Interface for a minimally populated folder (e.g., when using .populate('folder', '_id name'))
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

const IncidentActionSchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: { type: String },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  completedDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  notes: { type: String },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const IncidentEvidenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['Document', 'Screenshot', 'Log File', 'Video', 'Audio', 'Physical', 'Other'], 
    required: true 
  },
  url: { type: String },
  uploadedBy: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  uploadedAt: { type: Date, default: Date.now },
  chainOfCustody: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String }, // e.g., 'Received', 'Transferred', 'Analyzed'
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  tags: [{ type: String }]
}, { timestamps: true });

// Main Incident Interface (extending Document)
export interface IIncident extends Document {
  incidentNumber?: string;
  title: string;
  description: string;
  summary?: string;
  category: 'Security Incident' | 'Data Breach' | 'System Outage' | 'Compliance Violation' | 'Physical Security' | 'Human Error' | 'Malware' | 'Phishing' | 'Unauthorized Access' | 'Data Loss' | 'Network Attack' | 'Application Failure' | 'Infrastructure Issue' | 'Third Party Incident' | 'Natural Disaster' | 'Other';
  subcategory?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'Open' | 'Investigating' | 'Contained' | 'Resolved' | 'Closed' | 'Escalated';
  stage?: 'Detection' | 'Analysis' | 'Containment' | 'Eradication' | 'Recovery' | 'Lessons Learned';
  detectedAt: Date;
  reportedAt: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  slaTarget?: Date;
  slaBreached?: boolean;
  impact?: {
    business?: string;
    financial?: string;
    operational?: string;
    reputational?: string;
    regulatory?: string;
  };
  affectedSystems?: string[];
  affectedUsers?: number;
  affectedData?: string;
  estimatedCost?: number;
  actualCost?: number;
  reporter: {
    userId: string;
    userEmail: string;
  };
  owner: {
    userId: string;
    userEmail: string;
  };
  assignee?: {
    userId?: string;
    userEmail?: string;
  };
  stakeholders?: Array<{
    userId?: string;
    userEmail?: string;
    role?: string;
  }>;
  updates?: Types.DocumentArray<any>; // Consider creating a specific type for IncidentUpdateSchema content
  actions?: Types.DocumentArray<any>; // Consider creating a specific type for IncidentActionSchema content
  evidence?: Types.DocumentArray<any>; // Consider creating a specific type for IncidentEvidenceSchema content
  rootCause?: string;
  contributingFactors?: string[];
  lessonsLearned?: string;
  internalCommunications?: Array<{
    audience?: string;
    message?: string;
    sentAt?: Date;
    sentBy?: { userId?: string; userEmail?: string };
  }>;
  externalCommunications?: Array<{
    audience?: string;
    message?: string;
    sentAt?: Date;
    sentBy?: { userId?: string; userEmail?: string };
    approvedBy?: { userId?: string; userEmail?: string };
  }>;
  regulatoryReporting?: {
    required?: boolean;
    reported?: boolean;
    reportDate?: Date;
    authority?: string;
    reportNumber?: string;
    deadline?: Date;
  };
  legalInvolvement?: {
    required?: boolean;
    lawFirm?: string;
    caseNumber?: string;
    estimatedCost?: number;
  };
  linkedIncidents?: Types.ObjectId[];
  linkedRisks?: Types.ObjectId[];
  linkedCompliance?: Types.ObjectId[];
  linkedPolicies?: Types.ObjectId[];
  tags?: string[];
  confidentiality?: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date?: Date;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }>;
  folder: Types.ObjectId | IPopulatedFolderMin; // Added folder field
  createdAt?: Date;
  updatedAt?: Date;

  // Virtuals (if you want them in the interface)
  duration?: number;
  slaStatus?: string;
  openActionsCount?: number;
  criticalActionsCount?: number;
}

// Interface for IIncident when its 'folder' field is populated
export interface IIncidentPopulatedFolder extends Omit<IIncident, 'folder' | 'updates' | 'actions' | 'evidence' | 'changeHistory' | 'duration' | 'slaStatus' | 'openActionsCount' | 'criticalActionsCount' > { // Omit virtuals and complex sub-docs if they cause issues with Omit
  folder: IPopulatedFolderMin;
  // Re-declare complex sub-documents if Omit has issues, or ensure they are compatible
  // For simplicity, if Omit causes issues with DocumentArray or deeply nested types, 
  // you might need to list all fields manually except 'folder' and then add 'folder: IPopulatedFolderMin'.
  // Alternatively, ensure IIncident fields are plain objects/arrays for easier Omit compatibility.
  // For now, let's assume Omit works or we simplify the IIncident for this purpose.
  // A more robust Omit might look like: Omit<IIncident, 'folder' | keyof Document> and then add folder + Document methods if needed.
  // Or, more simply for lean objects:
  // incidentNumber?: string;
  // title: string; ... etc. all fields from IIncident except 'folder'
  // folder: IPopulatedFolderMin;
}


const IncidentSchema = new mongoose.Schema({
  // Basic Information
  incidentNumber: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String },
  
  // Classification
  category: { 
    type: String, 
    enum: [
      'Security Incident', 'Data Breach', 'System Outage', 'Compliance Violation',
      'Physical Security', 'Human Error', 'Malware', 'Phishing', 'Unauthorized Access',
      'Data Loss', 'Network Attack', 'Application Failure', 'Infrastructure Issue',
      'Third Party Incident', 'Natural Disaster', 'Other'
    ],
    required: true 
  },
  subcategory: { type: String },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  
  // Status & Lifecycle
  status: { 
    type: String, 
    enum: ['Open', 'Investigating', 'Contained', 'Resolved', 'Closed', 'Escalated'], 
    default: 'Open' 
  },
  stage: { 
    type: String, 
    enum: ['Detection', 'Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons Learned'], 
    default: 'Detection' 
  },
  
  // Timeline
  detectedAt: { type: Date, required: true },
  reportedAt: { type: Date, required: true },
  containedAt: { type: Date },
  resolvedAt: { type: Date },
  closedAt: { type: Date },
  slaTarget: { type: Date },
  slaBreached: { type: Boolean, default: false },
  
  // Impact Assessment
  impact: {
    business: { type: String },
    financial: { type: String },
    operational: { type: String },
    reputational: { type: String },
    regulatory: { type: String }
  },
  affectedSystems: [{ type: String }],
  affectedUsers: { type: Number },
  affectedData: { type: String },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  
  // Ownership & Responsibility
  reporter: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  assignee: {
    userId: { type: String },
    userEmail: { type: String },
  },
  stakeholders: [{
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String }, // e.g., 'Investigator', 'Communications', 'Legal', 'Management'
  }],
  
  // Investigation & Response
  updates: [IncidentUpdateSchema],
  actions: [IncidentActionSchema],
  evidence: [IncidentEvidenceSchema],
  
  // Root Cause Analysis
  rootCause: { type: String },
  contributingFactors: [{ type: String }],
  lessonsLearned: { type: String },
  
  // Communication
  internalCommunications: [{
    audience: { type: String }, // e.g., 'All Staff', 'Management', 'IT Team'
    message: { type: String },
    sentAt: { type: Date, default: Date.now },
    sentBy: { userId: String, userEmail: String }
  }],
  externalCommunications: [{
    audience: { type: String }, // e.g., 'Customers', 'Regulators', 'Media'
    message: { type: String },
    sentAt: { type: Date, default: Date.now },
    sentBy: { userId: String, userEmail: String },
    approvedBy: { userId: String, userEmail: String }
  }],
  
  // Regulatory & Legal
  regulatoryReporting: {
    required: { type: Boolean, default: false },
    reported: { type: Boolean, default: false },
    reportDate: { type: Date },
    authority: { type: String },
    reportNumber: { type: String },
    deadline: { type: Date }
  },
  legalInvolvement: {
    required: { type: Boolean, default: false },
    lawFirm: { type: String },
    caseNumber: { type: String },
    estimatedCost: { type: Number }
  },
  
  // Integration
  linkedIncidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
  linkedRisks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Risk' }],
  linkedCompliance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliance' }],
  linkedPolicies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  
  // Tags & Classification
  tags: [{ type: String }],
  confidentiality: { 
    type: String, 
    enum: ['Public', 'Internal', 'Confidential', 'Restricted'], 
    default: 'Internal' 
  },
  
  // Audit Trail
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true }, // Added folder field to schema
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
  }],
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for incident duration
IncidentSchema.virtual('duration').get(function() {
  const endDate = this.resolvedAt || this.closedAt || new Date();
  return Math.floor((endDate.getTime() - this.detectedAt.getTime()) / (1000 * 60 * 60 * 24)); // Days
});

// Virtual for SLA status
IncidentSchema.virtual('slaStatus').get(function() {
  if (!this.slaTarget) return 'No SLA';
  const now = new Date();
  if (this.resolvedAt && this.resolvedAt <= this.slaTarget) return 'Met';
  if (now > this.slaTarget) return 'Breached';
  return 'In Progress';
});

// Virtual for open actions count
IncidentSchema.virtual('openActionsCount').get(function() {
  if (!this.actions) return 0;
  return this.actions.filter(action => action.status !== 'Completed').length;
});

// Virtual for critical actions count
IncidentSchema.virtual('criticalActionsCount').get(function() {
  if (!this.actions) return 0;
  return this.actions.filter(action => 
    action.priority === 'Critical' && action.status !== 'Completed'
  ).length;
});

// Pre-save middleware to generate incident number
IncidentSchema.pre('save', async function(next) {
  if (this.isNew && !this.incidentNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Incident').countDocuments({
      incidentNumber: new RegExp(`^INC-${year}-`)
    });
    this.incidentNumber = `INC-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to update SLA breached status
IncidentSchema.pre('save', function(next) {
  if (this.slaTarget && new Date() > this.slaTarget && this.status !== 'Resolved' && this.status !== 'Closed') {
    this.slaBreached = true;
  }
  next();
});

// Indexes for performance
IncidentSchema.index({ incidentNumber: 1 });
IncidentSchema.index({ status: 1, severity: 1 });
IncidentSchema.index({ category: 1, priority: 1 });
IncidentSchema.index({ owner: 1 });
IncidentSchema.index({ detectedAt: 1 });
IncidentSchema.index({ slaTarget: 1 });
IncidentSchema.index({ tags: 1 });

export default mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);
````

## File: guardian/src/models/Policy.ts
````typescript
import mongoose, { Document, Schema, Types, Model } from 'mongoose'; // Standard import for types
// We don't strictly need IFolder here if we define a minimal populated interface
// import { IFolder } from './Folder';

export interface IComment extends Document {
  text: string;
  date?: Date;
  userId?: string;
  userEmail?: string;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String },
  userEmail: { type: String },
});

export interface IPolicy extends Document {
  name: string;
  description?: string;
  owner?: { userId?: string; userEmail?: string };
  effectiveDate?: Date;
  reviewDate?: Date;
  version?: string;
  category?: string;
  attachments?: Array<{ url: string; name: string }>;
  state?: 'Draft' | 'Review' | 'Approved' | 'Rejected';
  comments?: Types.DocumentArray<IComment>;
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date?: Date;
    details?: string;
  }>;
  folder: Types.ObjectId | IPopulatedFolderMin; // Link to the folder, can be ObjectId or populated
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for a minimally populated folder (e.g., when using .populate('folder', '_id name'))
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// Interface for IPolicy when its 'folder' field is populated
export interface IPolicyPopulatedFolder extends Omit<IPolicy, 'folder'> {
  folder: IPopulatedFolderMin;
}

const PolicySchema = new Schema<IPolicy>({
  name: { type: String, required: true },
  description: { type: String },
  owner: {
    userId: { type: String },
    userEmail: { type: String },
  },
  effectiveDate: { type: Date },
  reviewDate: { type: Date },
  version: { type: String, default: '1.0' },
  category: { type: String },
  attachments: [{ url: String, name: String }], // Array of { url, name }
  state: { type: String, enum: ['Draft', 'Review', 'Approved', 'Rejected'], default: 'Draft' },
  comments: [CommentSchema],
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
  }],
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { timestamps: true });

const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);
export default Policy;
````

## File: guardian/src/models/Risk.ts
````typescript
import mongoose, { Document, Schema, Model, Types } from 'mongoose'; // Standard import for types
// import mongooseInstance from '../lib/mongoose'; // Assuming this is a pre-configured instance if needed elsewhere, but for schema definition, standard mongoose is fine.
import { IFolder } from './Folder';
import { IChangeLog } from './ChangeLog'; // Assuming ChangeLog might be used for a more detailed changeHistory type

// Minimal interface for a populated folder reference
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// Interface for MitigationAction (subdocument)
export interface IMitigationAction extends Document {
  description: string;
  assignedTo?: { userId?: string; userEmail?: string };
  dueDate?: Date;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
  cost?: number;
  effectiveness?: number;
  notes?: string;
  completedDate?: Date;
}

// Interface for RiskAssessment (subdocument)
export interface IRiskAssessment extends Document {
  likelihood: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  impact: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  score?: number;
  assessedBy?: { userId?: string; userEmail?: string };
  assessmentDate: Date;
  rationale?: string;
  evidence?: string;
}

// Main Risk Interface
export interface IRisk extends Document {
  title: string;
  description: string;
  category: 'Strategic' | 'Operational' | 'Financial' | 'Compliance' | 'Technology' | 
            'Cybersecurity' | 'Legal' | 'Reputational' | 'Environmental' | 'Health & Safety' |
            'Supply Chain' | 'Market' | 'Credit' | 'Liquidity' | 'Other';
  subcategory?: string;
  owner: { userId: string; userEmail: string };
  stakeholders?: Array<{ userId?: string; userEmail?: string; role?: string }>;
  currentAssessment?: IRiskAssessment; // Use defined interface
  historicalAssessments?: IRiskAssessment[]; // Use defined interface
  status: 'Identified' | 'Assessed' | 'Mitigated' | 'Monitored' | 'Closed' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationActions?: IMitigationAction[]; // Use defined interface
  residualRisk?: IRiskAssessment; // Use defined interface
  riskAppetite: 'Accept' | 'Transfer' | 'Mitigate' | 'Avoid';
  businessUnit?: string;
  project?: string;
  location?: string;
  regulatoryImpact?: string[];
  financialImpact?: { min?: number; max?: number; currency: string };
  identifiedDate: Date;
  targetResolutionDate?: Date;
  nextReviewDate?: Date;
  attachments?: Array<{ url: string; name: string; uploadedBy?: { userId?: string; userEmail?: string }; uploadedAt: Date }>;
  comments?: Array<{ text: string; userId?: string; userEmail?: string; date: Date }>;
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date: Date;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }>; // Consider a more specific IChangeLog if available and suitable
  tags?: string[];
  confidentiality: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  linkedRisks?: Array<Types.ObjectId | IRisk>;
  linkedCompliance?: Types.ObjectId[]; // Assuming Compliance model exists
  linkedPolicies?: Types.ObjectId[];   // Assuming Policy model exists
  linkedControls?: Types.ObjectId[];   // Assuming Control model exists
  linkedIncidents?: string[];
  folder: Types.ObjectId | IPopulatedFolderMin; // Link to the folder

  // Virtuals (not stored in DB, computed)
  riskScore?: number;
  riskLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MitigationActionSchema = new Schema<IMitigationAction>({
  description: { type: String, required: true },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'Overdue'], 
    default: 'Not Started' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 }, // Percentage complete
  cost: { type: Number },
  effectiveness: { type: Number, min: 1, max: 5 }, // 1-5 scale
  notes: { type: String },
  completedDate: { type: Date },
}, { timestamps: true });

const RiskAssessmentSchema = new Schema<IRiskAssessment>({
  likelihood: { 
    type: String, 
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], 
    required: true 
  },
  impact: { 
    type: String, 
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], 
    required: true 
  },
  score: { type: Number, min: 1, max: 25 }, // Calculated field
  assessedBy: {
    userId: { type: String },
    userEmail: { type: String },
  },
  assessmentDate: { type: Date, default: Date.now },
  rationale: { type: String },
  evidence: { type: String },
}, { timestamps: true });

const RiskSchema = new Schema<IRisk>({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Strategic', 'Operational', 'Financial', 'Compliance', 'Technology', 
      'Cybersecurity', 'Legal', 'Reputational', 'Environmental', 'Health & Safety',
      'Supply Chain', 'Market', 'Credit', 'Liquidity', 'Other'
    ],
    required: true 
  },
  subcategory: { type: String },
  
  // Ownership & Responsibility
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  stakeholders: [{
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String }, // e.g., 'Reviewer', 'Approver', 'Implementer'
  }],
  
  // Risk Assessment
  currentAssessment: RiskAssessmentSchema,
  historicalAssessments: [RiskAssessmentSchema],
  
  // Status & Lifecycle
  status: { 
    type: String, 
    enum: ['Identified', 'Assessed', 'Mitigated', 'Monitored', 'Closed', 'Escalated'], 
    default: 'Identified' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  
  // Mitigation
  mitigationActions: [MitigationActionSchema],
  residualRisk: RiskAssessmentSchema, // Risk level after mitigation
  riskAppetite: { 
    type: String, 
    enum: ['Accept', 'Transfer', 'Mitigate', 'Avoid'], 
    default: 'Mitigate' 
  },
  
  // Business Context
  businessUnit: { type: String },
  project: { type: String },
  location: { type: String },
  regulatoryImpact: [{ type: String }], // List of affected regulations
  
  // Financial Impact
  financialImpact: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  
  // Timeline
  identifiedDate: { type: Date, default: Date.now },
  targetResolutionDate: { type: Date },
  nextReviewDate: { type: Date },
  
  // Attachments & Documentation
  attachments: [{ 
    url: String, 
    name: String, 
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Comments & Collaboration
  comments: [{
    text: { type: String, required: true },
    userId: { type: String },
    userEmail: { type: String },
    date: { type: Date, default: Date.now },
  }],
  
  // Audit Trail
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
  }],
  
  // Tags & Classification
  tags: [{ type: String }],
  confidentiality: { 
    type: String, 
    enum: ['Public', 'Internal', 'Confidential', 'Restricted'], 
    default: 'Internal' 
  },
  
  // Integration
  linkedRisks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Risk' }],
  linkedCompliance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliance' }],
  linkedPolicies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  linkedControls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Control' }], // IDs of related controls
  linkedIncidents: [{ type: String }], // IDs of related incidents
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculated risk score
RiskSchema.virtual('riskScore').get(function(this: IRisk) {
  if (this.currentAssessment && this.currentAssessment.likelihood && this.currentAssessment.impact) {
    const likelihoodScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const impactScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    
    const likelihoodScore = likelihoodScores[this.currentAssessment.likelihood] || 3;
    const impactScore = impactScores[this.currentAssessment.impact] || 3;
    
    return likelihoodScore * impactScore;
  }
  return null;
});

// Virtual for risk level based on score
RiskSchema.virtual('riskLevel').get(function(this: IRisk) {
  const score = (this as any).riskScore;
  if (!score) return 'Unknown';
  if (score <= 4) return 'Low';
  if (score <= 8) return 'Medium';
  if (score <= 15) return 'High';
  return 'Critical';
});

// Pre-save middleware to calculate risk score
RiskSchema.pre<IRisk>('save', function(next) {
  if (this.currentAssessment && this.currentAssessment.likelihood && this.currentAssessment.impact) {
    const likelihoodScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const impactScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    
    const likelihoodScore = likelihoodScores[this.currentAssessment.likelihood] || 3;
    const impactScore = impactScores[this.currentAssessment.impact] || 3;
    
    this.currentAssessment.score = likelihoodScore * impactScore;
  }
  next();
});

// Indexes for performance
RiskSchema.index({ status: 1, priority: 1 });
RiskSchema.index({ category: 1, status: 1 });
RiskSchema.index({ owner: 1 });
RiskSchema.index({ 'currentAssessment.score': -1 });
RiskSchema.index({ nextReviewDate: 1 });
RiskSchema.index({ tags: 1 });
RiskSchema.index({ folder: 1 }); // Index for folder field

export interface IRiskPopulatedFolder extends Omit<IRisk, 'folder' | 'save' | 'populate' | 'depopulate' | 'validate' | 'update' | 'remove' | 'delete' | 'deleteOne' | 'replaceOne' | 'set' | 'isModified' | 'isDirectModified' | 'isInit' | 'isSelected' | 'markModified' | 'unmarkModified' | 'equals' | '$isDefault' | '$isDeleted' | '$isNew' | '$isValid' | '$locals' | '$op' | '$session' | '$set' | '$where' | 'directModifiedPaths' | 'errors' | 'get' | 'getChanges' | 'increment' | 'invalidate' | 'isDirectSelected' | 'model' | 'overwrite' | 'populated' | 'schema' | 'toJSON' | 'toObject' | 'toString' | 'validateSync'> {
  folder: IPopulatedFolderMin;
}

export const Risk = (mongoose.models.Risk as Model<IRisk>) || mongoose.model<IRisk>('Risk', RiskSchema);
export default Risk;
````

## File: guardian/src/models/RoleAssignment.ts
````typescript
import mongoose, { Document, Schema } from 'mongoose';
import { IFolder } from './Folder'; // Import IFolder for type referencing

export type RoleType = 'Owner' | 'Editor' | 'Viewer' | 'Contributor'; // Extend as needed

export interface IRoleAssignment extends Document {
  userId: string; // Clerk User ID
  role: RoleType;
  folderId: mongoose.Types.ObjectId | IFolder; // Target folder for the role
  // Potentially: organizationId
}

const RoleAssignmentSchema: Schema = new Schema({
  userId: { type: String, required: true }, // Clerk User ID
  role: { type: String, required: true, enum: ['Owner', 'Editor', 'Viewer', 'Contributor'] },
  folderId: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { timestamps: true });

RoleAssignmentSchema.index({ userId: 1, folderId: 1, role: 1 }, { unique: true }); // Prevent duplicate role assignments for the same user, folder, and role.
// Consider if a user can have multiple roles on the same folder. If not, unique index should be on { userId: 1, folderId: 1 }

export default mongoose.models.RoleAssignment || mongoose.model<IRoleAssignment>('RoleAssignment', RoleAssignmentSchema);
````

## File: guardian/src/styles/design-system.css
````css
/* Guardian Design System - Enforced Global Styles */
:root {
  /* Color Palette */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-secondary: #64748b;
  --color-accent: #f59e42;
  --color-danger: #dc2626;
  --color-success: #16a34a;
  --color-warning: #fbbf24;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;
  --color-muted: #6b7280;
  --color-text: #111827;
  --color-text-light: #f3f4f6;
}

body {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 16px;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5em;
}

.card {
  background: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px 0 rgba(16, 30, 54, 0.06);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  border: none;
  cursor: pointer;
}
.button-primary {
  background: var(--color-primary);
  color: #fff;
}
.button-primary:hover {
  background: var(--color-primary-hover);
}
.button-secondary {
  background: var(--color-secondary);
  color: #fff;
}
.button-danger {
  background: var(--color-danger);
  color: #fff;
}
.button-muted {
  background: var(--color-muted);
  color: #fff;
}
.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input, .select, .textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text);
  margin-bottom: 1rem;
  transition: border 0.2s;
}
.input:focus, .select:focus, .textarea:focus {
  border-color: var(--color-primary);
  outline: none;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.table th, .table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}
.table th {
  background: var(--color-background);
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  font-size: 0.95rem;
}
.table tr:last-child td {
  border-bottom: none;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.75em;
  border-radius: 999px;
  font-size: 0.85em;
  font-weight: 600;
  background: var(--color-background);
  color: var(--color-primary);
}

.modal {
  background: rgba(17, 24, 39, 0.7);
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: 0 4px 24px 0 rgba(16, 30, 54, 0.12);
  padding: 2rem;
  min-width: 320px;
  max-width: 90vw;
}

/* Utility classes */
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: var(--color-muted); }
.text-danger { color: var(--color-danger); }
.text-success { color: var(--color-success); }
.text-primary { color: var(--color-primary); }
.text-accent { color: var(--color-accent); }
.bg-primary { background: var(--color-primary); color: #fff; }
.bg-danger { background: var(--color-danger); color: #fff; }
.bg-success { background: var(--color-success); color: #fff; }
.bg-accent { background: var(--color-accent); color: #fff; }

/* Enterprise GRC Design System - CSS Custom Properties */
/* This file provides CSS custom properties for consistent theming */

:root {
  /* Color System */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-200: #e2e8f0;
  --color-secondary-300: #cbd5e1;
  --color-secondary-400: #94a3b8;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;

  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-300: #86efac;
  --color-success-400: #4ade80;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-success-800: #166534;
  --color-success-900: #14532d;

  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-300: #fcd34d;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;
  --color-warning-900: #78350f;

  --color-danger-50: #fef2f2;
  --color-danger-100: #fee2e2;
  --color-danger-200: #fecaca;
  --color-danger-300: #fca5a5;
  --color-danger-400: #f87171;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
  --color-danger-700: #b91c1c;
  --color-danger-800: #991b1b;
  --color-danger-900: #7f1d1d;

  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Semantic Colors */
  --color-background: #ffffff;
  --color-background-secondary: #f8fafc;
  --color-background-tertiary: #f1f5f9;
  --color-foreground: #0f172a;
  --color-foreground-secondary: #475569;
  --color-foreground-muted: #64748b;
  --color-border: #e2e8f0;
  --color-border-medium: #cbd5e1;
  --color-border-dark: #94a3b8;

  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  --spacing-4xl: 6rem;

  /* Typography Scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;

  /* Z-Index Scale */
  --z-hide: -1;
  --z-auto: auto;
  --z-base: 0;
  --z-docked: 10;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-banner: 1200;
  --z-overlay: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-skip-link: 1600;
  --z-toast: 1700;
  --z-tooltip: 1800;
}

/* Dark Mode Variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-background-secondary: #1e293b;
    --color-background-tertiary: #334155;
    --color-foreground: #f8fafc;
    --color-foreground-secondary: #cbd5e1;
    --color-foreground-muted: #94a3b8;
    --color-border: #334155;
    --color-border-medium: #475569;
    --color-border-dark: #64748b;
  }
}

/* Component-Specific Styles */
.button {
  @apply inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
}

.button-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.button-secondary {
  @apply bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500;
}

.button-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}

.button-ghost {
  @apply bg-transparent hover:bg-gray-100 focus:ring-gray-500;
}

.card {
  @apply rounded-lg border bg-white shadow-sm;
}

.card-elevated {
  @apply rounded-lg border bg-white shadow-md;
}

.card-interactive {
  @apply rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200;
}

.input {
  @apply w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500;
}

.input-error {
  @apply w-full rounded-md border border-red-500 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500;
}

.table {
  @apply w-full border-collapse text-sm;
}

.table-header {
  @apply bg-gray-50 text-gray-700 font-medium text-sm;
}

.table-row {
  @apply border-b border-gray-200 hover:bg-gray-50;
}

.table-cell {
  @apply px-4 py-3 text-sm;
}

.badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
}

.badge-primary {
  @apply bg-blue-100 text-blue-800;
}

.badge-secondary {
  @apply bg-gray-100 text-gray-800;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-danger {
  @apply bg-red-100 text-red-800;
}

/* Utility Classes */
.text-primary { color: var(--color-primary-500); }
.text-secondary { color: var(--color-secondary-500); }
.text-success { color: var(--color-success-500); }
.text-warning { color: var(--color-warning-500); }
.text-danger { color: var(--color-danger-500); }
.text-muted { color: var(--color-foreground-muted); }

.bg-primary { background-color: var(--color-primary-500); }
.bg-secondary { background-color: var(--color-secondary-500); }
.bg-success { background-color: var(--color-success-500); }
.bg-warning { background-color: var(--color-warning-500); }
.bg-danger { background-color: var(--color-danger-500); }

.border-primary { border-color: var(--color-primary-500); }
.border-secondary { border-color: var(--color-secondary-500); }
.border-success { border-color: var(--color-success-500); }
.border-warning { border-color: var(--color-warning-500); }
.border-danger { border-color: var(--color-danger-500); }

/* Responsive Design */
@media (max-width: 640px) {
  .container {
    @apply px-4;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .container {
    @apply px-6;
  }
}

@media (min-width: 1025px) {
  .container {
    @apply px-8;
  }
}
````

## File: guardian/src/middleware.ts
````typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

// All routes are public for local development

export default clerkMiddleware((auth, req) => {
  // By not calling auth().protect() here, all routes are considered public by the middleware.
  // Protection should be handled manually within each page or API route as needed.
  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
````

## File: guardian/.gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# clerk configuration (can include secrets)
/.clerk/
````

## File: guardian/components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
````

## File: guardian/eslint.config.mjs
````
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
````

## File: guardian/next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
````

## File: guardian/package.json
````json
{
  "name": "guardian",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.22.0",
    "@headlessui/react": "^2.2.4",
    "@hello-pangea/dnd": "^18.0.1",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@types/formidable": "^3.4.5",
    "chart.js": "^4.5.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "formidable": "^3.5.4",
    "lucide-react": "^0.517.0",
    "mongoose": "^8.16.0",
    "next": "15.3.4",
    "next-themes": "^0.4.6",
    "react": "^19.0.0",
    "react-arborist": "^3.4.3",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.0.0",
    "shadcn-ui": "^0.9.5",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.4",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.4",
    "typescript": "^5"
  }
}
````

## File: guardian/postcss.config.mjs
````
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
````

## File: guardian/README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: guardian/tailwind.config.js
````javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',   // blue-800
        },
        secondary: {
          DEFAULT: '#f59e42', // orange-400
          dark: '#b45309',   // orange-700
        },
        accent: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#047857',   // emerald-800
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
````

## File: guardian/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: .gitattributes
````
# Auto detect text files and perform LF normalization
* text=auto
````

## File: LICENSE
````
MIT License

Copyright (c) 2025 Rolly Falco Villacacan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: package.json
````json
{
  "dependencies": {
    "@hello-pangea/dnd": "^18.0.1",
    "@radix-ui/react-icons": "^1.3.2",
    "@shadcn/ui": "^0.0.4",
    "chart.js": "^4.5.0",
    "next-themes": "^0.4.6",
    "react-chartjs-2": "^5.3.0"
  }
}
````

## File: README.md
````markdown
# guardian-grc
````
