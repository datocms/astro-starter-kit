import { buildClient } from '@datocms/cma-client';
import type { APIRoute } from 'astro';
import { DATOCMS_CMA_TOKEN, SECRET_API_TOKEN } from 'astro:env/server';
import type { AnyModel } from '~/lib/datocms/cma-types';
import { recordToWebsiteRoute } from '~/lib/datocms/recordInfo';
import { handleUnexpectedError, invalidRequestResponse, json, withCORS } from '../utils';

export const OPTIONS: APIRoute = () => {
  return new Response('OK', withCORS());
};

type PreviewLink = {
  label: string;
  url: string;
  reloadPreviewOnRecordUpdate?: boolean | { delayInMs: number };
};

type WebPreviewsResponse = {
  previewLinks: PreviewLink[];
};

/**
 * This route handler implements the Previews webhook required for the "Web
 * Previews" plugin:
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews#the-previews-webhook
 */

export const POST: APIRoute = async ({ request }) => {
  try {
    // The token is sent by the plugin as a request header (see /api/post-deploy)
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

    // Ensure that the request is coming from a trusted source
    if (!token || token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    /**
     * The plugin sends the record and model for which the user wants a preview,
     * along with information about which locale they are currently viewing in
     * the interface
     */
    const { item, locale, environmentId } = await request.json();

    // We can use this info to generate the frontend URL associated
    const recordUrl = await recordToWebsiteRoute(item, locale);

    /**
     * The plugin only sends the current (draft) version of the record. If it has
     * unpublished changes (e.g. a modified slug), the published URL might differ,
     * so we compute it from the published version.
     *
     * See "How the preview links are built" in the README.
     */
    let publishedUrl = recordUrl;

    if (recordUrl && item.meta.status === 'updated') {
      try {
        const client = buildClient({
          apiToken: DATOCMS_CMA_TOKEN,
          environment: environmentId,
        });

        const { data: publishedItem } = await client.items.rawFind<AnyModel>(item.id, {
          version: 'published',
        });

        publishedUrl = await recordToWebsiteRoute(publishedItem, locale);
      } catch (error) {
        /**
         * If the published version can't be fetched (e.g. missing CMA token),
         * fall back to the current URL instead of losing every preview link.
         */
        console.error(error);
      }
    }

    const response: WebPreviewsResponse = { previewLinks: [] };

    if (recordUrl) {
      /**
       * If status is not published, it means that it has a current version that's
       * different from the published one, so it has a draft version!
       */
      if (item.meta.status !== 'published') {
        /**
         * Generate a URL that initially enters Draft Mode, and then
         * redirects to the desired URL
         */
        response.previewLinks.push({
          label: 'Draft version',
          url: new URL(
            /*
             * We generate the URL in a way that it first passes through the
             * endpoint that enables the Draft Mode.
             */
            `/api/draft-mode/enable?redirect=${recordUrl}&token=${token}`,
            request.url,
          ).toString(),
        });
      }

      /** If status is not draft, it means that it has a published version! */
      if (publishedUrl && item.meta.status !== 'draft') {
        /**
         * Generate a URL that first exits from Draft Mode, and then
         * redirects to the desired URL.
         */
        response.previewLinks.push({
          label: 'Published version',
          url: new URL(
            /*
             * We generate the URL in a way that it first passes through the
             * endpoint that disables the Draft Mode.
             */
            `/api/draft-mode/disable?redirect=${publishedUrl}`,
            request.url,
          ).toString(),
        });
      }
    }

    // Respond in the format expected by the plugin
    return json(response, withCORS());
  } catch (error) {
    return handleUnexpectedError(error);
  }
};
