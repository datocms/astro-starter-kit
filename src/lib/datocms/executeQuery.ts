import { executeQuery as libExecuteQuery } from '@datocms/cda-client';
import {
  DATOCMS_DRAFT_CONTENT_CDA_TOKEN,
  DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
  DATOCMS_BASE_EDITING_URL,
} from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, using a
 * different API token depending on whether we want to fetch draft content or
 * published.
 */
export async function executeQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>,
) {
  const result = await libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts: options?.includeDrafts,
    token: options?.includeDrafts
      ? DATOCMS_DRAFT_CONTENT_CDA_TOKEN
      : DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
    /*
     * Enable content-link for draft content only. This embeds stega-encoded
     * metadata in text fields, which the @datocms/content-link package uses
     * to create click-to-edit overlays. When editors click on content, they're
     * taken directly to the corresponding field in the DatoCMS editor.
     *
     * This works both:
     * - On the standalone website (opens DatoCMS in a new tab)
     * - Inside the Web Previews plugin Visual mode (opens field in side panel)
     *
     * Only enabled for draft content to avoid the overhead in production.
     */
    contentLink: options?.includeDrafts ? 'v1' : undefined,
    baseEditingUrl: options?.includeDrafts ? DATOCMS_BASE_EDITING_URL : undefined,
  });

  return result;
}

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  includeDrafts?: boolean;
};
