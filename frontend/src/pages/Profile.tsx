import React, { useState, useEffect } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, updateUser } = useAuth();  // <--- aquí traemos updateUser
  const [isEditing, setIsEditing] = useState(false);
  const [loadingHost, setLoadingHost] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);  // para mostrar carga guardado
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold">Inicia sesión para ver tu perfil</h2>
      </div>
    );
  }

  const toggleHost = async () => {
    setLoadingHost(true);
    try {
      await fetch('/auth/host/toggle', { method: 'PUT' }); // si usas api.put, usar esa
      alert('Estado host cambiado. Recarga la página para ver cambios.');
    } catch {
      alert('Error cambiando estado host');
    } finally {
      setLoadingHost(false);
    }
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      await updateUser(formData);  // <--- aquí llamamos al updateUser del hook
      setIsEditing(false);
    } catch {
      alert('Error actualizando datos');
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name || '', email: user.email || '' });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center space-x-6">
          <img
            src="https://randomuser.me/api/portraits/lego/1.jpg"
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />

          <div>
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-700">{user.email}</p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mb-2 w-full border rounded px-2 py-1"
                  disabled={loadingSave}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  disabled={loadingSave}
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Edit3 className="inline-block w-4 h-4 mr-1" />
              Editar
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={loadingSave}
              >
                <Save className="inline-block w-4 h-4 mr-1" />
                {loadingSave ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                disabled={loadingSave}
              >
                <X className="inline-block w-4 h-4 mr-1" />
                Cancelar
              </button>
            </>
          )}

          <button
            onClick={toggleHost}
            disabled={loadingHost}
            className={`ml-auto px-4 py-2 rounded text-white ${
              user.isHost ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loadingHost ? 'Cambiando...' : user.isHost ? 'Desactivar Host' : 'Activar Host'}
          </button>
        </div>
      </div>
    </div>
  );
}
