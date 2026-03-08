import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: 'bid',
        title: 'New Bid Placed',
        message: 'A new bid of A$1,100,000 has been placed on MIP-2024-001',
        time: 'about 4 hours ago',
        unread: true,
    },
    {
        id: 2,
        type: 'message',
        title: 'New Message',
        message: 'Sarah Mitchell sent you a message about MIP-2024-003',
        time: 'about 5 hours ago',
        unread: true,
    },
    {
        id: 3,
        type: 'alert',
        title: 'Auction Ending Soon',
        message: 'MIP-2024-002 auction ends in 30 minutes',
        time: 'about 7 hours ago',
        unread: false,
    },
    {
        id: 4,
        type: 'bid',
        title: 'Bid Outbid',
        message: 'Your bid on MIP-2024-001 has been outbid',
        time: '1 day ago',
        unread: false,
    },
    {
        id: 5,
        type: 'kyc',
        title: 'KYC Approved',
        message: 'Your KYC verification has been approved',
        time: '2 days ago',
        unread: false,
    },
    {
        id: 6,
        type: 'contract',
        title: 'Contract Ready for Signature',
        message: 'Contract for MIP-2024-005 is ready for your digital signature',
        time: '3 days ago',
        unread: true,
    },
    {
        id: 7,
        type: 'payment',
        title: 'Payment Received',
        message: 'Your payment of A$1,050,000 has been received and confirmed',
        time: '4 days ago',
        unread: false,
    }
];

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('brickbanq_notifications');
        return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    });

    // Persist to LocalStorage whenever changes occur
    useEffect(() => {
        localStorage.setItem('brickbanq_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((notification) => {
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

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, unread: false } : n
        ));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }, []);

    const deleteNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const deleteAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllRead,
            deleteNotification,
            deleteAllNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
