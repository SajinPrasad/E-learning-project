import React from "react";

import { Header } from "../../components/common";
import MentorProfileForm from "../../components/Profile/MentorProfileForm";
import { MentorLayout } from "../../components/Mentor";

const MentorProfilePage = () => {
  return (
    <MentorLayout>
      <MentorProfileForm />
    </MentorLayout>
  );
};

export default MentorProfilePage;
