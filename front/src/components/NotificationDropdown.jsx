import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, Check, X, CheckCheck, Trash2, Film, Calendar, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, createTestNotification } from "../api/notifications.js";
import { MobileBottomDrawer } from "./MobileBottomDrawer.jsx";

function getNotificationIcon(type) {
  switch (type) {
    case "VIDEO_UPLOAD_APPROVED":
    case "FILM_VALIDATED":
      return { icon: Check, color: "text-emerald-400" };
    case "VIDEO_UPLOAD_REJECTED":
    case "FILM_REJECTED":
      return { icon: X, color: "text-red-400" };
    case "VIDEO_UPLOAD_FAILED":
      return { icon: AlertCircle, color: "text-yellow-400" };
    case "SELECTION_OFFICIELLE":
      return { icon: Film, color: "text-purple-400" };
    case "EVENT_REMINDER":
      return { icon: Calendar, color: "text-[#51A2FF]" };
    default:
      return { icon: Bell, color: "text-white/60" };
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = !!localStorage.getItem("token");

  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(false),
    enabled: isAuthenticated, // Ne charger que si connecté
    refetchInterval: isAuthenticated ? 30000 : false, // Poll toutes les 30 secondes si connecté
    retry: false,
    onError: (error) => {
      // Erreur silencieuse si l'utilisateur n'est pas connecté
      if (error.response?.status !== 401) {
        console.error("Error fetching notifications", error);
      }
    },
  });

  const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated, // Ne charger que si connecté
    refetchInterval: isAuthenticated ? 30000 : false,
    retry: false,
    onError: (error) => {
      // Erreur silencieuse si l'utilisateur n'est pas connecté
      if (error.response?.status !== 401) {
        console.error("Error fetching unread count", error);
      }
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const testNotificationMutation = useMutation({
    mutationFn: createTestNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.data?.count || 0;

  // Ne rien afficher si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notificationId);
  };

  const handleDelete = (notificationId, e) => {
    e.stopPropagation();
    deleteMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => testNotificationMutation.mutate()}
        disabled={testNotificationMutation.isPending}
        title="Créer une notification de test"
        className="text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
      >
        Test
      </button>
      {unreadCount > 0 && (
        <button
          onClick={handleMarkAllAsRead}
          disabled={markAllAsReadMutation.isPending}
          className="text-[10px] font-black uppercase tracking-widest text-[#51A2FF] hover:text-[#51A2FF]/80 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <CheckCheck className="w-3 h-3" />
          Tout marquer lu
        </button>
      )}
    </div>
  );

  const notificationsList = (
    <>
      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Aucune notification</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {notifications.map((notification) => {
            const { icon: Icon, color } = getNotificationIcon(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 hover:bg-white/5 transition-all group ${!notification.read ? "bg-white/[0.02]" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-black text-white">{notification.title || "Notification"}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#51A2FF] rounded-full shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-white/60 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#51A2FF] transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Marquer lu
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer group"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-black z-10"
          >
            <span className="text-[10px] font-black text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>
          </motion.div>
        )}
      </button>

      <MobileBottomDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        description="Ton centre de notifications"
        direction={isMobile ? "bottom" : "right"}
        maxWidthClassName="max-w-2xl md:max-w-md"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-end">{headerActions}</div>
        <div className={`${isMobile ? "max-h-[70vh]" : "h-[calc(100vh-116px)]"} overflow-y-auto pb-4`}>{notificationsList}</div>
      </MobileBottomDrawer>
    </div>
  );
}
