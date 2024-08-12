import React, { useEffect } from "react";
import { Header } from "../../components/common";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MentorDashBoard = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  return (
    <div>
      <Header />
      This is mentor dashboard
    </div>
  );
};

export default MentorDashBoard;
