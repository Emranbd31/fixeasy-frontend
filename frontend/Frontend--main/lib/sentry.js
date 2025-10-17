export function initSentry() {
  if (typeof window === 'undefined') {
    return
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.info(
      '[Sentry]',
      'NEXT_PUBLIC_SENTRY_DSN detected but SDK is not installed in this environment.'
    )
  }
}
