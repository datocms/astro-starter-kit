<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# Astro Starter Kit

This project aims to be a great starting point for your Astro projects that need to interact with DatoCMS.

- 🔍 **Fully commented code** — Every file is commented and explained in detail, it will be impossible to get lost!
- 💯 **100% TypeScript** — Thanks to [gql.tada](https://gql-tada.0no.co/) every GraphQL query is fully typed, and your IDE will help you complete the GraphQL queries.
- 🛠️ **Minimal boilerplate** — The project is minimal and exposes only what is necessary to get started, without complicated models that need to be removed.
- 🚫 **Zero CSS** — There is only one CSS import, which you can remove to use your preferred CSS tool.
- 📝 **Full support for Draft Mode** — Your editors can always view the latest draft version of the content.
- ✏️ **Click-to-edit overlays** — Integrated [@datocms/content-link](https://www.npmjs.com/package/@datocms/content-link) for intuitive content editing. Click on any content element on your website to instantly open the DatoCMS editor for that specific field.
- 🧩 **Plugin ready** — Full integration with the [Web Previews](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) plugin, including Visual Editing mode for seamless in-context editing, and [SEO/Readability Analysis](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis).
- 🔄 **DatoCMS's Real-time Updates API** — Your editors can see updated content instantly as soon as you save a new version on DatoCMS.
- 🌐 **SEO Metadata** — Full integration between Astro and the SEO settings coming from DatoCMS.
- 📦 Official CDA Client — Uses @datocms/cda-client for performant, type-safe GraphQL queries to the Content Delivery API.
- 🔒 Type-Safe CMA Client — Uses @datocms/cma-client with auto-generated types from your schema for full autocomplete and compile-time safety.

## How to use

### Quick start

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Let DatoCMS set everything up for you clicking this button below:

[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/deploy?repo=datocms%2Fastro-starter-kit%3Amain)

### Local setup

Once the setup of the project and repo is done, clone the repo locally.

#### Set up environment variables

Copy the sample .env file:

```bash
cp .env.local.example .env
```

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Copy the values of the following tokens into the specified environment variable:

- `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`: CDA Only (Published)
- `DATOCMS_DRAFT_CONTENT_CDA_TOKEN`: CDA Only (Draft)
- `DATOCMS_CMA_TOKEN`: CMA Only (Read)
- `DATOCMS_BASE_EDITING_URL`: Your DatoCMS project URL (e.g., `https://your-project.admin.datocms.com`). This enables click-to-edit overlays that link content directly to the DatoCMS editor.

Then set both `SECRET_API_TOKEN` and `SIGNED_COOKIE_JWT_SECRET` by generating two different secure strings (you can use `openssl rand -hex 32` or any other cryptographically-secure random string generator):

- The `SECRET_API_TOKEN` will be used to safeguard all API routes from incoming requests from untrusted sources;
- The `SIGNED_COOKIE_JWT_SECRET` will be used to sign the Draft Mode cookies.

#### Run your project locally

```bash
npm install
npm run dev
```

Your website should be up and running on [http://localhost:4321](http://localhost:4321)!

#### Generate CMA types (optional)

To get full type-safety when working with the Content Management API:

```bash
npm run generate-cma-types
```

This generates TypeScript types from your DatoCMS schema in `src/lib/datocms/cma-types.ts`. Run this command again whenever your schema changes to keep types in sync.

See: [Type-safe development with TypeScript](https://www.datocms.com/docs/content-management-api/resources/item#type-safe-development-with-typescript)

## Click-to-edit overlays

This starter kit includes [@datocms/content-link](https://www.npmjs.com/package/@datocms/content-link), which provides intuitive click-to-edit overlays for your content.

### How to use

When viewing your website in draft mode, **press and hold the Alt/Option key** to enable click-to-edit mode. Interactive overlays will appear on all editable content. Release the key to disable the overlays.

This feature works in two powerful ways:

### 1. Standalone website editing

Click on any content element to instantly open the DatoCMS editor for that specific field in a new tab. This makes it incredibly easy for editors to jump directly to the content they want to modify.

### 2. Web Previews plugin Visual Editing mode

When using the [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) in Visual Editing mode, clicking on content opens the field editor in a side panel right next to your preview. The integration also enables:

- **In-plugin navigation**: Users can navigate to different URLs within the Visual mode interface (like a browser navigation bar), and the preview automatically updates to show the corresponding page
- **Synchronized state**: The preview and DatoCMS interface stay in perfect sync

This bidirectional communication is established automatically when your preview runs inside the Web Previews plugin—no additional configuration needed **on the code side**. The plugin itself still needs to be installed and pointed at your app; see [Configuring Visual Editing manually](#configuring-visual-editing-manually) if you're not using the one-click marketplace deploy.

### How it works

The implementation consists of three parts:

1. **Data fetching** (`src/lib/datocms/executeQuery.ts:37`): When fetching draft content, the `contentLink: 'v1'` option embeds stega-encoded metadata into text fields
2. **ContentLink component** (`src/components/ContentLink/Component.astro`): Creates interactive overlays and handles the Web Previews plugin integration
3. **Layout integration** (`src/layouts/Layout.astro:55`): The ContentLink component is rendered only in draft mode

For more details, see the [package documentation](https://www.npmjs.com/package/@datocms/content-link).

### Configuring Visual Editing manually

When you deploy this starter through the [DatoCMS marketplace](https://dashboard.datocms.com/deploy?repo=datocms%2Fastro-starter-kit%3Amain), the Web Previews plugin (which powers Visual Editing) is installed and configured for you automatically by the [`src/pages/api/post-deploy/index.ts`](src/pages/api/post-deploy/index.ts) code.

If you're **developing locally** or **deploying outside the one-click flow**, that step doesn't run, so you need to set the plugin up by hand. Here's how to reproduce it.

#### 1. Make your app reachable from DatoCMS

DatoCMS is a cloud service, and the Web Previews plugin runs inside the DatoCMS interface — not on your machine. When it needs preview links or wants to enable Draft Mode, **DatoCMS's own servers make an HTTP request to the URLs you configure here**. The traffic originates from DatoCMS in the cloud and has to travel _to_ your app.

That's why `http://localhost:4321` doesn't work: `localhost` means "the machine making the request," so DatoCMS would be calling itself, not your dev server. For DatoCMS to reach your app, the app has to be available at a public internet address.

- **Deployed app**: use its public URL (e.g. `https://your-app.example.com`).
- **Local development**: put a tunnel in front of your dev server — e.g. `ngrok http 4321` or `cloudflared tunnel` — which gives you a public URL that forwards to your local server.

In the steps below, replace `<BASE_URL>` with that public URL and `<SECRET>` with the value of your `SECRET_API_TOKEN` environment variable.

#### 2. Install the Web Previews plugin

In your DatoCMS project, go to **Settings > Plugins > Add a new plugin**, search for **Web Previews**, and install it.

#### 3. Configure the plugin

Open the plugin's settings and add a single frontend:

| Setting                                    | Value                                             |
| ------------------------------------------ | ------------------------------------------------- |
| **Name**                                   | `Production`                                      |
| **Preview webhook URL**                    | `<BASE_URL>/api/preview-links?token=<SECRET>`     |
| **Enable draft mode URL** (Visual Editing) | `<BASE_URL>/api/draft-mode/enable?token=<SECRET>` |
| **Initial path** (Visual Editing)          | `/`                                               |
| **Start open**                             | enabled                                           |

Both endpoints are guarded by `SECRET_API_TOKEN`; if the token in the URL doesn't match your environment variable, the requests are rejected.

#### 4. Verify

Open a record in DatoCMS and switch to the Web Previews / Visual Editing view. The preview should render, and the starter's click-to-edit interaction should work.

> The same [`src/pages/api/post-deploy/index.ts`](src/pages/api/post-deploy/index.ts) code also configures other things (the SEO/Readability Analysis plugin and a bundled private plugin). If you're setting the project up by hand, treat that file as the authoritative reference for those too.

## VS Code

It is highly recommended to follow [these instructions](https://gql-tada.0no.co/get-started/installation#vscode-setup) for an optimal experience with Visual Studio Code, including features like diagnostics, auto-completions, and type hovers for GraphQL.

## <!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**

- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.

<!--datocms-autoinclude-footer end-->
