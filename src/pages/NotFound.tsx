
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";

const NotFound: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-game-primary">404</h1>
          <p className="text-2xl font-semibold text-gray-600 mt-2">Page Not Found</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-gray-600 mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/">
            <Button className="button-gradient">
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-gray-500 text-sm">
          <p>Lost? Try checking the URL or starting from the home page.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
