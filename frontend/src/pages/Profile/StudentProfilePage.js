import React from "react";

import { Footer, Header } from "../../components/common";
import { StudentProfileForm } from "../../components/Profile";

const StudentProfilePage = () => {
  return (
    <>
      <Header />
      <StudentProfileForm />
      <Footer />
    </>
  );
};

export default StudentProfilePage;
