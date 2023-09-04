import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../ultils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [userChatsError, setUserChatsError] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  console.log("notification", notifications);

  useEffect(() => {
    const newSocket = io("http://localhost:2000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;
    console.log("Check aaa", currentChat);
    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      console.log("isChat open", isChatOpen);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getRequest(`${baseUrl}/users`);
        if (response.error) {
          console.log("Error:", response.errMessage);
          return;
        }

        const pChats = response.user.filter((u) => {
          if (user && user._id === u._id) {
            return false;
          }

          const isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });

          return !isChatCreated;
        });

        setPotentialChats(pChats);
        setAllUsers(response.user);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUser();
  }, [user, userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatLoading(true);
        setUserChats([]);

        try {
          const response = await getRequest(`${baseUrl}/chats/${user._id}`);
          setIsUserChatLoading(false);

          if (response.error) {
            setUserChatsError(response.errMessage);
          } else {
            setUserChats(response.chats);
          }
        } catch (error) {
          console.error("Error fetching user chats:", error);
          setIsUserChatLoading(false);
        }
      }
    };

    getUserChats();
  }, [user, notifications]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(`${baseUrl}/chats`, {
      firstId: firstId,
      secondId: secondId,
    });
    if (response.errCode === 1) {
      return console.log("Error create chat", response.errMessage);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      try {
        const response = await getRequest(
          `${baseUrl}/messages/${currentChat._id}`
        );
        setIsMessagesLoading(false);

        if (response.errCode === 1) {
          return setMessagesError(response.errMessage);
        } else {
          setMessages(response.message);
        }
      } catch (error) {
        console.error("Error fetching user chats:", error);
        setIsUserChatLoading(false);
      }
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("you must type something......");

      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.errCode === 1) {
        return sendTextMessageError(response.errMessage);
      } else {
        setNewMessage(response.response);
      }
      setMessages((prev) => [...prev, response.response]);
      setTextMessage("");
    },
    []
  );


  const markAllNotificationsAdRead = useCallback(() => {
    const mNotifications = notifications.map((n) => {
      return{...n , isRead:true}
    })
    setNotifications(mNotifications)
  }, [])
  

  const markNotificationAsRead = useCallback((n, userChats , user , notifications) => {
     //find chat to open
    const desiredChat = userChats.find(chat => {
      const chatMembers = [user._id, n.senderId]
      const isDesiredChat = chat?.members.every(members => {
        return chatMembers.includes(members)
      })
      return isDesiredChat
    })

    //mark notice
    const mNotifications = notifications.map(el => {
      if (n.senderId === el.senderId) {
        return {
          ...n , isRead: true
        }
      }
      else {
        return el
      }
    })
    updateCurrentChat(desiredChat)
    setNotifications(mNotifications)
  }, [])
  
  const markThisUserNotificationsAsRead = useCallback((thisUsernotifications , notification) => {
    // mark

    const mNotifications = notifications.map(el => {
      let notification;
      thisUsernotifications.forEach(n => {
        if (n.senderId === el.senderId) {
          notification = {...n, isRead: true}
        }
        else {
          notification = el
        }
      })
      return notification
    })
    setNotifications(mNotifications)
  },[])

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAdRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
