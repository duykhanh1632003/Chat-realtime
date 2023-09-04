export const unreadNotificaitonsFunc= (notifications) => {
	return notifications.filter((n) => n.isRead === false)
}