import React from "react";
import { Footer, Header } from "../../components/common";
import { Inbox } from "../../components/Chat";

const InboxPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        <Inbox />
      </div>
      <Footer />
    </div>
  );
};

export default InboxPage;
