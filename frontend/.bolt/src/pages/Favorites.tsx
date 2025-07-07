import React, { useState } from 'react';
import { Heart, MapPin, Star, Trash2, Share, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAccommodations } from '../hooks/useAccommodations';

// Mock favorites data - in a real app, this would come from your backend
const mockFavorites = [
  {
    id: '1',
    accommodationId: '1',
    userId: '1',
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    accommodationId: '3',
    userId: '1',
    dateAdded: '2024-01-10',
  },
];

export default function Favorites() {
  const { user } = useAuth();
  const { accommodations } = useAccommodations();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your favorites</h2>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const userFavorites = favorites.filter(fav => fav.userId === user.id);
  const favoriteAccommodations = accommodations.filter(acc => 
    userFavorites.some(fav => fav.accommodationId === acc.id)
  );

  const removeFavorite = (accommodationId: string) => {
    setFavorites(prev => prev.filter(fav => fav.accommodationId !== accommodationId));
  };

  const shareFavorite = (accommodation: any) => {
    if (navigator.share) {
      navigator.share({
        title: accommodation.title,
        text: `Check out this amazing place: ${accommodation.title}`,
        url: window.location.origin + `/accommodation/${accommodation.id}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin + `/accommodation/${accommodation.id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">
              {favoriteAccommodations.length} saved accommodation{favoriteAccommodations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {favoriteAccommodations.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1 w-4 h-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="space-y-1 w-4 h-4">
                    <div className="bg-current h-1 rounded-sm"></div>
                    <div className="bg-current h-1 rounded-sm"></div>
                    <div className="bg-current h-1 rounded-sm"></div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {favoriteAccommodations.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-pink-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-pink-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring and save accommodations you love. They'll appear here for easy access later.
            </p>
            <Link
              to="/accommodations"
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              Explore Accommodations
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {favoriteAccommodations.map((accommodation) => {
              const favorite = userFavorites.find(fav => fav.accommodationId === accommodation.id);
              
              if (viewMode === 'grid') {
                return (
                  <div key={accommodation.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="relative">
                      <Link to={`/accommodation/${accommodation.id}`}>
                        <img
                          src={accommodation.images[0]}
                          alt={accommodation.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => shareFavorite(accommodation)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                        >
                          <Share className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => removeFavorite(accommodation.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors group"
                        >
                          <Heart className="h-4 w-4 text-red-500 fill-current group-hover:text-red-600" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                        {accommodation.type}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{accommodation.rating}</span>
                          <span className="text-sm text-gray-500">({accommodation.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{accommodation.location}</span>
                        </div>
                      </div>
                      
                      <Link to={`/accommodation/${accommodation.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                          {accommodation.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-lg font-bold text-gray-900">${accommodation.price}</span>
                          <span className="text-gray-500 text-sm">/ night</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Added {new Date(favorite?.dateAdded || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={accommodation.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-64 h-48 md:h-32">
                        <Link to={`/accommodation/${accommodation.id}`}>
                          <img
                            src={accommodation.images[0]}
                            alt={accommodation.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-900">{accommodation.rating}</span>
                                <span className="text-sm text-gray-500">({accommodation.reviews})</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center space-x-1 text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span className="text-sm">{accommodation.location}</span>
                              </div>
                            </div>
                            
                            <Link to={`/accommodation/${accommodation.id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                {accommodation.title}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {accommodation.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline space-x-1">
                                <span className="text-xl font-bold text-gray-900">${accommodation.price}</span>
                                <span className="text-gray-500 text-sm">/ night</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                Added {new Date(favorite?.dateAdded || '').toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => shareFavorite(accommodation)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Share className="h-5 w-5" />
                            </button>
                            <Link
                              to={`/accommodation/${accommodation.id}`}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => removeFavorite(accommodation.id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}