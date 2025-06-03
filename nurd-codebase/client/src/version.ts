/**
 * NURD by ACHIEVEMOR Version Tracking
 * 
 * This file tracks version information for the application.
 * Increment the version number when making significant updates or deployments.
 */

export const VERSION = {
  number: '1.5.0', // Follow semantic versioning: MAJOR.MINOR.PATCH
  name: 'Pooler Premium',
  date: '2025-05-02',  // Current date in YYYY-MM-DD format
  notes: [
    'Added advanced subscription checkout page with multiple development tiers',
    'Created a dedicated NURD Initiative page with interactive learning paths',
    'Integrated Daytona, Modal, and Tavily services for enhanced AI capabilities',
    'Improved navigation with better organization of learning resources',
    'Added detailed program elements to the NURD Initiative page',
    'Enhanced mobile experience with optimized layouts'
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