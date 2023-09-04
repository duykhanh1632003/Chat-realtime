import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../contex/ChatContext";
import { baseUrl, getRequest } from "../ultils/services";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);
  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
      if (response.errCode === 1) {
        return;
      }
      const lastMessage = response.message[response.message?.length - 1];
      setLatestMessage(lastMessage);
    };
    getMessages();
  }, [newMessage, notifications,chat]);
	return {latestMessage}
};
