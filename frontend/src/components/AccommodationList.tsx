import React, { useEffect } from 'react';
import AccommodationCard from './AccommodationCard';
import { useAccommodations } from '../hooks/useAccommodations';

export default function AccommodationList() {
  const { accommodations, fetchAccommodations, isLoading } = useAccommodations();

  useEffect(() => {
    fetchAccommodations();
  }, []);

  if (isLoading) return <p>Cargando alojamientos...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accommodations.map(accommodation => (
        <AccommodationCard key={accommodation.id} accommodation={accommodation} />
      ))}
    </div>
  );
}
