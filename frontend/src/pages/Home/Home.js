import React, { useEffect } from "react";
import { Banner, Header } from "../../components/common";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * Renders the home page.
 */
const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  return (
    <>
      <Header />
      <Banner />
    </>
  );
};

export default Home;
