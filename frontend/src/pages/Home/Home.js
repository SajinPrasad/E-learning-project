import React from "react";

import { Banner, Header } from "../../components/common";
import HomeLayout from "../../components/Home/HomeLayout";

/**
 * Renders the home page.
 */
const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <HomeLayout />
    </>
  );
};

export default Home;
