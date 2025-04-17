/**
 * NURD by ACHIEVEMOR Version Tracking
 * 
 * This file tracks version information for the application.
 * Increment the version number when making significant updates or deployments.
 */

export const VERSION = {
  number: '1.2.0', // Follow semantic versioning: MAJOR.MINOR.PATCH
  name: 'Pooler Edition',
  date: '2025-04-17',  // Current date in YYYY-MM-DD format
  notes: [
    'Removed AI Code Tools page (will be reimplemented later with better model selection)',
    'Fixed social media thumbnail for link sharing',
    'Improved favicon implementation',
    'Added version tracking and update notification system'
  ]
};

/**
 * Version History
 * Keep track of significant releases
 */
export const VERSION_HISTORY = [
  {
    number: '1.0.0',
    name: 'Initial Launch',
    date: '2025-04-15',
    notes: ['First public release of NURD by ACHIEVEMOR platform']
  },
  {
    number: '1.1.0',
    name: 'Enhanced UI',
    date: '2025-04-16',
    notes: [
      'Added "Made in Pooler, GA" branding',
      'Implemented V.I.B.E. coding environment',
      'Added analytics dashboard'
    ]
  },
  VERSION // Current version
];

/**
 * Compare version numbers semantically (x.y.z format)
 * @param newVersion - New version to compare
 * @param oldVersion - Old version to compare against
 * @returns True if newVersion is newer than oldVersion
 */
export function isNewerVersion(newVersion: string, oldVersion: string): boolean {
  if (newVersion === oldVersion) return false;
  
  const newParts = newVersion.split('.').map(Number);
  const oldParts = oldVersion.split('.').map(Number);
  
  for (let i = 0; i < newParts.length; i++) {
    if (newParts[i] > (oldParts[i] || 0)) return true;
    if (newParts[i] < (oldParts[i] || 0)) return false;
  }
  
  return false;
}

/**
 * Check if the version has been updated
 * @returns True if this is a new version the user hasn't seen
 */
export function isNewVersion(): boolean {
  const lastSeenVersion = localStorage.getItem('nurd-last-seen-version') || '0.0.0';
  return isNewerVersion(VERSION.number, lastSeenVersion);
}

/**
 * Mark the current version as seen
 */
export function markVersionAsSeen(): void {
  localStorage.setItem('nurd-last-seen-version', VERSION.number);
}