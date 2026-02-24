import instance from "./config.js";

async function getNotifications(unreadOnly = false) {
  return await instance.get("notifications", {
    params: { unreadOnly: unreadOnly ? "true" : "false" },
  });
}

async function getUnreadCount() {
  return await instance.get("notifications/unread-count");
}

async function markAsRead(notificationId) {
  return await instance.patch(`notifications/${notificationId}/read`);
}

async function markAllAsRead() {
  return await instance.patch("notifications/read-all");
}

async function deleteNotification(notificationId) {
  return await instance.delete(`notifications/${notificationId}`);
}

async function createTestNotification(type = null) {
  const data = type ? { type } : {};
  return await instance.post("notifications/test", data);
}

export { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, createTestNotification };
