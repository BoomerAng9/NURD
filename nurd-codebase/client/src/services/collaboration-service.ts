/**
 * Collaboration Service for VIBE
 * Provides functions to create and join collaborative coding sessions
 */

/**
 * Interface for session creation request
 */
interface CreateSessionRequest {
  userId: string;
  userName: string;
  initialCode?: string;
}

/**
 * Interface for session join request
 */
interface JoinSessionRequest {
  sessionId: string;
  userId: string;
  userName: string;
}

/**
 * Interface for session data
 */
export interface SessionData {
  id: string;
  hostId: string;
  hostName: string;
  participants: Array<{
    id: string;
    name: string;
    isActive: boolean;
    lastActive: string;
  }>;
  code: string;
  createdAt: string;
}

/**
 * Generate a random session ID
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Create a new collaborative session
 */
export async function createSession(data: CreateSessionRequest): Promise<SessionData> {
  // In a real app, this would make an API call
  // For now, we'll simulate a successful response
  
  const sessionId = generateSessionId();
  const timestamp = new Date().toISOString();
  
  const session: SessionData = {
    id: sessionId,
    hostId: data.userId,
    hostName: data.userName,
    participants: [
      {
        id: data.userId,
        name: data.userName,
        isActive: true,
        lastActive: timestamp
      }
    ],
    code: data.initialCode || '',
    createdAt: timestamp
  };
  
  // Save session in localStorage for demo purposes
  localStorage.setItem(`vibe-session-${sessionId}`, JSON.stringify(session));
  
  return session;
}

/**
 * Join an existing collaborative session
 */
export async function joinSession(data: JoinSessionRequest): Promise<SessionData | null> {
  // In a real app, this would make an API call
  // For now, we'll get the session from localStorage
  
  const sessionData = localStorage.getItem(`vibe-session-${data.sessionId}`);
  
  if (!sessionData) {
    return null;
  }
  
  const session: SessionData = JSON.parse(sessionData);
  const timestamp = new Date().toISOString();
  
  // Add user to participants if they're not already there
  if (!session.participants.some(p => p.id === data.userId)) {
    session.participants.push({
      id: data.userId,
      name: data.userName,
      isActive: true,
      lastActive: timestamp
    });
  } else {
    // Update existing participant
    session.participants = session.participants.map(p => 
      p.id === data.userId ? { ...p, isActive: true, lastActive: timestamp } : p
    );
  }
  
  // Save updated session
  localStorage.setItem(`vibe-session-${data.sessionId}`, JSON.stringify(session));
  
  return session;
}

/**
 * Leave a collaborative session
 */
export async function leaveSession(sessionId: string, userId: string): Promise<void> {
  const sessionData = localStorage.getItem(`vibe-session-${sessionId}`);
  
  if (!sessionData) {
    return;
  }
  
  const session: SessionData = JSON.parse(sessionData);
  
  // Mark user as inactive
  session.participants = session.participants.map(p => 
    p.id === userId ? { ...p, isActive: false, lastActive: new Date().toISOString() } : p
  );
  
  // Save updated session
  localStorage.setItem(`vibe-session-${sessionId}`, JSON.stringify(session));
}

/**
 * Update code in a collaborative session
 */
export async function updateSessionCode(sessionId: string, userId: string, code: string): Promise<void> {
  const sessionData = localStorage.getItem(`vibe-session-${sessionId}`);
  
  if (!sessionData) {
    return;
  }
  
  const session: SessionData = JSON.parse(sessionData);
  
  // Update code and last active timestamp for user
  session.code = code;
  session.participants = session.participants.map(p => 
    p.id === userId ? { ...p, lastActive: new Date().toISOString() } : p
  );
  
  // Save updated session
  localStorage.setItem(`vibe-session-${sessionId}`, JSON.stringify(session));
}

/**
 * Get session data
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  const sessionData = localStorage.getItem(`vibe-session-${sessionId}`);
  
  if (!sessionData) {
    return null;
  }
  
  return JSON.parse(sessionData);
}

/**
 * Generate a shareable link for a session
 */
export function generateShareableLink(sessionId: string): string {
  // In a real app, this would generate a properly formatted URL
  return `${window.location.origin}/vibe?session=${sessionId}`;
}