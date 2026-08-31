import { type Client, buildClient } from '@datocms/cma-client';
import type { APIRoute } from 'astro';
import { DATOCMS_CMA_TOKEN, SECRET_API_TOKEN } from 'astro:env/server';
import {
  handleUnexpectedError,
  invalidRequestResponse,
  successfulResponse,
  withCORS,
} from '../utils';

/*
 * This endpoint is called only once, immediately after the initial deployment of
 * this project, to set up some DatoCMS settings. Feel free to remove it!
 */

export const OPTIONS: APIRoute = () => {
  return new Response('OK', withCORS());
};

/**
 * Install and configure the "Web Previews" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL('/api/preview-links', baseUrl).toString(),
          customHeaders: [{ name: 'Authorization', value: `Bearer ${SECRET_API_TOKEN}` }],
          visualEditing: {
            enableDraftModeUrl: new URL(
              `/api/draft-mode/enable?token=${SECRET_API_TOKEN}`,
              baseUrl,
            ).toString(),
            initialPath: '/',
          },
        },
      ],
      startOpen: true,
    },
  });
}

/**
 * Install and configure the "SEO/Readability Analysis" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis
 */
async function installSEOAnalysisPlugin(client: Client, baseUrl: string) {
  const seoPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-seo-readability-analysis',
  });

  await client.plugins.update(seoPlugin.id, {
    parameters: {
      htmlGeneratorUrl: new URL('/api/seo-analysis', baseUrl).toString(),
      customHeaders: [{ name: 'Authorization', value: `Bearer ${SECRET_API_TOKEN}` }],
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

/**
 * Install the private plugin hosted by this same project. The plugin entry
 * point is the /private-datocms-plugin page, which DatoCMS loads in an iframe.
 */
async function installPrivatePlugin(client: Client, baseUrl: string) {
  await client.plugins.create({
    name: 'Private Plugin',
    url: new URL('/private-datocms-plugin', baseUrl).toString(),
  });
}

/**
 * The DatoCMS API token arrives in the request body, so without this check the
 * endpoint would happily write our SECRET_API_TOKEN into any project a caller
 * names, and the caller could then read it back from their own project.
 */
async function ensureSameProject(client: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    client.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });
  const baseUrl = body.frontendUrl as string;

  try {
    if (!(await ensureSameProject(client, DATOCMS_CMA_TOKEN))) {
      return invalidRequestResponse('Invalid token', 401);
    }

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
      installPrivatePlugin(client, baseUrl),
    ]);

    return successfulResponse();
  } catch (error) {
    return handleUnexpectedError(error);
  }
};
