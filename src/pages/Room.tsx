
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import { db } from "@/services/mockDatabase";
import { Room as RoomType, Option, TiebreakerType } from "@/models/types";
import { useAuth } from "@/context/AuthContext";
import Dice from "@/components/Dice";
import Spinner from "@/components/Spinner";
import Coin from "@/components/Coin";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [room, setRoom] = useState<RoomType | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newOptionText, setNewOptionText] = useState<string>("");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isClosingVoting, setIsClosingVoting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("options");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isTiebreaking, setIsTiebreaking] = useState<boolean>(false);
  const [tiebreakerType, setTiebreakerType] = useState<TiebreakerType | null>(null);
  const [tiedOptions, setTiedOptions] = useState<Option[]>([]);
  const [winningOption, setWinningOption] = useState<Option | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Load room data
  useEffect(() => {
    const loadRoomData = async () => {
      if (!roomId) return;
      
      try {
        const roomData = await db.getRoom(roomId);
        if (!roomData) {
          toast({
            title: "Room not found",
            description: "This room doesn't exist or you don't have access.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setRoom(roomData);
        setIsCreator(roomData.creatorId === user?.id);
        
        // Load options
        const optionsData = await db.getOptions(roomId);
        setOptions(optionsData);
        
        // Check if user has voted
        const userHasVoted = await db.hasVoted(roomId);
        setHasVoted(userHasVoted);
        
        // If room is closed, show results
        if (!roomData.isOpen) {
          setShowResults(true);
          findWinner(optionsData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load room data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoomData();
    
    // Poll for updates every 5 seconds
    const pollInterval = setInterval(() => {
      if (!isSubmitting && !isClosingVoting && !isTiebreaking) {
        loadRoomData();
      }
    }, 5000);
    
    return () => clearInterval(pollInterval);
  }, [roomId, navigate, toast, user]);
  
  // Create confetti effect
  useEffect(() => {
    if (showConfetti) {
      createConfetti();
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Handle adding a new option
  const handleAddOption = async () => {
    if (!newOptionText.trim() || !roomId || !room?.isOpen) return;
    
    setIsSubmitting(true);
    try {
      const newOption = await db.createOption({
        roomId,
        text: newOptionText.trim(),
      });
      
      setOptions([...options, newOption]);
      setNewOptionText("");
      
      toast({
        title: "Option Added",
        description: "Your option has been added to the list.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle voting for an option
  const handleVote = async () => {
    if (!selectedOption || !roomId || !room?.isOpen) return;
    
    setIsSubmitting(true);
    try {
      await db.vote(roomId, selectedOption);
      
      // Update local state
      setHasVoted(true);
      setShowResults(true);
      
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded.",
      });
      
      // Refresh options to get updated vote counts
      const updatedOptions = await db.getOptions(roomId);
      setOptions(updatedOptions);
      
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle closing voting
  const handleCloseVoting = async () => {
    if (!roomId || !room?.isOpen) return;
    
    setIsClosingVoting(true);
    try {
      await db.closeVoting(roomId);
      
      // Update local state
      setRoom({ ...room, isOpen: false });
      setShowResults(true);
      
      toast({
        title: "Voting Closed",
        description: "The voting has been closed.",
      });
      
      // Find the winner or determine if there's a tie
      findWinner(options);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsClosingVoting(false);
    }
  };
  
  // Find the winner or determine if there's a tie
  const findWinner = (currentOptions: Option[]) => {
    if (currentOptions.length === 0) return;
    
    // Sort options by votes (descending)
    const sortedOptions = [...currentOptions].sort((a, b) => b.votes - a.votes);
    const highestVoteCount = sortedOptions[0].votes;
    
    // Find all options with the highest vote count
    const optionsWithHighestVotes = sortedOptions.filter(
      (option) => option.votes === highestVoteCount
    );
    
    if (optionsWithHighestVotes.length > 1 && highestVoteCount > 0) {
      // We have a tie
      setTiedOptions(optionsWithHighestVotes);
    } else if (highestVoteCount > 0) {
      // We have a clear winner
      setWinningOption(sortedOptions[0]);
      setShowConfetti(true);
    }
  };
  
  // Handle starting a tiebreaker
  const handleStartTiebreaker = (type: TiebreakerType) => {
    setTiebreakerType(type);
    setIsTiebreaking(true);
    setActiveTab("tiebreaker");
  };
  
  // Handle completing a tiebreaker
  const handleTiebreakerComplete = async (winner: { id: string; text: string }) => {
    if (!roomId || !room) return;
    
    // Find the winning option
    const winningOptionObj = options.find(o => o.id === winner.id);
    if (!winningOptionObj) return;
    
    try {
      await db.createDecision({
        roomId,
        winningOptionId: winningOptionObj.id,
        tiebreaker: tiebreakerType || TiebreakerType.None,
      });
      
      setWinningOption(winningOptionObj);
      setShowConfetti(true);
      
      toast({
        title: "Decision Made!",
        description: `The winner is: ${winningOptionObj.text}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Create confetti effect
  const createConfetti = () => {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const colors = ['#8B5CF6', '#7E69AB', '#FFD700', '#F97316', '#22C55E'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Random position
      confetti.style.left = `${Math.random() * 100}%`;
      
      // Random size
      const size = `${Math.random() * 1 + 0.5}rem`;
      confetti.style.width = size;
      confetti.style.height = size;
      
      // Random color
      const colorIndex = Math.floor(Math.random() * colors.length);
      confetti.style.setProperty('--confetti-color', colors[colorIndex]);
      
      // Random fall duration and delay
      const fallDuration = `${Math.random() * 2 + 2}s`;
      const fallDelay = `${Math.random() * 1.5}s`;
      confetti.style.setProperty('--fall-duration', fallDuration);
      confetti.style.setProperty('--fall-delay', fallDelay);
      
      container.appendChild(confetti);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout requiredAuth>
        <MainLayout>
          <div className="container mx-auto py-12 px-4 text-center">
            <p className="text-xl text-game-primary animate-pulse-scale">
              Loading decision room...
            </p>
          </div>
        </MainLayout>
      </AuthLayout>
    );
  }

  if (!room) {
    return (
      <AuthLayout requiredAuth>
        <MainLayout>
          <div className="container mx-auto py-12 px-4 text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Room Not Found</h1>
            <p className="mb-6">
              The decision room you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="button-gradient"
            >
              Back to Dashboard
            </Button>
          </div>
        </MainLayout>
      </AuthLayout>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(room.code);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard.",
    });
  };

  // Sort options by votes (if results are visible)
  const sortedOptions = showResults
    ? [...options].sort((a, b) => b.votes - a.votes)
    : options;

  return (
    <AuthLayout requiredAuth>
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          {/* Room header */}
          <div className="bg-white rounded-xl shadow-md mb-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-game-primary">{room.title}</h1>
                <p className="text-gray-600 text-sm">Created {formatDate(room.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  room.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {room.isOpen ? 'Voting Open' : 'Voting Closed'}
                </div>
                {room.participants.length > 0 && (
                  <div className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                    {room.participants.length} Participants
                  </div>
                )}
              </div>
            </div>
            
            {room.description && (
              <p className="text-gray-700 mb-4">{room.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600">Invite with code:</span>
              <div className="flex items-center">
                <span className="font-mono font-medium bg-gray-100 py-1 px-2 rounded-md">
                  {room.code}
                </span>
                <Button variant="ghost" size="sm" onClick={copyInviteCode} className="ml-1">
                  Copy
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs for Options, Voting, and Results */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="options" disabled={isTiebreaking}>Options</TabsTrigger>
              <TabsTrigger value="voting" disabled={options.length === 0 || isTiebreaking}>Voting</TabsTrigger>
              <TabsTrigger value="tiebreaker" disabled={!tiedOptions.length && !winningOption}>
                {tiedOptions.length > 0 ? "Tiebreaker" : "Result"}
              </TabsTrigger>
            </TabsList>
            
            {/* Options Tab */}
            <TabsContent value="options" className="space-y-4">
              {room.isOpen && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-2">
                      <Input
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        placeholder="Add your suggestion..."
                        disabled={!room.isOpen || isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddOption();
                        }}
                      />
                      <Button
                        onClick={handleAddOption}
                        disabled={!newOptionText.trim() || !room.isOpen || isSubmitting}
                        className="button-gradient"
                      >
                        {isSubmitting ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Current Options</h2>
                {sortedOptions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No options added yet.</p>
                    {room.isOpen && (
                      <p className="mt-2 text-sm">Be the first to add an option!</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sortedOptions.map((option) => (
                      <div
                        key={option.id}
                        className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all"
                      >
                        <p className="font-medium">{option.text}</p>
                        {showResults && (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                            </span>
                            {winningOption?.id === option.id && (
                              <span className="text-sm font-semibold text-game-primary">Winner! 🎉</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {isCreator && room.isOpen && options.length >= 2 && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setActiveTab("voting")}
                    className="bg-game-secondary hover:bg-game-primary transition-colors"
                  >
                    Go to Voting
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Voting Tab */}
            <TabsContent value="voting" className="space-y-6">
              {room.isOpen ? (
                <>
                  {!hasVoted ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
                      <p className="text-gray-600 mb-6">
                        Select one option to vote. Your vote is anonymous.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {options.map((option) => (
                          <div
                            key={option.id}
                            className={`option-card ${
                              selectedOption === option.id ? "option-card-selected" : ""
                            }`}
                            onClick={() => setSelectedOption(option.id)}
                          >
                            <div className="flex items-center">
                              <div className="flex-1">
                                <p className="text-lg font-medium">{option.text}</p>
                              </div>
                              <div className="ml-4">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 ${
                                    selectedOption === option.id
                                      ? "border-game-primary bg-game-primary"
                                      : "border-gray-300"
                                  } flex items-center justify-center transition-all`}
                                >
                                  {selectedOption === option.id && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          onClick={handleVote}
                          disabled={!selectedOption || isSubmitting}
                          className="button-gradient"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Vote"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold mb-2 text-game-primary">Vote Submitted!</h2>
                      <p className="text-gray-600 mb-6">
                        Thanks for your vote. Results will be revealed when voting is closed.
                      </p>
                      
                      {isCreator && (
                        <Button
                          onClick={handleCloseVoting}
                          disabled={isClosingVoting}
                          className="button-gradient"
                        >
                          {isClosingVoting ? "Closing..." : "Close Voting & Show Results"}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2 text-game-primary">Voting Closed</h2>
                  <p className="text-gray-600 mb-4">
                    The voting for this decision has ended.
                  </p>
                  <Button
                    onClick={() => setActiveTab("tiebreaker")}
                    className="button-gradient"
                  >
                    View Results
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Tiebreaker/Results Tab */}
            <TabsContent value="tiebreaker" className="space-y-6">
              {tiedOptions.length > 0 && !winningOption ? (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-bold text-center mb-4 text-game-primary">It's a Tie!</h2>
                  <p className="text-center text-gray-600 mb-6">
                    {tiedOptions.length} options received {tiedOptions[0]?.votes} votes each.
                    {isCreator ? " Choose a tiebreaker method." : " Waiting for room creator to choose a tiebreaker."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {tiedOptions.map((option) => (
                      <div key={option.id} className="bg-game-primary/10 p-3 rounded-lg">
                        <p className="font-medium text-game-primary">{option.text}</p>
                        <p className="text-sm text-gray-600">{option.votes} votes</p>
                      </div>
                    ))}
                  </div>
                  
                  {isCreator && !isTiebreaking && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Choose a Tiebreaker:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Button 
                          onClick={() => handleStartTiebreaker(TiebreakerType.Dice)}
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90"
                        >
                          🎲 Dice Roll
                        </Button>
                        <Button 
                          onClick={() => handleStartTiebreaker(TiebreakerType.Spinner)}
                          className="bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90"
                        >
                          🎡 Spinner
                        </Button>
                        <Button 
                          onClick={() => handleStartTiebreaker(TiebreakerType.Coin)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                          disabled={tiedOptions.length !== 2}
                        >
                          🪙 Coin Flip
                        </Button>
                      </div>
                      {tiedOptions.length !== 2 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Coin flip requires exactly 2 tied options
                        </p>
                      )}
                    </div>
                  )}
                  
                  {isTiebreaking && (
                    <div className="flex flex-col items-center py-4">
                      <h3 className="text-xl font-semibold mb-6 text-center">
                        {tiebreakerType === TiebreakerType.Dice && "🎲 Rolling the Dice..."}
                        {tiebreakerType === TiebreakerType.Spinner && "🎡 Spinning the Wheel..."}
                        {tiebreakerType === TiebreakerType.Coin && "🪙 Flipping the Coin..."}
                      </h3>
                      
                      {tiebreakerType === TiebreakerType.Dice && (
                        <Dice 
                          autoRoll
                          onRollComplete={(value) => {
                            // Use the dice value to pick a winner
                            const winnerIndex = value % tiedOptions.length;
                            handleTiebreakerComplete({
                              id: tiedOptions[winnerIndex].id,
                              text: tiedOptions[winnerIndex].text,
                            });
                          }}
                        />
                      )}
                      
                      {tiebreakerType === TiebreakerType.Spinner && (
                        <Spinner
                          options={tiedOptions.map(option => ({ id: option.id, text: option.text }))}
                          autoSpin
                          onSpinComplete={(winner) => {
                            handleTiebreakerComplete(winner);
                          }}
                        />
                      )}
                      
                      {tiebreakerType === TiebreakerType.Coin && (
                        <Coin
                          options={tiedOptions.slice(0, 2).map(option => ({ id: option.id, text: option.text }))}
                          autoFlip
                          onFlipComplete={(winner) => {
                            handleTiebreakerComplete(winner);
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : winningOption ? (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <h2 className="text-3xl font-bold text-game-primary mb-2">Decision Made!</h2>
                  
                  <div className="bg-gradient-to-r from-game-primary to-game-secondary text-white p-6 my-6 rounded-xl shadow-md animate-bounce-in">
                    <p className="text-sm uppercase font-semibold opacity-80">The winner is</p>
                    <p className="text-3xl font-bold my-2">{winningOption.text}</p>
                    <p className="text-sm opacity-80">with {winningOption.votes} votes</p>
                  </div>
                  
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="button-gradient"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xl text-gray-600">No results yet. Vote to see the outcome!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Confetti container */}
        <div id="confetti-container" className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />
      </MainLayout>
    </AuthLayout>
  );
};

export default Room;
