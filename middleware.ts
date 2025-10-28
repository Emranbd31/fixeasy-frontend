
// This middleware is now a no-op so the homepage (/) is public.
// If you want to protect other routes, add them to the matcher and restore logic as needed.

export const config = {
	matcher: [], // No routes protected by middleware
};