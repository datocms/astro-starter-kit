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
- 🧩 **Plugin ready** — Support for the fantastic plugins [Web Previews](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) and [SEO/Readability Analysis](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis).
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
- `DATOCMS_CMA_TOKEN`: CMA Only (Admin)

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

## VS Code

It is highly recommended to follow [these instructions](https://gql-tada.0no.co/get-started/installation#vscode-setup) for an optimal experience with Visual Studio Code, including features like diagnostics, auto-completions, and type hovers for GraphQL.

## <!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agencies, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Why DatoCMS?**

- **API-First Architecture**: Built for both REST and GraphQL, enabling flexible content delivery
- **Just Enough Features**: We believe in keeping things simple, and giving you [the right feature-set tools](https://www.datocms.com/features) to get the job done
- **Developer Experience**: First-class TypeScript support with powerful developer tools

**Getting Started:**

- ⚡️ [Create Free Account](https://dashboard.datocms.com/signup) - Get started with DatoCMS in minutes
- 🔖 [Documentation](https://www.datocms.com/docs) - Comprehensive guides and API references
- ⚙️ [Community Support](https://community.datocms.com/) - Get help from our team and community
- 🆕 [Changelog](https://www.datocms.com/product-updates) - Latest features and improvements

**Official Libraries:**

- [**Content Delivery Client**](https://github.com/datocms/cda-client) - TypeScript GraphQL client for content fetching
- [**REST API Clients**](https://github.com/datocms/js-rest-api-clients) - Node.js/Browser clients for content management
- [**CLI Tools**](https://github.com/datocms/cli) - Command-line utilities for schema migrations (includes [Contentful](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [WordPress](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress) importers)

**Official Framework Integrations**

Helpers to manage SEO, images, video and Structured Text coming from your DatoCMS projects:

- [**React Components**](https://github.com/datocms/react-datocms)
- [**Vue Components**](https://github.com/datocms/vue-datocms)
- [**Svelte Components**](https://github.com/datocms/datocms-svelte)
- [**Astro Components**](https://github.com/datocms/astro-datocms)

**Additional Resources:**

- [**Plugin Examples**](https://github.com/datocms/plugins) - Example plugins we've made that extend the editor/admin dashboard
- [**Starter Projects**](https://www.datocms.com/marketplace/starters) - Example website implementations for popular frameworks
- [**All Public Repositories**](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)

<!--datocms-autoinclude-footer end-->
