// securityService.ts
// Handles API calls and business logic for security events

export function reportSecurityEvent(event: any): Promise<any> {
  // Only send in production
  if (process.env.NODE_ENV === 'production') {
    return fetch('/api/security/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': event.csrfToken || '',
      },
      body: JSON.stringify(event),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to report security event');
      }
      return response.json();
    });
  }
  return Promise.resolve(null);
}
