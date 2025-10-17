import { CSRF_COOKIE_NAME } from './csrf'

export function getCsrfToken(): string {
  if (typeof document === 'undefined') {
    return ''
  }

  const cookies = document.cookie ? document.cookie.split('; ') : []
  for (const entry of cookies) {
    if (entry.startsWith(`${CSRF_COOKIE_NAME}=`)) {
      return entry.split('=')[1]
    }
  }
  return ''
}
