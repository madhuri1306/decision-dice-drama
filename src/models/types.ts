
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Room {
  id: string;
  code: string;
  title: string;
  description?: string;
  creatorId: string;
  createdAt: Date;
  isOpen: boolean;
  maxParticipants?: number;
  participants: string[]; // user IDs
}

export interface Option {
  id: string;
  roomId: string;
  text: string;
  submittedBy: string; // user ID
  createdAt: Date;
  votes: number;
}

export interface Decision {
  id: string;
  roomId: string;
  winningOptionId: string;
  tiebreaker?: TiebreakerType;
  resolvedAt: Date;
}

export enum TiebreakerType {
  Dice = 'dice',
  Spinner = 'spinner',
  Coin = 'coin',
  None = 'none'
}

export interface Vote {
  userId: string;
  optionId: string;
  roomId: string;
  createdAt: Date;
}

// Current user context
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock data for development
export const generateMockId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const createMockUser = (name: string = "Test User"): User => {
  return {
    id: generateMockId(),
    name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
  };
};
