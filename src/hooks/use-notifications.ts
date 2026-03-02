import { useState, useEffect } from 'react';

export type NotificationType =
  | 'session_completed'
  | 'session_unlocked'
  | 'teacher_unlocked'
  | 'booking_confirmed'
  | 'lesson_reminder'
  | 'achievement'
  | 'weekly_progress'
  | 'chat_tip'
  | 'streak_reminder'
  | 'call_confirmed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    session_completed: '🎯',
    session_unlocked: '🔓',
    teacher_unlocked: '👨‍🏫',
    booking_confirmed: '📅',
    lesson_reminder: '⏰',
    achievement: '🏅',
    weekly_progress: '📊',
    chat_tip: '💬',
    streak_reminder: '🔥',
    call_confirmed: '📞',
  };
  return icons[type];
}

export function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'agora mesmo';
  if (minutes < 60) return `há ${minutes} minuto${minutes === 1 ? '' : 's'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} hora${hours === 1 ? '' : 's'}`;
  const days = Math.floor(hours / 24);
  return `há ${days} dia${days === 1 ? '' : 's'}`;
}

const SEED_NOTIFICATIONS: Omit<Notification, 'id'>[] = [
  {
    type: 'session_completed',
    title: 'Sessão 2 Concluída!',
    description: 'Completaste a Sessão 2 com 88%!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    type: 'session_unlocked',
    title: 'Sessão 3 Desbloqueada!',
    description: 'A Sessão 3 está agora disponível para ti.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    type: 'streak_reminder',
    title: 'Mantém o teu Streak!',
    description: 'Faz uma sessão hoje para manter o teu streak em dia.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
  },
];

export function useNotifications(userId: string) {
  const storageKey = `voice3_notifications_${userId}`;

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (!userId) return [];
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored) as Notification[];
      } catch {
        // fall through to seed
      }
    }
    if (userId !== 'demo-student') {
      return [];
    }
    const seeded = SEED_NOTIFICATIONS.map((n, i) => ({
      ...n,
      id: `notif-seed-${i}`,
    }));
    localStorage.setItem(storageKey, JSON.stringify(seeded));
    return seeded;
  });

  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey, userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return { notifications, unreadCount, markRead, markAllRead, addNotification, clearAll };
}
