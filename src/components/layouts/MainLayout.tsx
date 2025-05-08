
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  fullWidth = false 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className={`flex-1 ${fullWidth ? '' : 'container mx-auto px-4 py-6'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
