import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Award, Users } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AccommodationCard from '../components/AccommodationCard';
import { useAccommodations } from '../hooks/useAccommodations';

export default function Home() {
  const { accommodations, fetchAccommodations, isLoading } = useAccommodations();

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const featuredAccommodations = accommodations.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Beautiful accommodation"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra tu estancia perfecta
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Descubra alojamientos únicos en todo el mundo, desde acogedoras cabañas hasta villas de lujo.
            </p>
          </div>
          
          <div className="mt-12">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir StayHub?</h2>
            <p className="text-gray-600 text-lg">Experimente lo mejor en reserva de alojamiento</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Compass className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Explora</h3>
              <p className="text-gray-600">Descubra lugares únicos donde alojarse en todo el mundo</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguro y Protegido</h3>
              <p className="text-gray-600">Tus reservas y pagos están protegidos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad</h3>
              <p className="text-gray-600">Alojamientos seleccionados con reseñas verificadas</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comunidad</h3>
              <p className="text-gray-600">Únase a millones de viajeros de todo el mundo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Estancias Destacadas</h2>
            <p className="text-gray-600 text-lg">Alojamientos cuidadosamente seleccionados para tu próxima aventura</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAccommodations.map((accommodation) => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/accommodations"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Ver todos los Alojamientos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar tu viaje?</h2>
          <p className="text-xl text-blue-100 mb-8">Únete a miles de viajeros satisfechos</p>
          <Link
            to="/accommodations"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
          >
            Reserva tu estancia ahora
          </Link>
        </div>
      </section>
    </div>
  );
}