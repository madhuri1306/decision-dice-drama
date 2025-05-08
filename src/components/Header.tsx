
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/"
          className="text-2xl font-bold text-game-primary flex items-center"
        >
          <span className="mr-2">🎲</span> DiceyDecisions
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">My Decisions</Button>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-game-primary text-white">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-sm">{user?.name}</span>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-5 text-xs text-gray-500 block"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
