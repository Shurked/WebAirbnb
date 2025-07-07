import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useAccommodations } from '../hooks/useAccommodations';

export default function Bookings() {
  const { state } = useApp();
  const { user } = useAuth();
  const { getAccommodationById } = useAccommodations();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inicia Sesión para ver tus reservas</h2>
        </div>
      </div>
    );
  }

  const userBookings = state.bookings.filter(booking => booking.userId === user.id);
  const now = new Date();

  const upcomingBookings = userBookings.filter(booking => 
    new Date(booking.checkIn) > now && booking.status === 'confirmed'
  );
  
  const pastBookings = userBookings.filter(booking => 
    new Date(booking.checkOut) < now && booking.status === 'confirmed'
  );
  
  const cancelledBookings = userBookings.filter(booking => 
    booking.status === 'cancelled'
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBookings = (bookings: typeof userBookings) => {
    if (bookings.length === 0) {
      return (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron reservas</h3>
          <p className="text-gray-600">Cuando tengas reservas, aparecerán aquí.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {bookings.map((booking) => {
          const accommodation = getAccommodationById(booking.accommodationId);
          if (!accommodation) return null;

          const checkInDate = new Date(booking.checkIn);
          const checkOutDate = new Date(booking.checkOut);
          const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-48 h-48 md:h-auto">
                  <img
                    src={accommodation.images[0]}
                    alt={accommodation.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {accommodation.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{accommodation.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{booking.guests} persona{booking.guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span>Booking ID: {booking.id}</span>
                        <span className="mx-2">•</span>
                        <span>{nights} night{nights > 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${booking.totalPrice}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total paid
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                      
                      <div className="flex space-x-3">
                        {booking.status === 'confirmed' && new Date(booking.checkIn) > now && (
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Cancel Booking
                          </button>
                        )}
                        {booking.status === 'confirmed' && new Date(booking.checkOut) < now && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Administra tus alojamientos aquí</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Próximo ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pasado ({pastBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'cancelled'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelado ({cancelledBookings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upcoming' && renderBookings(upcomingBookings)}
            {activeTab === 'past' && renderBookings(pastBookings)}
            {activeTab === 'cancelled' && renderBookings(cancelledBookings)}
          </div>
        </div>
      </div>
    </div>
  );
}