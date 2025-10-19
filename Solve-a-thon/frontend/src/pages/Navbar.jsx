import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="backdrop-blur-xl h-16 fixed top-0 w-screen text-white flex gap-6 justify-start items-center px-4 text-xl font-semibold">
      <Link to="/home" className="hover:text-emerald-400 hover:underline">
        Home
      </Link>
      {/* <Link to="/list" className="hover:text-emerald-400 hover:underline">
        Ongoing Hackathons
      </Link> */}
      <Link to="/about" className="hover:text-emerald-400 hover:underline">
        About
      </Link>
      <Link to="/issues" className="hover:text-emerald-400 hover:underline">
        Issues
      </Link>
    </div>
  );
};

export default Navbar;
