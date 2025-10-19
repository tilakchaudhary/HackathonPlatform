import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../Images/bg.jpeg";
// import Navbar from "./Navbar";

const Home = () => {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center gap-5 text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h1 className="text-7xl font-semibold text-center">
        Welcome to Hacklify
      </h1>

      <h2 className="text-3xl font-semibold text-center">
        Hackathons you shouldn't miss
      </h2>

      <Link to="/register">
        <button className="text-xl border border-white hover:bg-blue-700 transition-all duration-300 bg-transparent px-5 py-2 rounded-2xl">
          Register Now
        </button>
      </Link>
    </div>
  );
};

export default Home;
