import { useState, useEffect, useRef, useCallback } from 'react';

// Define message types for type safety
export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

// Custom hook for WebSocket connection
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    // Connect to the dedicated WebSocket server on port 5010
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Extract hostname without port
    const hostname = window.location.hostname;
    const wsUrl = `${protocol}//${hostname}:5010`;
    
    console.log('Attempting to connect to WebSocket server at:', wsUrl);
    
    // Add a short delay before connecting to ensure server is ready
    const connectTimeout = setTimeout(() => {
      try {
        // Create WebSocket instance
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        
        // Connection opened handler
        socket.addEventListener('open', () => {
          console.log('WebSocket connection established');
          setIsConnected(true);
        });

        // Message handler
        socket.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            console.log('WebSocket message received:', data);
            
            // Add to messages
            setMessages((prev) => [...prev, data]);
            
            // Handle different message types
            switch (data.type) {
              case 'NEW_USER':
                // Add notification for new user
                setNotifications((prev) => [...prev, data]);
                break;
              case 'USER_ACTIVITY':
                // Add notification for user activity
                setNotifications((prev) => [...prev, data]);
                break;
              case 'ONLINE_USERS':
                // Update online users list
                if (data.users && Array.isArray(data.users)) {
                  setOnlineUsers(data.users);
                }
                break;
              default:
                // Handle other message types as needed
                break;
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        // Connection error handler
        socket.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
        });

        // Connection closed handler
        socket.addEventListener('close', () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
        });
      } catch (err) {
        console.error('Error creating WebSocket connection:', err);
      }
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(connectTimeout);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  // Function to send message via WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Function to clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    messages,
    notifications,
    onlineUsers,
    sendMessage,
    clearNotifications
  };
};