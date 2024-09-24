import React from "react";
import { Header } from "../../components/common";
import { Inbox } from "../../components/Chat";

const InboxPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        <Inbox />
      </div>
    </div>
  );
};

export default InboxPage;
