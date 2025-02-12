import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { enableDraftMode } from '~/lib/draftMode';
import { handleUnexpectedError, invalidRequestResponse } from '../../utils';

const isExternalOrInvalidUrl = (url: string, hostname: string) => {
  try {
    const parsed = new URL(url, `http://${hostname}`);
    return parsed.hostname !== hostname;
  } catch {
    return true;
  }
};

/**
 * This route handler enables Draft Mode and redirects to the given URL.
 */
export const GET: APIRoute = (event) => {
  const { url } = event;

  // Parse query string parameters
  const token = url.searchParams.get('token');
  const redirectUrl = url.searchParams.get('url');

  try {
    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    // Avoid open redirect vulnerabilities
    if (redirectUrl && isExternalOrInvalidUrl(redirectUrl, event.url.hostname)) {
      return invalidRequestResponse('URL must be relative!', 422);
    }

    enableDraftMode(event);
  } catch (error) {
    return handleUnexpectedError(error);
  }

  // If no redirect URL, just set the cookie and return a 204 no content
  if (!redirectUrl) {
    return new Response(null, { status: 204 });
  }

  return event.redirect(redirectUrl, 307);
};
