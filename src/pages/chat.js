import React, { useContext, useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../contex/ChatContext";
import Loading from "react-loading";
import "./chat.scss";
import { PuffLoader } from "react-spinners";
import { ClipLoader } from "react-spinners"; // Đảm bảo bạn import ClipLoader
import UserChat from "../components/chat/userChat";
import { AuthContext } from "../contex/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, userChatsError, isUserChatLoading, updateCurrentChat } =
    useContext(ChatContext);
  let [color, setColor] = useState("#36d7b7"); // Sửa giá trị màu




  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-item-start">
          <Stack className="message-box flex-grow-0 pe-3" gap={3}>
            {/* Hiệu ứng loading PuffLoader */}
            {isUserChatLoading && <PuffLoader color={color} />}
            {userChats?.map((chat, index) => {
              return (
                
                <div key={index} onClick={() =>updateCurrentChat(chat)}>
                  <UserChat chat={ chat } user = {user} />
                </div>
              )
            })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
      {/* Hiệu ứng loading ClipLoader */}
      <ClipLoader
        color={color}
        loading={isUserChatLoading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Container>
  );
};

export default Chat;
