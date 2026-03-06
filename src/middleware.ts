import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  // Always serve the default locale when the URL
  // doesn't include an explicit locale prefix.
  localeDetection: false
});

export const config = {
  // Match all pathnames except for:
  // - paths that start with `/api`, `/_next` or `/_vercel`
  // - paths that start with `/og` or `/vcard` (non-localized route handlers)
  // - paths containing a dot (e.g. `favicon.ico`, `llms.txt`)
  matcher: '/((?!api|_next|_vercel|og|vcard|.*\\..*).*)'
};

