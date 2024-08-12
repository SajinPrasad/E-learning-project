import React, { useEffect } from "react";
import { Banner, Header } from "../../components/common";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * Renders the home page.
 */
const Home = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken]);
  return (
    <>
      <Header />
      <Banner />
    </>
  );
};

export default Home;
