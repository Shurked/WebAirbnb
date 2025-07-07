import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  Star, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAccommodations } from '../hooks/useAccommodations';

// Mock host data - in a real app, this would come from your backend
const mockHostStats = {
  totalEarnings: 12450,
  monthlyEarnings: 2890,
  totalBookings: 47,
  monthlyBookings: 8,
  averageRating: 4.8,
  totalReviews: 156,
  occupancyRate: 78,
  responseRate: 95,
};

const mockHostListings = [
  {
    id: '1',
    title: 'Luxury Mountain Cabin',
    location: 'Aspen, Colorado',
    price: 150,
    status: 'active',
    bookings: 12,
    rating: 4.9,
    reviews: 127,
    earnings: 4200,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    title: 'Downtown Loft',
    location: 'Seattle, WA',
    price: 95,
    status: 'active',
    bookings: 8,
    rating: 4.6,
    reviews: 43,
    earnings: 2100,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '6',
    title: 'Cozy Beach House',
    location: 'Santa Monica, CA',
    price: 200,
    status: 'inactive',
    bookings: 15,
    rating: 4.7,
    reviews: 89,
    earnings: 6150,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HostDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'earnings'>('overview');

  if (!user || !user.isHost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Host Access Required</h2>
          <p className="text-gray-600 mb-6">You need to be a verified host to access this dashboard.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Become a Host
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-blue-100" />
            <TrendingUp className="h-5 w-5 text-blue-200" />
          </div>
          <div className="text-2xl font-bold mb-1">${mockHostStats.totalEarnings.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">Total Earnings</div>
          <div className="text-blue-200 text-xs mt-2">+${mockHostStats.monthlyEarnings} this month</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-green-100" />
            <TrendingUp className="h-5 w-5 text-green-200" />
          </div>
          <div className="text-2xl font-bold mb-1">{mockHostStats.totalBookings}</div>
          <div className="text-green-100 text-sm">Total Bookings</div>
          <div className="text-green-200 text-xs mt-2">+{mockHostStats.monthlyBookings} this month</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Star className="h-8 w-8 text-yellow-100" />
            <div className="text-yellow-200 text-xs">{mockHostStats.totalReviews} reviews</div>
          </div>
          <div className="text-2xl font-bold mb-1">{mockHostStats.averageRating}</div>
          <div className="text-yellow-100 text-sm">Average Rating</div>
          <div className="text-yellow-200 text-xs mt-2">Excellent performance</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-purple-100" />
            <div className="text-purple-200 text-xs">{mockHostStats.responseRate}% response</div>
          </div>
          <div className="text-2xl font-bold mb-1">{mockHostStats.occupancyRate}%</div>
          <div className="text-purple-100 text-sm">Occupancy Rate</div>
          <div className="text-purple-200 text-xs mt-2">Above average</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <Link to="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <img
                  src={`https://images.pexels.com/photos/${415829 + i}/pexels-photo-${415829 + i}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
                  alt="Guest"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Guest {i}</div>
                  <div className="text-sm text-gray-600">Luxury Mountain Cabin</div>
                  <div className="text-xs text-gray-500">Jan {15 + i} - Jan {18 + i}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${450 + i * 50}</div>
                  <div className="text-xs text-green-600">Confirmed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-8">{month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${60 + index * 8}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  ${(1200 + index * 200).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderListings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Your Listings</h3>
          <p className="text-gray-600">{mockHostListings.length} properties</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Listing</span>
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockHostListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                listing.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {listing.status}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{listing.title}</h4>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-600">Price/night</div>
                  <div className="font-semibold text-gray-900">${listing.price}</div>
                </div>
                <div>
                  <div className="text-gray-600">Bookings</div>
                  <div className="font-semibold text-gray-900">{listing.bookings}</div>
                </div>
                <div>
                  <div className="text-gray-600">Rating</div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{listing.rating}</span>
                    <span className="text-gray-500">({listing.reviews})</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Earnings</div>
                  <div className="font-semibold text-gray-900">${listing.earnings.toLocaleString()}</div>
                </div>
              </div>
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Manage Listing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'listings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Listings ({mockHostListings.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'earnings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Earnings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'listings' && renderListings()}
            {activeTab === 'bookings' && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bookings Management</h3>
                <p className="text-gray-600">Detailed booking management interface coming soon.</p>
              </div>
            )}
            {activeTab === 'earnings' && (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Earnings Analytics</h3>
                <p className="text-gray-600">Comprehensive earnings analytics coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}