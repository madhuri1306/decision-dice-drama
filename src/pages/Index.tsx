
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-game-primary/10 to-background pt-16 pb-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-game-primary mb-6 animate-fade-in">
            Stop Arguing,
            <br /> 
            <span className="text-game-secondary">Start Deciding</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in">
            Make group decisions fun with randomized tiebreakers, dramatic reveals, and gamified voting.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {isAuthenticated ? (
              <>
                <Link to="/create-room">
                  <Button size="lg" className="bg-gradient-to-r from-game-primary to-game-secondary hover:opacity-90 transition-all">
                    Create Decision Room
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/join-room">
                  <Button size="lg" variant="outline">
                    Join Existing Room
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-game-primary to-game-secondary hover:opacity-90 transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 hover:shadow-xl rounded-xl transition-all">
              <div className="bg-game-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-game-primary">Create a Decision Room</h3>
              <p className="text-gray-600">
                Set up a room for your group decision, share the code or link with friends.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 hover:shadow-xl rounded-xl transition-all">
              <div className="bg-game-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-game-primary">Submit & Vote on Options</h3>
              <p className="text-gray-600">
                Everyone submits ideas and votes secretly on their preferred choice.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 hover:shadow-xl rounded-xl transition-all">
              <div className="bg-game-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-game-primary">Break Ties with Games</h3>
              <p className="text-gray-600">
                Let dice rolls, spinners, or coin flips dramatically break any ties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Friend Groups", desc: "Deciding where to eat or what to do" },
              { title: "Roommates", desc: "Assigning chores or picking a movie" },
              { title: "Coworkers", desc: "Choosing lunch spots or team activities" },
              { title: "Family", desc: "Vacation plans or weekend activities" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2 text-game-primary">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-game-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to End the Indecision?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your first decision room and invite friends to join the fun.
          </p>
          {isAuthenticated ? (
            <Link to="/create-room">
              <Button size="lg" className="bg-white text-game-primary hover:bg-gray-100">
                Create a Decision Room
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" className="bg-white text-game-primary hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
