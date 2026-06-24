export const SESSION_SEATS_CACHE_PREFIX = 'session-seats:';
export const SESSION_SEATS_CACHE_TTL_SECONDS = 60;

export function getSessionSeatsCacheKey(sessionId: string): string {
  return `${SESSION_SEATS_CACHE_PREFIX}${sessionId}`;
}
