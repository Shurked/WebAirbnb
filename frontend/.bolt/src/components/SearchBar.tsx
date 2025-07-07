import React, { useState } from 'react';
import { Search, MapPin, Users, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAccommodations } from '../hooks/useAccommodations';

export default function SearchBar() {
  const { state, dispatch } = useApp();
  const { searchAccommodations } = useAccommodations();
  const [location, setLocation] = useState(state.searchLocation);
  const [checkIn, setCheckIn] = useState(state.searchCheckIn);
  const [checkOut, setCheckOut] = useState(state.searchCheckOut);
  const [guests, setGuests] = useState(state.searchGuests);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH_LOCATION', payload: location });
    dispatch({ type: 'SET_SEARCH_DATES', payload: { checkIn, checkOut } });
    dispatch({ type: 'SET_SEARCH_GUESTS', payload: guests });
    searchAccommodations();
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center max-w-4xl mx-auto">
      <div className="flex-1 flex items-center space-x-4">
        {/* Location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 px-4 py-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Lugar</label>
              <input
                type="text"
                placeholder="Busca Lugares"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm text-gray-900 placeholder-gray-500 border-0 focus:ring-0 focus:outline-none p-0"
              />
            </div>
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Entrada</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none p-0"
              />
            </div>
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Salida</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none p-0"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
            <Users className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Cuántos?</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none p-0 bg-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} persona{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors ml-2"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}