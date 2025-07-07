import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Users, Bed, Bath } from 'lucide-react';

interface AccommodationCardProps {
  accommodation: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    rating: number;
    reviews: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    type: string;
  };
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <Link to={`/accommodation/${accommodation.id}`}>
          <img
            src={accommodation.images[0]}
            alt={accommodation.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-700">
          {accommodation.type}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{accommodation.rating}</span>
            <span className="text-sm text-gray-500">({accommodation.reviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{accommodation.location}</span>
          </div>
        </div>
        
        <Link to={`/accommodation/${accommodation.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {accommodation.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {accommodation.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{accommodation.maxGuests}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4" />
              <span>{accommodation.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4" />
              <span>{accommodation.bathrooms}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">${accommodation.price}</span>
            <span className="text-gray-500 text-sm">/ noche</span>
          </div>
          <Link
            to={`/accommodation/${accommodation.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}