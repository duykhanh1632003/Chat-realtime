import { useFetchRecipient } from "../../hooks/userFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/undraw_pic_profile_re_7g2h.svg";
import { useContext } from "react";
import { ChatContext } from "../../contex/ChatContext";
import { unreadNotificaitonsFunc } from "../../ultils/unreadNotification";
import { useFetchLatestMessage } from "../../hooks/useFetchMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);
  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificaitonsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(n => n.senderId === recipientUser?._id);
  const isOnline = onlineUsers?.some(u => u?.userId === recipientUser?._id);

  const truncateText = (text) => {
    if (text) {
      let shortText = text.substring(0, 20);

      if (text.length > 20) {
        shortText = shortText + "...";
      }
      return shortText;
    }
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-item-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserNotificationsAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="Avatar" height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications.length
            : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
