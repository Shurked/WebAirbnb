import React, { useState } from 'react';
import { Search, MapPin, Users, Calendar, BedDouble, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAccommodations } from '../hooks/useAccommodations';

export default function SearchBar() {
  const { state, dispatch } = useApp();
  const { searchAccommodations } = useAccommodations();

  const [location, setLocation] = useState(state.searchLocation);
  const [guests, setGuests] = useState(state.searchGuests);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({ type: 'SET_SEARCH_LOCATION', payload: location });
    dispatch({ type: 'SET_SEARCH_GUESTS', payload: guests });

    searchAccommodations({
      location,
      guests,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
    });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg border p-2 flex items-center max-w-5xl mx-auto">
      {/* Location */}
      <div className="flex items-center space-x-2 px-4 py-2">
        <MapPin className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Lugar"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="text-sm border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Guests */}
      <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
        <Users className="h-5 w-5 text-gray-400" />
        <input
          type="number"
          placeholder="Personas"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="w-16 text-sm border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Bedrooms */}
      <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
        <BedDouble className="h-5 w-5 text-gray-400" />
        <input
          type="number"
          placeholder="Dormitorios"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="w-16 text-sm border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Min Price */}
      <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
        <DollarSign className="h-5 w-5 text-gray-400" />
        <input
          type="number"
          placeholder="Min $"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-20 text-sm border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Max Price */}
      <div className="flex items-center space-x-2 px-4 py-2 border-l border-gray-300">
        <DollarSign className="h-5 w-5 text-gray-400" />
        <input
          type="number"
          placeholder="Max $"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-20 text-sm border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Button */}
      <button type="submit" className="bg-blue-600 text-white p-3 rounded-full ml-2 hover:bg-blue-700">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
