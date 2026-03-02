import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications, getNotificationIcon, formatRelativeTime } from '@/hooks/use-notifications';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const NotificationPanel = ({ open, onClose, userId }: NotificationPanelProps) => {
  const { notifications, markRead, markAllRead } = useNotifications(userId);

  const handleItemClick = (id: string) => {
    markRead(id);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-[#1C1F26] border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
              <h2 className="text-white font-semibold text-base">Notificações</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#B89A5A] hover:text-[#B89A5A]/80 transition-colors"
                >
                  Marcar todas como lidas
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30 gap-2 py-12">
                  <span className="text-3xl">🔔</span>
                  <p className="text-sm">Sem notificações</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {notifications.map(n => (
                    <li
                      key={n.id}
                      onClick={() => handleItemClick(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        n.read
                          ? 'bg-transparent hover:bg-white/5'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {/* Unread dot */}
                      <div className="mt-1.5 shrink-0 w-2">
                        {!n.read && (
                          <span className="block w-2 h-2 rounded-full bg-[#B89A5A]" />
                        )}
                      </div>

                      {/* Emoji */}
                      <span className="text-xl shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-snug ${n.read ? 'text-white/60' : 'text-white'}`}>
                          {n.title}
                        </p>
                        <p className="text-sm text-white/60 mt-0.5 leading-snug">
                          {n.description}
                        </p>
                        <p className="text-xs text-white/30 mt-1">
                          {formatRelativeTime(n.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
