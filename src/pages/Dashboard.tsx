
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import RoomCard from "@/components/RoomCard";
import { db } from "@/services/mockDatabase";
import { Room } from "@/models/types";

const Dashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const userRooms = await db.getRooms();
        setRooms(userRooms);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  return (
    <AuthLayout requiredAuth>
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-game-primary">My Decisions</h1>
              <p className="text-gray-600">Manage your decision rooms and see past decisions</p>
            </div>
            <div className="flex gap-3">
              <Link to="/create-room">
                <Button className="button-gradient">Create Room</Button>
              </Link>
              <Link to="/join-room">
                <Button variant="outline">Join Room</Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-xl text-game-primary font-medium animate-pulse-scale">Loading your decisions...</p>
            </div>
          ) : rooms.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No Decision Rooms Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first decision room or join an existing one.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/create-room">
                  <Button className="button-gradient">Create Room</Button>
                </Link>
                <Link to="/join-room">
                  <Button variant="outline">Join Room</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthLayout>
  );
};

export default Dashboard;
