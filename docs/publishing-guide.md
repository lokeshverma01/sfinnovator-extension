# How to Publish a Blog Post (No-Code Guide)

This is the **only** document you need to publish. You never edit site code — you
create one Markdown file, fill in the fields, write your content, and push. The
template does the rest: layout, styling, SEO, the listing, search, RSS, and the
sitemap all update automatically.

> TL;DR: copy a template → rename it → fill the fields at the top → write your
> post → commit on a branch → open a PR → merge when the build is green. Done.

---

## 1. The big picture

A post is a single file in `src/content/blog/` ending in `.mdx`. It has two parts:

```
---
(FRONTMATTER — "the form": fields like title, description, type, …)
---

(BODY — your writing, in Markdown)
```

The **file name becomes the URL**: `my-post.mdx` → `sfinnovator.com/blog/my-post`.
Use lowercase-with-hyphens (e.g. `resolve-apex-cpu-limit.mdx`).

There are **three post types**. Pick one with the `postType` field; that decides
which extra fields you fill in:

| postType | Use it for | Copy this template |
|---|---|---|
| `implementation` | End-to-end "how to build X" tutorials | `approval-process-end-to-end.mdx` |
| `use-case` | Solving a business scenario | `auto-assign-cases-by-region.mdx` |
| `debugging` | Error → root cause → fix | `apex-cpu-time-limit-exceeded.mdx` |

The three example posts already in `src/content/blog/` ARE your templates — copy
the one that matches and overwrite the fields.

---

## 2. The fields (the "form")

### Common fields — every post has these
| Field | Required | What to put |
|---|---|---|
| `postType` | ✅ | `implementation`, `use-case`, or `debugging` |
| `title` | ✅ | The headline (≤ 70 chars) |
| `description` | ✅ | 1–2 sentence summary (50–160 chars). Shown in listings, search, and social shares. |
| `category` | ✅ | One or more of: `Admin`, `Developer`, `Architect`, `Consultant` |
| `tags` | – | Topic tags, e.g. `["Flow", "Apex"]` |
| `difficulty` | – | `Beginner`, `Intermediate`, or `Advanced` |
| `publishDate` | ✅ | `YYYY-MM-DD` |
| `updatedDate` | – | `YYYY-MM-DD` — add when you revise a post |
| `author` | – | Your name (defaults to the site author) |
| `featuredImage` | – | Path to a hero/social image in `/public` |
| `draft` | – | `true` hides the post from the live site (great for works-in-progress) |

### `implementation` adds
`prerequisites` (list) · `estimatedTime` ("30 minutes") · `salesforceEdition`
("Enterprise · Summer '26") · `featuresUsed` (list) · `repoUrl` · `demoUrl`

### `use-case` adds
`scenario` (one-line problem) ✅ · `personas` (list) · `products` (list) ·
`businessImpact` ("Cut routing time 40%")

### `debugging` adds
`symptom` (one line) ✅ · `rootCauseSummary` (one line) ✅ · `errorMessage` (the
exact error) · `affectedFeatures` (list) · `status`
(`Investigating` / `Workaround Available` / `Resolved`) · `resolvedInRelease`

> If you mistype a field or miss a required one, the build fails with a clear
> message and the post does NOT go live — so you can't accidentally publish a
> broken post.

---

## 3. Writing the body

Write normally in Markdown: `## Heading`, `**bold**`, lists, links, and code
blocks with triple backticks. Headings automatically become the Table of Contents.

You also get a few **ready-made blocks** you can drop in (no import needed):

**Callout** — a colored note/tip/warning/error box:
```mdx
<Callout type="warning" title="Watch out">
  Bulkify your code or you'll hit governor limits.
</Callout>
```
`type` can be `note`, `tip`, `warning`, or `error`.

**Steps** — auto-numbered steps for tutorials:
```mdx
<Steps>
  <Step title="Create the object">Go to Setup → Object Manager…</Step>
  <Step title="Add the field">…</Step>
</Steps>
```

**Figure** — an image with a caption:
```mdx
<Figure src="/images/posts/flow.png" alt="The flow canvas" caption="The finished flow." />
```
(Put the image file in `public/images/posts/` and reference it as `/images/posts/...`.)

**StatusBadge** — the colored status pill (mostly for debugging posts):
```mdx
<StatusBadge status="Resolved" />
```

---

## 4. Publish it (the exact commands)

From the project folder:

```bash
# 1. Start a branch for your post
git switch -c post/your-post-slug

# 2. Create your post (copy a template, then edit it)
cp src/content/blog/approval-process-end-to-end.mdx src/content/blog/your-post-slug.mdx
#   …open it in the editor, change the fields and write your content…

# 3. (Optional) preview locally with search working:
pnpm build && pnpm preview      # then open the printed localhost URL

# 4. Commit and push
git add src/content/blog/your-post-slug.mdx
git commit -m "Add post: your title"
git push -u origin post/your-post-slug

# 5. Open a Pull Request, wait for the green "build" check, then merge
gh pr create --fill
#   …after the build check passes…
gh pr merge --squash --delete-branch
```

The moment the PR merges to `main`, GitHub Actions rebuilds and deploys. Your post
is live within a couple of minutes at `/blog/your-post-slug` — and it's
automatically added to the blog list, search index, category/tag pages, RSS feed,
and sitemap. **You changed zero code.**

> Just writing a quick draft? Set `draft: true` and merge — it stays hidden from
> the live site until you flip it to `false`.

---

## 5. Adding a portfolio item

Same idea, in `src/content/portfolio/`. Copy `discount-approval-app.mdx`, fill in
`title`, `description`, `summary`, `tech`, optional `demoUrl` / `repoUrl` /
`relatedPost` (a blog slug), then commit. It appears as a tile on `/portfolio`
automatically.

---

## 6. If something goes wrong

- **Build fails after adding a post** → read the error; it usually names the bad
  field (e.g. description too long, missing required field). Fix and re-push.
- **Post doesn't appear** → check `draft` isn't `true` and `publishDate` is valid.
- More: see [troubleshooting/#post-missing](./troubleshooting/README.md#post-missing).
