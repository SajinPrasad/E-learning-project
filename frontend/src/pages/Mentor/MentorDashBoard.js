import React, { useEffect } from "react";
import { Header } from "../../components/common";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MentorDashBoard = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Header />
      This is mentor dashboard
    </div>
  );
};

export default MentorDashBoard;
