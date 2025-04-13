import React, { useState, useEffect } from "react";
import { BellIcon, CheckIcon, UserIcon, Activity, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket, WebSocketMessage } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Format timestamp
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get notification icon based on type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'NEW_USER':
      return <UserIcon className="h-5 w-5 text-blue-500" />;
    case 'USER_ACTIVITY':
      return <Activity className="h-5 w-5 text-green-500" />;
    default:
      return <BellIcon className="h-5 w-5 text-gray-500" />;
  }
};

// Format notification message
const formatNotificationMessage = (notification: WebSocketMessage): string => {
  switch (notification.type) {
    case 'NEW_USER':
      return `${notification.data.first_name} (${notification.data.username}) joined NURD!`;
    case 'USER_ACTIVITY':
      return notification.data.message || 'New activity detected';
    default:
      return notification.message || 'New notification';
  }
};

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const { notifications, clearNotifications, onlineUsers } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when new notifications arrive
  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  // Mark notifications as read when opened
  const handleOpenNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  // Handle clear all notifications
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearNotifications();
    setUnreadCount(0);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleOpenNotifications}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200"
          >
            <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-between">
              <h3 className="font-heading font-medium">Notifications</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/20 hover:bg-white/30 text-white rounded-full"
                  onClick={handleClearAll}
                >
                  <CheckIcon className="h-4 w-4" />
                  <span className="sr-only">Mark all as read</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/20 hover:bg-white/30 text-white rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No new notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0">
                      <div className="p-4 hover:bg-gray-50 transition-colors flex items-start">
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {formatNotificationMessage(notification)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(new Date())}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Online Users Section */}
            <div className="p-3 bg-gray-50">
              <h4 className="text-xs font-medium text-gray-500 mb-2">ONLINE USERS</h4>
              <div className="flex flex-wrap gap-1">
                {onlineUsers.length > 0 ? (
                  onlineUsers.map((user, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      <span className="text-xs">{user}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No users currently online</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};