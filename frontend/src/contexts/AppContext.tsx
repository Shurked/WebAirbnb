import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isHost: boolean;
}

interface Accommodation {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: number;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
}

interface Booking {
  id: string;
  accommodationId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppState {
  user: User | null;
  accommodations: Accommodation[];
  bookings: Booking[];
  searchQuery: string;
  searchLocation: string;
  searchGuests: number;
  searchCheckIn: string;
  searchCheckOut: string;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ACCOMMODATIONS'; payload: Accommodation[] }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_LOCATION'; payload: string }
  | { type: 'SET_SEARCH_GUESTS'; payload: number }
  | { type: 'SET_SEARCH_DATES'; payload: { checkIn: string; checkOut: string } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  accommodations: [],
  bookings: [],
  searchQuery: '',
  searchLocation: '',
  searchGuests: 1,
  searchCheckIn: '',
  searchCheckOut: '',
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ACCOMMODATIONS':
      return { ...state, accommodations: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_LOCATION':
      return { ...state, searchLocation: action.payload };
    case 'SET_SEARCH_GUESTS':
      return { ...state, searchGuests: action.payload };
    case 'SET_SEARCH_DATES':
      return { ...state, searchCheckIn: action.payload.checkIn, searchCheckOut: action.payload.checkOut };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}