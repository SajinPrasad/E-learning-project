import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getChatListService,
  getChatProfileService,
  getReceiverProfileService,
  sendMessageService,
} from "../../services/chatServices/chatServices";

const Inbox = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [receiverId, setReceiverId] = useState(userId);
  const [chatProfiles, setChatProfiles] = useState([]);
  const [receiverProfile, setReceiverProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [users] = useState([
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" },
    { id: 3, firstName: "Robert", lastName: "Brown" },
  ]);

  useEffect(() => {
    if (receiverId) {
      const fetchReceiverProfile = async () => {
        const fetchedReceiverProfile =
          await getReceiverProfileService(receiverId);
        setReceiverProfile(fetchedReceiverProfile);
      };

      const fetchMessages = async () => {
        const fetchedMessages = await getChatListService(receiverId);
        setMessages(
          fetchedMessages?.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          ),
        ); // Sort by timestamp
      };

      fetchReceiverProfile();
      fetchMessages();
    }

    const fetchChatProfiles = async () => {
      const fetchedChatProfiles = await getChatProfileService();
      if (fetchedChatProfiles) {
        console.log("Fetched Profiles: ", fetchedChatProfiles);
        setChatProfiles(fetchedChatProfiles);
      }
    };

    fetchChatProfiles();
  }, [receiverId]);

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length < 2) return fullName.charAt(0);
    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);
    return `${firstInitial}${lastInitial}`;
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const response = await sendMessageService(receiverId, message);
      if (response) {
        const newMessage = {
          id: response.id, // Assuming response has the new message id
          message: response.message,
          sender: response.sender, // Assuming 'me' means the current user's id
          receiver: response.receiver,
          timestamp: response.timestamp,
        };
        setMessages((prevMessages) =>
          [...prevMessages, newMessage].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          ),
        ); // Sort again after adding the new message
        setMessage(""); // Clear the input
      }
    }
  };

  return (
    <div className="m-10 mx-auto flex h-[78vh] w-5/6 rounded border border-gray-200">
      {/* User List */}
      <div className="w-1/4 overflow-y-auto bg-purple-50">
        <h2 className="mb-4 border-b border-gray-300 p-4 text-lg font-semibold">
          Chats
        </h2>
        <ul>
          {chatProfiles.map((user) => (
            <li
              key={user.id}
              onClick={() => setReceiverId(user.user_id)}
              className="flex cursor-pointer items-center gap-3 p-2 hover:bg-indigo-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                {getInitials(user.full_name)}
              </div>
              <span className="text-md">{user.full_name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Message Box */}
      <div className="flex w-3/4 flex-col bg-white">
        {/* Chat Header */}
        {receiverProfile && (
          <div className="flex items-center border-b border-gray-200 p-4">
            {receiverProfile?.profile_picture ? (
              <img
                src={`http://localhost:8000/${receiverProfile?.profile_picture}`}
                alt={getInitials(receiverProfile?.full_name)}
                className="mb-4 h-14 w-14 rounded-full border-2 border-gray-300 object-cover md:mb-0"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-theme-primary text-lg font-bold text-white">
                {getInitials(receiverProfile?.full_name)}
              </div>
            )}

            <span className="ml-4 text-lg font-semibold">
              {receiverProfile?.full_name}
            </span>
          </div>
        )}

        {/* Chat Messages (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-4">
          <div className="mb-4 flex flex-col gap-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === receiverId ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === receiverId
                      ? "bg-gray-100 text-gray-900"
                      : "bg-theme-primary text-white"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Input (Fixed) */}
        <div className="flex h-16 items-center border-t border-gray-200 p-4">
          <input
            type="text"
            className="mr-4 w-full max-w-lg rounded-lg border border-gray-300 px-4 py-2"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="hover:bg-theme-primary-700 rounded bg-theme-primary px-4 py-2 font-bold text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
