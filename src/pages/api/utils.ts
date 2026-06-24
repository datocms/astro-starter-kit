import { ApiError } from '@datocms/cma-client';
import { serializeError } from 'serialize-error';

export function withCORS(responseInit?: ResponseInit): ResponseInit {
  return {
    ...responseInit,
    headers: {
      ...responseInit?.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
}

export function json(response: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(response), init);
}

export function handleUnexpectedError(error: unknown) {
  try {
    throw error;
  } catch (e) {
    console.error(e);
  }

  if (error instanceof ApiError) {
    return json(
      {
        success: false,
        error: error.message,
        request: error.request,
        response: error.response,
      },
      withCORS({ status: 500 }),
    );
  }

  return invalidRequestResponse(serializeError(error), 500);
}

export function invalidRequestResponse(error: unknown, status = 422) {
  return json(
    {
      success: false,
      error,
    },
    withCORS({ status }),
  );
}

export function successfulResponse(data?: unknown, status = 200) {
  return json(
    {
      success: true,
      data,
    },
    withCORS({ status }),
  );
}

/**
 * Guards against open redirect vulnerabilities.
 *
 * Rather than trying to enumerate every malicious pattern (`//evil.com`,
 * `HTTP://evil.com`, leading whitespace, backslashes, encodings, …), we resolve
 * the candidate against the current request's host and only accept it if it
 * stays on the same hostname. Anything that resolves elsewhere — or fails to
 * parse at all — is rejected.
 */
export function isSafeRedirectUrl(url: string, hostname: string): boolean {
  try {
    // The scheme is irrelevant here: we only compare hostnames.
    const parsed = new URL(url, `http://${hostname}`);
    return parsed.hostname === hostname;
  } catch {
    return false;
  }
}
