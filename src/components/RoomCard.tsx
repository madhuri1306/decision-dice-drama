
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room } from "@/models/types";
import { Link } from "react-router-dom";

interface RoomCardProps {
  room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <Card className="border-2 border-game-primary/10 hover:border-game-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg text-game-primary">{room.title}</CardTitle>
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${room.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {room.isOpen ? 'Open' : 'Closed'}
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {room.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground mb-2">
            <div>Created: {formatDate(room.createdAt)}</div>
            <div>Room Code: <span className="font-mono font-medium">{room.code}</span></div>
            <div>{room.participants.length} participants</div>
          </div>
          <Link to={`/room/${room.id}`}>
            <Button className="w-full button-gradient">
              {room.isOpen ? 'Enter Room' : 'View Results'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
