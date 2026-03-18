import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { notificationService } from '../api/dataService';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [];

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        const result = await notificationService.getNotifications();
        if (result.success) {
            setNotifications(result.data || []);
        }
        setLoading(false);
    }, []);

    // Initial fetch and periodic polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const addNotification = useCallback((notification) => {
        // Optimistically add notification (might be needed for local triggers)
        setNotifications(prev => [
            {
                id: Date.now(),
                unread: true,
                time: 'Just now',
                ...notification
            },
            ...prev
        ]);
    }, []);

    const markAsRead = useCallback(async (id) => {
        const result = await notificationService.markAsRead(id);
        if (result.success) {
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, unread: false } : n
            ));
        }
    }, []);

    const markAllRead = useCallback(async () => {
        const result = await notificationService.markAllAsRead();
        if (result.success) {
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        }
    }, []);

    const deleteNotification = useCallback(async (id) => {
        const result = await notificationService.deleteNotification(id);
        if (result.success) {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
    }, []);

    const deleteAllNotifications = useCallback(async () => {
        const result = await notificationService.deleteAllNotifications();
        if (result.success) {
            setNotifications([]);
        }
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            loading,
            unreadCount,
            addNotification,
            markAsRead,
            markAllRead,
            deleteNotification,
            deleteAllNotifications,
            refreshNotifications: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
