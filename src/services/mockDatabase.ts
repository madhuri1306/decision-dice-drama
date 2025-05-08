import { User, Room, Option, Decision, Vote, TiebreakerType, generateMockId, createMockUser } from "../models/types";

// Mock users
const mockUsers: User[] = [
  createMockUser("Bob Smith"),
  createMockUser("Charlie Brown"),
  createMockUser("Diana Prince"),
  createMockUser("Evan Peters")
];

// Mock rooms
const mockRooms: Room[] = [
  {
    id: generateMockId(),
    code: "DINNER1",
    title: "Where to eat tonight?",
    description: "Hungry and can't decide where to go!",
    creatorId: mockUsers[0].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isOpen: true,
    participants: [mockUsers[0].id, mockUsers[1].id, mockUsers[2].id]
  },
  {
    id: generateMockId(),
    code: "MOVIE2",
    title: "Friday night movie",
    description: "What should we watch for movie night?",
    creatorId: mockUsers[1].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isOpen: false,
    participants: [mockUsers[1].id, mockUsers[2].id, mockUsers[3].id]
  },
  {
    id: generateMockId(),
    code: "CHORES",
    title: "Who cleans the bathroom?",
    description: "Weekly chore assignment",
    creatorId: mockUsers[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isOpen: false,
    participants: [mockUsers[0].id, mockUsers[2].id, mockUsers[3].id]
  }
];

// Mock options for the first room
const mockOptionsRoom1: Option[] = [
  {
    id: generateMockId(),
    roomId: mockRooms[0].id,
    text: "Pizza Palace",
    submittedBy: mockUsers[0].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
    votes: 1
  },
  {
    id: generateMockId(),
    roomId: mockRooms[0].id,
    text: "Burger Bonanza",
    submittedBy: mockUsers[1].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 28), // 28 minutes ago
    votes: 1
  },
  {
    id: generateMockId(),
    roomId: mockRooms[0].id,
    text: "Sushi Supreme",
    submittedBy: mockUsers[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 27), // 27 minutes ago
    votes: 1
  }
];

// Mock options for the second room
const mockOptionsRoom2: Option[] = [
  {
    id: generateMockId(),
    roomId: mockRooms[1].id,
    text: "The Avengers",
    submittedBy: mockUsers[1].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    votes: 2
  },
  {
    id: generateMockId(),
    roomId: mockRooms[1].id,
    text: "The Matrix",
    submittedBy: mockUsers[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 59), // 59 minutes ago
    votes: 0
  },
  {
    id: generateMockId(),
    roomId: mockRooms[1].id,
    text: "Inception",
    submittedBy: mockUsers[3].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 58), // 58 minutes ago
    votes: 1
  },
  {
    id: generateMockId(),
    roomId: mockRooms[1].id,
    text: "The Dark Knight",
    submittedBy: mockUsers[3].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 57), // 57 minutes ago
    votes: 1
  }
];

// Mock options for the third room
const mockOptionsRoom3: Option[] = [
  {
    id: generateMockId(),
    roomId: mockRooms[2].id,
    text: "Bob",
    submittedBy: mockUsers[0].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
    votes: 0
  },
  {
    id: generateMockId(),
    roomId: mockRooms[2].id,
    text: "Charlie",
    submittedBy: mockUsers[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
    votes: 1
  },
  {
    id: generateMockId(),
    roomId: mockRooms[2].id,
    text: "Evan",
    submittedBy: mockUsers[3].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
    votes: 2
  }
];

// Combine all options
const mockOptions: Option[] = [...mockOptionsRoom1, ...mockOptionsRoom2, ...mockOptionsRoom3];

// Mock decisions
const mockDecisions: Decision[] = [
  {
    id: generateMockId(),
    roomId: mockRooms[1].id,
    winningOptionId: mockOptionsRoom2[0].id, // The Avengers
    tiebreaker: TiebreakerType.None,
    resolvedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: generateMockId(),
    roomId: mockRooms[2].id,
    winningOptionId: mockOptionsRoom3[2].id, // Evan
    tiebreaker: TiebreakerType.Dice,
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 20) // 20 hours ago
  }
];

// Mock votes - updated to remove references to Alice
const mockVotes: Vote[] = [
  // Votes for Room 1
  {
    userId: mockUsers[0].id,
    optionId: mockOptionsRoom1[0].id,
    roomId: mockRooms[0].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
  },
  {
    userId: mockUsers[1].id,
    optionId: mockOptionsRoom1[1].id,
    roomId: mockRooms[0].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 24) // 24 minutes ago
  },
  {
    userId: mockUsers[2].id,
    optionId: mockOptionsRoom1[2].id,
    roomId: mockRooms[0].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 23) // 23 minutes ago
  },
  
  // Votes for Room 2
  {
    userId: mockUsers[1].id,
    optionId: mockOptionsRoom2[0].id,
    roomId: mockRooms[1].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 55) // 55 minutes ago
  },
  {
    userId: mockUsers[2].id,
    optionId: mockOptionsRoom2[0].id,
    roomId: mockRooms[1].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 54) // 54 minutes ago
  },
  {
    userId: mockUsers[3].id,
    optionId: mockOptionsRoom2[2].id,
    roomId: mockRooms[1].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 53) // 53 minutes ago
  },
  
  // Votes for Room 3
  {
    userId: mockUsers[0].id,
    optionId: mockOptionsRoom3[0].id,
    roomId: mockRooms[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21) // 21 hours ago
  },
  {
    userId: mockUsers[2].id,
    optionId: mockOptionsRoom3[2].id,
    roomId: mockRooms[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21) // 21 hours ago
  },
  {
    userId: mockUsers[3].id,
    optionId: mockOptionsRoom3[2].id,
    roomId: mockRooms[2].id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21) // 21 hours ago
  }
];

// Mock database service - we're keeping this simple since we're only focusing on UI
class MockDatabaseService {
  private users: User[] = [...mockUsers];
  private rooms: Room[] = [...mockRooms];
  private options: Option[] = [...mockOptions];
  private decisions: Decision[] = [...mockDecisions];
  private votes: Vote[] = [...mockVotes];
  private currentUser: User | null = mockUsers[0]; // Default to first user (Bob) for demo

  // User methods
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async login(email: string, password: string): Promise<User> {
    // In a real app, we would validate credentials
    const user = this.users.find(u => u.email === email);
    
    if (user) {
      this.currentUser = user;
      return user;
    }
    
    throw new Error("Invalid credentials");
  }

  async register(email: string, password: string, name: string): Promise<User> {
    // Check if user already exists
    if (this.users.some(u => u.email === email)) {
      throw new Error("User already exists");
    }
    
    const newUser: User = {
      id: generateMockId(),
      email,
      name
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    return newUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  // Room methods
  async getRooms(): Promise<Room[]> {
    // Return only rooms where the current user is a participant
    if (!this.currentUser) throw new Error("Not authenticated");
    
    return this.rooms.filter(room => 
      room.participants.includes(this.currentUser!.id)
    );
  }

  async getRoom(roomId: string): Promise<Room | null> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const room = this.rooms.find(r => r.id === roomId);
    
    if (!room || !room.participants.includes(this.currentUser!.id)) {
      return null;
    }
    
    return room;
  }

  async getRoomByCode(code: string): Promise<Room | null> {
    const room = this.rooms.find(r => r.code === code);
    return room || null;
  }

  async createRoom(roomData: Partial<Room>): Promise<Room> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const newRoom: Room = {
      id: generateMockId(),
      code: this.generateRoomCode(),
      title: roomData.title || "New Decision",
      description: roomData.description,
      creatorId: this.currentUser.id,
      createdAt: new Date(),
      isOpen: true,
      maxParticipants: roomData.maxParticipants,
      participants: [this.currentUser.id]
    };
    
    this.rooms.push(newRoom);
    return newRoom;
  }

  async joinRoom(code: string): Promise<Room> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const roomIndex = this.rooms.findIndex(r => r.code === code);
    
    if (roomIndex === -1) {
      throw new Error("Room not found");
    }
    
    const room = this.rooms[roomIndex];
    
    // Check if user is already a participant
    if (room.participants.includes(this.currentUser.id)) {
      return room;
    }
    
    // Check if room is full
    if (room.maxParticipants && room.participants.length >= room.maxParticipants) {
      throw new Error("Room is full");
    }
    
    // Add user to participants
    room.participants.push(this.currentUser.id);
    this.rooms[roomIndex] = room;
    
    return room;
  }

  async closeVoting(roomId: string): Promise<Room> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const roomIndex = this.rooms.findIndex(r => r.id === roomId);
    
    if (roomIndex === -1) {
      throw new Error("Room not found");
    }
    
    const room = this.rooms[roomIndex];
    
    // Ensure user is the room creator
    if (room.creatorId !== this.currentUser.id) {
      throw new Error("Not authorized");
    }
    
    room.isOpen = false;
    this.rooms[roomIndex] = room;
    
    return room;
  }

  // Option methods
  async getOptions(roomId: string): Promise<Option[]> {
    return this.options.filter(o => o.roomId === roomId);
  }

  async createOption(optionData: { roomId: string; text: string }): Promise<Option> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const room = await this.getRoom(optionData.roomId);
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    const newOption: Option = {
      id: generateMockId(),
      roomId: optionData.roomId,
      text: optionData.text,
      submittedBy: this.currentUser.id,
      createdAt: new Date(),
      votes: 0
    };
    
    this.options.push(newOption);
    return newOption;
  }

  // Vote methods
  async vote(roomId: string, optionId: string): Promise<void> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const room = await this.getRoom(roomId);
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    if (!room.isOpen) {
      throw new Error("Voting is closed");
    }
    
    // Check if user has already voted
    const existingVote = this.votes.find(
      v => v.userId === this.currentUser!.id && v.roomId === roomId
    );
    
    if (existingVote) {
      // Update existing vote
      const optionIndex = this.options.findIndex(o => o.id === existingVote.optionId);
      if (optionIndex !== -1) {
        this.options[optionIndex].votes--;
      }
      
      existingVote.optionId = optionId;
      existingVote.createdAt = new Date();
    } else {
      // Create new vote
      this.votes.push({
        userId: this.currentUser.id,
        optionId,
        roomId,
        createdAt: new Date()
      });
    }
    
    // Update option votes count
    const optionIndex = this.options.findIndex(o => o.id === optionId);
    if (optionIndex !== -1) {
      this.options[optionIndex].votes++;
    }
  }

  async hasVoted(roomId: string): Promise<boolean> {
    if (!this.currentUser) return false;
    
    return this.votes.some(
      v => v.userId === this.currentUser!.id && v.roomId === roomId
    );
  }

  // Decision methods
  async getDecisions(): Promise<Array<Decision & { room: Room; option: Option }>> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const userRooms = await this.getRooms();
    const roomIds = userRooms.map(room => room.id);
    
    return this.decisions
      .filter(d => roomIds.includes(d.roomId))
      .map(decision => {
        const room = this.rooms.find(r => r.id === decision.roomId)!;
        const option = this.options.find(o => o.id === decision.winningOptionId)!;
        
        return {
          ...decision,
          room,
          option
        };
      });
  }

  async createDecision(decisionData: { roomId: string; winningOptionId: string; tiebreaker?: TiebreakerType }): Promise<Decision> {
    if (!this.currentUser) throw new Error("Not authenticated");
    
    const room = await this.getRoom(decisionData.roomId);
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    if (room.creatorId !== this.currentUser.id) {
      throw new Error("Not authorized");
    }
    
    const newDecision: Decision = {
      id: generateMockId(),
      roomId: decisionData.roomId,
      winningOptionId: decisionData.winningOptionId,
      tiebreaker: decisionData.tiebreaker || TiebreakerType.None,
      resolvedAt: new Date()
    };
    
    this.decisions.push(newDecision);
    
    // Close the room
    const roomIndex = this.rooms.findIndex(r => r.id === decisionData.roomId);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].isOpen = false;
    }
    
    return newDecision;
  }

  // Helper methods
  private generateRoomCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    // Ensure code is unique
    if (this.rooms.some(room => room.code === code)) {
      return this.generateRoomCode();
    }
    
    return code;
  }

  async resolveRandomTiebreaker(
    roomId: string, 
    tiedOptions: Option[], 
    tiebreakerType: TiebreakerType
  ): Promise<Option> {
    // Simple random selection
    const randomIndex = Math.floor(Math.random() * tiedOptions.length);
    return tiedOptions[randomIndex];
  }
}

export const db = new MockDatabaseService();
