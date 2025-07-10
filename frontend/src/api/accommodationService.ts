import api from './axios';

export interface AccommodationCard {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  mainImage: string;
  rating: number;
  reviews: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
}

export interface AccommodationDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: number;
  host: {
    // ajusta según UserProfileDto
    id: number;
    name: string;
    email: string;
  };
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
}

// Traer alojamientos destacados
export const getFeaturedAccommodations = async (): Promise<AccommodationCard[]> => {
  const response = await api.get('/accommodations/featured');
  return response.data;
};

// Buscar alojamientos con filtros
export const searchAccommodations = async (
  params: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
  }
): Promise<AccommodationCard[]> => {
  const response = await api.get('/accommodations/search', { params });
  return response.data;
};

// Traer detalles de un alojamiento
export const getAccommodationDetails = async (id: number): Promise<AccommodationDetail> => {
  const response = await api.get(`/accommodations/${id}`);
  return response.data;
};

// Crear un alojamiento
export const createAccommodation = async (data: Partial<AccommodationDetail>): Promise<AccommodationDetail> => {
  const response = await api.post('/accommodations', data);
  return response.data;
};

// Actualizar un alojamiento
export const updateAccommodation = async (id: number, data: Partial<AccommodationDetail>): Promise<AccommodationDetail> => {
  const response = await api.put(`/accommodations/${id}`, data);
  return response.data;
};

// Eliminar un alojamiento (desactivarlo)
export const deleteAccommodation = async (id: number): Promise<void> => {
  await api.delete(`/accommodations/${id}`);
};

// Activar alojamiento
export const activateAccommodation = async (id: number): Promise<void> => {
  await api.put(`/accommodations/${id}/activate`);
};

// Marcar alojamiento como destacado o no
export const setFeatured = async (id: number, featured: boolean): Promise<void> => {
  await api.put(`/accommodations/${id}/featured`, null, { params: { featured } });
};

// Añadir review
export const addReview = async (id: number, rating: number): Promise<void> => {
  await api.post(`/accommodations/${id}/review`, null, { params: { rating } });
};
