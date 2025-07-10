import { useState } from 'react';
import api from '../api/axios';

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de filtro
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
    guests: undefined,
    bedrooms: undefined,
    order: '' // futuro: rating, price, etc.
  });

  const fetchAccommodations = async (customFilters = filters) => {
    try {
      setIsLoading(true);

      const response = await api.get('/accommodations/search', {
        params: {
          location: customFilters.location || undefined,
          type: customFilters.type || undefined,
          minPrice: customFilters.minPrice || undefined,
          maxPrice: customFilters.maxPrice || undefined,
          guests: customFilters.guests || undefined,
          bedrooms: customFilters.bedrooms || undefined,
        },
      });

      setAccommodations(response.data);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchAccommodations = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchAccommodations(updatedFilters);
  };

  return { accommodations, isLoading, fetchAccommodations, searchAccommodations };
}
