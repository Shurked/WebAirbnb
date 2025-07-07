import { useApp } from '../contexts/AppContext';

const mockAccommodations = [
  {
    id: '1',
    title: 'Cabaña de Lujo en la Montaña',
    description: 'Una hermosa cabaña en la montaña con vistas impresionantes y comodidades modernas. Perfecta para una escapada tranquila.',
    price: 150,
    location: 'Aspen, Colorado',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Cocina', 'Chimenea', 'Tina caliente', 'Vista a la montaña', 'Estacionamiento'],
    rating: 4.9,
    reviews: 127,
    hostId: '1',
    hostName: 'Sarah Johnson',
    hostAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Cabaña',
  },
  {
    id: '2',
    title: 'Apartamento Moderno en la Ciudad',
    description: 'Apartamento elegante en el corazón del centro con fácil acceso a restaurantes y atracciones.',
    price: 120,
    location: 'Nueva York, NY',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Cocina', 'Gimnasio', 'Conserje', 'Vista a la ciudad', 'Aire acondicionado'],
    rating: 4.7,
    reviews: 89,
    hostId: '2',
    hostName: 'Michael Chen',
    hostAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    type: 'Apartamento',
  },
  {
    id: '3',
    title: 'Villa Frente al Mar',
    description: 'Impresionante villa frente al mar con acceso privado a la playa y piscina infinita.',
    price: 300,
    location: 'Malibú, California',
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Cocina', 'Piscina', 'Acceso a la playa', 'Vista al mar', 'Estacionamiento', 'Parrilla'],
    rating: 5.0,
    reviews: 245,
    hostId: '3',
    hostName: 'Emma Rodriguez',
    hostAvatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    type: 'Villa',
  },
  {
    id: '4',
    title: 'Retiro Acogedor en el Bosque',
    description: 'Cabaña tranquila en el bosque rodeada de naturaleza, perfecta para senderismo y relajación.',
    price: 90,
    location: 'Portland, Oregón',
    images: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Cocina', 'Chimenea', 'Senderos para caminar', 'Vista al bosque', 'Se permiten mascotas'],
    rating: 4.8,
    reviews: 156,
    hostId: '4',
    hostName: 'David Kim',
    hostAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    type: 'Cabaña',
  },
];

export function useAccommodations() {
  const { state, dispatch } = useApp();

  const fetchAccommodations = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch({ type: 'SET_ACCOMMODATIONS', payload: mockAccommodations });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const searchAccommodations = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call with search
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredAccommodations = mockAccommodations;
    
    if (state.searchQuery) {
      filteredAccommodations = filteredAccommodations.filter(acc =>
        acc.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        acc.location.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }
    
    if (state.searchLocation) {
      filteredAccommodations = filteredAccommodations.filter(acc =>
        acc.location.toLowerCase().includes(state.searchLocation.toLowerCase())
      );
    }
    
    if (state.searchGuests > 1) {
      filteredAccommodations = filteredAccommodations.filter(acc =>
        acc.maxGuests >= state.searchGuests
      );
    }
    
    dispatch({ type: 'SET_ACCOMMODATIONS', payload: filteredAccommodations });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const getAccommodationById = (id: string) => {
    return state.accommodations.find(acc => acc.id === id);
  };

  return {
    accommodations: state.accommodations,
    isLoading: state.isLoading,
    fetchAccommodations,
    searchAccommodations,
    getAccommodationById,
  };
}