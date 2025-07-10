import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyListings() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    images: '',
    amenities: '',
  });

  const [listings, setListings] = useState<any[]>([]);

  const fetchMyListings = async () => {
    try {
      const response = await api.get('/accommodations/my');
      setListings(response.data);
    } catch (error) {
      console.error('Error al cargar tus alojamientos', error);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        type: formData.type,
        maxGuests: parseInt(formData.maxGuests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        images: formData.images.split(',').map(s => s.trim()),
        amenities: formData.amenities.split(',').map(s => s.trim())
      };

      await api.post('/accommodations', payload);
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        type: '',
        maxGuests: '',
        bedrooms: '',
        bathrooms: '',
        images: '',
        amenities: '',
      });
      fetchMyListings(); // Actualiza la lista
    } catch (error: any) {
      console.error(error);
      alert('Error al crear alojamiento');
    }
  };

  const toggleActive = async (id: number) => {
    try {
      await api.put(`/accommodations/${id}/activate`);
      fetchMyListings();
    } catch (error) {
      console.error('Error al cambiar estado activo', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear nuevo alojamiento</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-4 rounded shadow">
        <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="price" type="number" min="0" placeholder="Precio por noche" value={formData.price} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="type" placeholder="Tipo (casa, depto...)" value={formData.type} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="maxGuests" type="number" min="1" placeholder="Máx. huéspedes" value={formData.maxGuests} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="bedrooms" type="number" min="0" placeholder="Dormitorios" value={formData.bedrooms} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="bathrooms" type="number" min="0" placeholder="Baños" value={formData.bathrooms} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="images" placeholder="URLs de imágenes (separadas por coma)" value={formData.images} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="amenities" placeholder="Comodidades (separadas por coma)" value={formData.amenities} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear Alojamiento</button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Mis alojamientos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((item) => (
          <div key={item.id} className="border rounded shadow p-4 bg-white">
            <img src={item.mainImage || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.location}</p>
            <p className="text-sm">S/. {item.price} / noche</p>
            <p className="text-sm">Rating: {item.rating} ⭐</p>
            <button
              className={`mt-2 px-4 py-1 rounded text-white font-semibold ${
                item.active ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={() => toggleActive(item.id)}
            >
              {item.active ? 'Activo (Click para desactivar)' : 'Inactivo (Click para activar)'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
