/*
 * Type-safe record handling using DatoCMS's generated types.
 *
 * This file uses types generated from your DatoCMS schema via `npm run generate-cma-types`.
 * The generated types provide full autocomplete and compile-time safety when
 * accessing record fields.
 *
 * See: https://www.datocms.com/docs/content-management-api/resources/item#type-safe-development-with-typescript
 */
import type { RawApiTypes } from '@datocms/cma-client';
import type { AnyModel } from './cma-types';

/*
 * Both the "Web Previews" and "SEO/Readability Analysis" plugins from DatoCMS
 * need to know the URL of the site that corresponds to each DatoCMS record to
 * work properly. These two functions are responsible for returning this
 * information, and are utilized by the API routes associated with the two
 * plugins:
 *
 * - src/pages/api/seo-analysis/index.ts
 * - src/pages/api/preview-links/index.ts
 */

export function recordToWebsiteRoute(
  item: RawApiTypes.Item<AnyModel>,
  itemTypeApiKey: string,
  locale: string,
): string | null {
  switch (itemTypeApiKey) {
    case 'page': {
      return `/page/${recordToSlug(item, itemTypeApiKey, locale)}`;
    }
    /*
     * Add cases for other models as needed. For example, if you add an
     * 'article' model with a 'slug' field:
     *
     * case 'article': {
     *   return `/blog/${recordToSlug(item, itemTypeApiKey, locale)}`;
     * }
     */
    default:
      return null;
  }
}

export function recordToSlug(
  item: RawApiTypes.Item<AnyModel>,
  itemTypeApiKey: string,
  _locale: string,
): string | null {
  switch (itemTypeApiKey) {
    case 'page': {
      /*
       * Using generated types, TypeScript knows which fields exist on each model.
       * Access fields directly without type casting.
       */
      return item.attributes.slug;
    }
    /*
     * Add cases for other models as needed. For example, if you add an
     * 'article' model with a 'slug' field, regenerate types with
     * `npm run generate-cma-types` and add:
     *
     * case 'article': {
     *   return item.attributes.slug;
     * }
     */
    default:
      return null;
  }
}
