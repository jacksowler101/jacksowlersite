# Editing guide — Jack Sowler site

A practical reference for the most common tasks: adding articles, adding projects, adding interactive charts, and deploying. No prior web experience assumed.

---

## Quick orientation

```
gb-power-insights/
├── src/
│   ├── content/
│   │   ├── writing/        ← your essays (.md or .mdx)
│   │   └── projects/       ← your project cards (.md or .mdx)
│   ├── components/
│   │   └── charts/         ← interactive React charts (.jsx)
│   ├── pages/              ← site routes (rarely need editing)
│   ├── styles/global.css   ← all visual styling
│   └── consts.ts           ← your name, bio, LinkedIn, GitHub
├── public/
│   └── covers/             ← card cover images (.svg or .png/.jpg)
└── astro.config.mjs        ← site URL (update when you have a domain)
```

The golden rule: **content lives in `src/content/`**. Everything else you only touch occasionally.

---

## 1. Add a writing article

Create a new `.md` (plain text) or `.mdx` (text + components) file in `src/content/writing/`.

**File name** becomes the URL slug: `my-first-essay.md` → `/writing/my-first-essay/`

### Minimal example (`src/content/writing/my-first-essay.md`)

```markdown
---
title: 'My first essay'
description: 'A one-sentence description that appears on the card.'
pubDate: 'Jul 01 2026'
disciplines: ['Energy', 'Policy']
cover: '/covers/policy.svg'
---

Your essay text goes here. Markdown is supported: **bold**, *italic*, 
[links](https://example.com), headers, lists, etc.

## A section heading

Section headings (## and ###) are picked up automatically to build the 
table of contents on the right — this appears once you have 3+ headings.
```

### Frontmatter fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Shown in the card and article header |
| `description` | yes | Card subtitle |
| `pubDate` | yes | e.g. `'Jul 01 2026'` |
| `disciplines` | no | Tags: `['Energy']`, `['AI', 'Climate']`, etc. |
| `cover` | no | Path to a cover image: `/covers/energy.svg` or `/covers/my-image.jpg` |
| `updatedDate` | no | Shows "Updated" note if newer than pubDate |
| `draft: true` | no | Hides the article from the site |

### Available discipline tags

`Energy` · `Policy` · `Climate` · `AI` · `Data` · `Science` · `Sport` · `Personal`

(You can invent new ones — they're just strings.)

### Adding a cover image

Drop a `.jpg`, `.png`, or `.svg` in `public/covers/` and reference it as `/covers/filename.jpg`.

---

## 2. Add a project card

Create a `.md` or `.mdx` file in `src/content/projects/`.

### Simple roadmap card (`src/content/projects/my-new-project.md`)

```markdown
---
title: 'My new project'
description: 'One sentence on what this does.'
status: 'planned'
disciplines: ['Data', 'Climate']
cover: '/covers/climate.svg'
order: 80
---

A few paragraphs about the project idea. What is it, why does it matter,
what will it show? This body text appears on the project detail page.
```

### Frontmatter fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | |
| `description` | yes | Card subtitle |
| `status` | yes | `'planned'` · `'in-progress'` · `'live'` |
| `disciplines` | no | Same tags as writing |
| `cover` | no | `/covers/filename.svg` |
| `order` | no | Higher = appears first. Use 100, 90, 80… |
| `date` | no | Optional completion/publish date |
| `externalUrl` | no | If set, the card links to an external site and no detail page is built |
| `draft: true` | no | Hides from site |

### Promoting a project from `planned` → `live`

Edit the frontmatter: change `status: 'planned'` to `status: 'live'`. The badge on the card updates automatically.

---

## 3. Add an interactive chart

This is slightly more involved, but follows the same pattern as the existing GB generation mix chart.

### Step 1 — create the React chart component

Create `src/components/charts/MyChart.jsx`:

```jsx
import React, { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

// your data
const data = [
  { year: 2020, value: 42 },
  { year: 2021, value: 58 },
  { year: 2022, value: 71 },
];

export default function MyChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <AreaChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="value" stroke="#9c4524" fill="#f1e6da" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

Recharts docs: https://recharts.org/en-US/api

### Step 2 — embed it in an MDX file

Your project (or writing) file must be `.mdx` (not `.md`) to use components.

```mdx
---
title: 'My project with a chart'
description: 'Interactive chart showing X over time.'
status: 'live'
disciplines: ['Data']
order: 85
---

import MyChart from '../../components/charts/MyChart.jsx';
import ChartFigure from '../../components/ChartFigure.astro';

Some introductory text here.

<ChartFigure
  title="My chart title"
  caption="What this shows in one sentence."
  source="Source: ONS / NESO / wherever the data is from"
>
  <MyChart client:only="react" />
</ChartFigure>

More text after the chart.
```

**Key detail:** the `client:only="react"` directive is required on every interactive chart. Without it, Recharts won't run in the browser.

---

## 4. Update personal details

Edit [`src/consts.ts`](src/consts.ts) — these values propagate to the header, footer, about page, and RSS feed:

```ts
export const SITE_INTRO = "Hi, I'm Jack. ...";   // hero paragraph on home page
export const LINKEDIN_URL = 'https://www.linkedin.com/in/YOUR-REAL-SLUG';
export const GITHUB_URL = 'https://github.com/YOUR-REAL-USERNAME';
```

For the about page body text, edit [`src/pages/about.astro`](src/pages/about.astro) directly.

Once you have a live domain, set it in [`astro.config.mjs`](astro.config.mjs):

```js
site: 'https://jacksowler.dev',   // ← your real domain
```

---

## 5. Deploy the site

### One-time setup

#### A — push to GitHub

1. Go to https://github.com/new and create a **private** or public repo named `personal-site` (or anything you like).
2. Copy the two commands GitHub shows you under "push an existing repository":
   ```
   git remote add origin https://github.com/YOUR-USERNAME/personal-site.git
   git push -u origin master
   ```
   Run both in Terminal / PowerShell from inside `C:\Users\JackSowler\gb-power-insights`.

#### B — connect to Cloudflare Pages (free, recommended)

1. Sign up at https://pages.cloudflare.com (free account).
2. Click **"Create application"** → **"Pages"** → **"Connect to Git"**.
3. Authorise GitHub and pick your `personal-site` repo.
4. Set the **build settings**:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **"Save and Deploy"**.

Cloudflare builds and deploys in ~1 minute. It gives you a free `*.pages.dev` URL immediately. You can add a custom domain later for free.

#### Alternatively: Vercel

Same idea. Go to https://vercel.com → "Add New Project" → import your GitHub repo → Vercel auto-detects Astro and deploys.

---

### Ongoing: deploying after edits

After making any change, the workflow is just:

```bash
# from C:\Users\JackSowler\gb-power-insights in Terminal / PowerShell
git add .
git commit -m "Add article on UK carbon budgets"
git push
```

Cloudflare Pages / Vercel watch your GitHub repo and **automatically rebuild and redeploy** every time you push. Changes are live within ~1 minute.

---

## 6. Running the site locally

To preview changes before pushing:

```bash
cd C:\Users\JackSowler\gb-power-insights
npm run dev
```

Then open http://localhost:4321 in your browser.

`Ctrl+C` to stop the server.

---

## 7. Cheatsheet

| Task | File(s) to edit |
|------|----------------|
| New essay | Create `src/content/writing/slug.md` |
| New project card | Create `src/content/projects/slug.md` |
| New interactive chart | Create `src/components/charts/MyChart.jsx` + embed in `.mdx` |
| Change LinkedIn / GitHub links | `src/consts.ts` |
| Edit About page | `src/pages/about.astro` |
| Update site domain | `astro.config.mjs` |
| Add a cover image | Drop file in `public/covers/`, reference as `/covers/filename.ext` |
| Promote project to live | Set `status: 'live'` in project frontmatter |
| Hide something temporarily | Add `draft: true` to frontmatter |
