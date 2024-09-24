import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Inbox = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hey, how are you?", sender: "other" },
    { text: "I'm good, thanks! How about you?", sender: "me" },
    { text: "I'm doing great, thanks for asking!", sender: "other" },
  ]);

  const [users] = useState([
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" },
    { id: 3, firstName: "Robert", lastName: "Brown" },
  ]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, sender: "me" }]);
      setMessage(""); // Clear the input box after sending
    }
  };

  return (
    <div className="m-10 mx-auto flex h-[78vh] w-5/6 rounded border border-gray-200">
      {/* User List */}
      <div className="w-1/4 overflow-y-auto bg-purple-50 p-4">
        <h2 className="mb-4 text-lg font-semibold">Chats</h2>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 hover:bg-indigo-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-lg font-bold text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <span className="text-md">
                {user.firstName} {user.lastName}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Message Box */}
      <div className="flex w-3/4 flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-theme-primary text-lg font-bold text-white">
            JD {/* Example profile initials */}
          </div>
          <span className="ml-4 text-lg font-semibold">John Doe</span>
        </div>

        {/* Chat Messages (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-4">
          <div className="mb-4 flex flex-col gap-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === "me"
                      ? "bg-theme-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
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
