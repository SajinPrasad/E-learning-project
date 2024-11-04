import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getChatListService,
  getChatProfileService,
  getReceiverProfileService,
} from "../../services/chatServices/chatServices";
import { getInitialsService } from "../../services/userManagementServices/profileServices";

const Inbox = () => {
  const location = useLocation();
  const userId = location.state?.userId; // Retrieves the userId from the location state.
  const [receiverId, setReceiverId] = useState(userId); // Stores the ID of the receiver (chat partner).
  const [chatProfiles, setChatProfiles] = useState([]); // Holds a list of chat profiles (users available for chat).
  const [receiverProfile, setReceiverProfile] = useState({}); // Stores the profile details of the current receiver.
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const accessToken = useSelector((state) => state.auth.accessToken);
  const websocketRef = useRef(null); // Stores a reference to the WebSocket connection.
  const messageEndRef = useRef(null); // Ref to keep track of the end of the messages for automatic scrolling.
  const chatContainerRef = useRef(null); // Ref to the chat container for smooth scrolling.

  // Function to scroll the chat view to the bottom automatically.
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight; // Visible height of chat container.
      const maxScrollTop = scrollHeight - height; // Calculates the maximum scroll distance.
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0; // Scroll to the bottom of the container.
    }
  };

  // Effect to auto-scroll to the bottom whenever messages are updated.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to manage WebSocket connections and load messages/profile when `receiverId` changes.
  useEffect(() => {
    if (receiverId) {
      // Close the existing WebSocket connection if one already exists.
      if (websocketRef.current) {
        websocketRef.current.close();
      }

      // Create a new WebSocket connection to the chat server.
      websocketRef.current = new WebSocket(
        `ws://localhost:8000/ws/chat/${receiverId}/?token=${accessToken}`,
      );

      // Event handler for successful WebSocket connection.
      websocketRef.current.onopen = function (event) {
        console.log("Connected to WebSocket");
      };

      // Event handler for receiving messages via WebSocket.
      websocketRef.current.onmessage = function (event) {
        const data = JSON.parse(event.data); // Parse the incoming data as JSON.

        // Append the new message to the existing messages array.
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.message,
            sender: data.sender_id,
            receiver: data.receiver_id,
            timestamp: data.timestamp,
          },
        ]);
      };

      // Event handler for WebSocket disconnection.
      websocketRef.current.onclose = function (event) {
        console.log("Disconnected from WebSocket");
      };

      // Function to fetch receiver's profile information from the API.
      const fetchReceiverProfile = async () => {
        const fetchedReceiverProfile =
          await getReceiverProfileService(receiverId); // API call to get receiver's profile.
        setReceiverProfile(fetchedReceiverProfile); // Update the receiver profile in the state.
      };

      // Function to fetch chat messages between the current user and the receiver.
      const fetchMessages = async () => {
        const fetchedMessages = await getChatListService(receiverId); // API call to get chat messages.
        setMessages(
          fetchedMessages?.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp), // Sort the messages by timestamp.
          ),
        );
      };

      fetchReceiverProfile(); // Load receiver's profile.
      fetchMessages(); // Load chat messages.
    }

    // Cleanup: Close the WebSocket connection when the component unmounts or `receiverId` changes.
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [receiverId]);

  useEffect(() => {
    // Function to fetch chat profiles (users you can chat with) from the API.
    const fetchChatProfiles = async () => {
      const fetchedChatProfiles = await getChatProfileService();
      if (fetchedChatProfiles) {
        setChatProfiles(fetchedChatProfiles);
      }
    };

    fetchChatProfiles();
  }, []);

  // Function to handle sending a message.
  const handleSendMessage = async () => {
    if (message.trim() && websocketRef.current) {
      const messageData = {
        message: message.trim(), // Prepare the message content.
      };

      websocketRef.current.send(JSON.stringify(messageData)); // Send the message via WebSocket.
      setMessage(""); // Clear the message input after sending.
    }
  };

  return (
    <div className="m-10 mx-auto flex h-[78vh] w-5/6 rounded border border-gray-200">
      {/* User List */}
      <div className="w-1/4 overflow-y-auto bg-purple-50">
        <h2 className="border-b border-gray-300 px-4 py-[30px] text-lg font-semibold">
          Chats
        </h2>
        <ul>
          {chatProfiles.map((user) => (
            <li
              key={user.id}
              onClick={() => setReceiverId(user.user_id)}
              className={`flex cursor-pointer items-center gap-3 p-2 hover:bg-indigo-50 ${
                receiverId === user.user_id ? "bg-indigo-100" : ""
              }`}
            >
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {getInitialsService(user.full_name)}
                </div>
              )}
              <span className="text-md">{user.full_name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Message Box */}
      <div className="flex w-3/4 flex-col bg-white">
        {receiverId ? (
          <>
            {/* Chat Header */}
            {receiverProfile && (
              <div className="flex items-center border-b border-gray-200 p-4">
                {receiverProfile?.profile_picture ? (
                  <img
                    src={`${receiverProfile?.profile_picture}`}
                    className="mb-4 h-10 w-10 rounded-full border-2 border-gray-300 object-cover md:mb-0 md:h-14 md:w-14"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-theme-primary text-lg font-bold text-white md:h-14 md:w-14">
                    {getInitialsService(receiverProfile?.full_name)}
                  </div>
                )}
                <span className="ml-4 text-lg font-semibold">
                  {receiverProfile?.full_name}
                </span>
              </div>
            )}

            {/* Chat Messages (Scrollable) */}
            <div
              ref={chatContainerRef}
              className="flex-grow overflow-y-auto p-4"
            >
              <div className="mb-4 flex flex-col gap-4">
                {messages?.map((msg, index) => {
                  // Convert message timestamp to date and check if it's today's date
                  const messageDate = new Date(msg.timestamp);
                  const today = new Date();

                  // Helper function to format time
                  const formatTime = (date) => {
                    const hours = date.getHours().toString().padStart(2, "0");
                    const minutes = date
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    return `${hours}:${minutes}`;
                  };

                  // Check if the message date is the same as today
                  const isMessageToday =
                    messageDate.getDate() === today.getDate() &&
                    messageDate.getMonth() === today.getMonth() &&
                    messageDate.getFullYear() === today.getFullYear();

                  // Format date as "Today" or as a full date
                  const formattedDate = isMessageToday
                    ? "Today"
                    : messageDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                  // Check if this is the first message of the day or a different date
                  // than the previous message
                  const isFirstMessageOfDay =
                    index === 0 ||
                    new Date(
                      messages[index - 1].timestamp,
                    ).toLocaleDateString() !== messageDate.toLocaleDateString();

                  return (
                    <div key={index}>
                      {/* Display the date or "Today" in the center of the chat box */}
                      {isFirstMessageOfDay && (
                        <div className="mb-2 flex justify-center">
                          <div className="text-center text-xs text-gray-500">
                            {formattedDate}
                          </div>
                        </div>
                      )}

                      <div
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
                          {/* Display the time under each message */}
                          <p
                            className={`mt-1 text-right ${msg.sender === receiverId ? "text-gray-500" : "text-gray-200"}`}
                            style={{ fontSize: "10px" }}
                          >
                            {formatTime(messageDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messageEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex h-16 items-center border-t border-gray-200 p-4">
              <input
                type="text"
                className="mr-4 w-full max-w-lg rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="hover:bg-theme-primary-700 rounded bg-theme-primary px-4 py-2 font-bold text-white"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p className="text-lg">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
