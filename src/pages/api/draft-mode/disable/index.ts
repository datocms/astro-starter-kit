import type { APIRoute } from 'astro';
import { disableDraftMode } from '~/lib/draftMode';
import { handleUnexpectedError, invalidRequestResponse, isSafeRedirectUrl } from '../../utils';

/**
 * This route handler disables Draft Mode and redirects to the given URL.
 */
export const GET: APIRoute = (event) => {
  const { url } = event;
  // Parse query string parameters
  const redirectUrl = url.searchParams.get('redirect') || '/';

  try {
    // Avoid open redirect vulnerabilities
    if (!isSafeRedirectUrl(redirectUrl, url.hostname)) {
      return invalidRequestResponse('URL must be relative!', 422);
    }

    disableDraftMode(event);
  } catch (error) {
    return handleUnexpectedError(error);
  }

  return event.redirect(redirectUrl, 307);
};
