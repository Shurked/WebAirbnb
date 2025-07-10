  import React, { useEffect } from 'react';
  import { Filter, Grid, List } from 'lucide-react';
  import SearchBar from '../components/SearchBar';
  import AccommodationCard from '../components/AccommodationCard';
  import { useAccommodations } from '../hooks/useAccommodations';

  export default function Accommodations() {
    const { accommodations, fetchAccommodations, isLoading } = useAccommodations();

    useEffect(() => {
      fetchAccommodations();
    }, []);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Search Section */}
        <section className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SearchBar />
          </div>
        </section>

        {/* Filters and Results */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {accommodations.length} estancias encontradas
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                </button>
                
                <div className="flex items-center space-x-2 border border-gray-300 rounded-lg">
                  <button className="p-2 hover:bg-gray-50 transition-colors">
                    <Grid className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 transition-colors">
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-64 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : accommodations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {accommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Grid className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No accommodations found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }