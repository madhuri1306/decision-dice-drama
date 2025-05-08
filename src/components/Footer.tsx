
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} DiceyDecisions - Make Group Decisions Fun!
        </p>
      </div>
    </footer>
  );
};

export default Footer;
