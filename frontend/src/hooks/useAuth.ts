import { useApp, User } from '../contexts/AppContext';
import api from '../api/axios';
import { useEffect } from 'react';

export function useAuth() {
  const { state, dispatch } = useApp();

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const res = await api.post<{
        token: string;
        email: string;
        name: string;
      }>('/auth/login', {
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem('token', data.token);

      dispatch({
        type: 'SET_USER',
        payload: {
          id: '', // si no lo devuelve el backend, lo dejas en blanco
          name: data.name,
          email: data.email,
          avatar: '',
          isHost: false, // lo actualizará fetchUser si está disponible
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const res = await api.post<{
        token: string;
        email: string;
        name: string;
        isHost?: boolean;
      }>('/auth/register', {
        name,
        email,
        password,
        isHost: false,
      });

      const data = res.data;

      localStorage.setItem('token', data.token);

      dispatch({
        type: 'SET_USER',
        payload: {
          id: '',
          name: data.name,
          email: data.email,
          avatar: '',
          isHost: data.isHost || false,
        },
      });
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUser = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.get('/auth/me');
      const data = res.data;
      dispatch({
        type: 'SET_USER',
        payload: {
          id: '', // si tienes id, agregar aquí
          name: data.name,
          email: data.email,
          avatar: '', // si tienes avatar, agregar
          isHost: data.isHost,
        },
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      dispatch({ type: 'SET_USER', payload: null }); // Si token inválido o error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (updatedData: { name: string; email: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await api.put('/auth/update', updatedData);

      // Actualizamos el estado local con la nueva info
      const updatedUser: User = {
        id: state.user?.id || '',
        name: updatedData.name,
        email: updatedData.email,
        avatar: state.user?.avatar || '',
        isHost: state.user?.isHost || false,
      };

      dispatch({
        type: 'SET_USER',
        payload: updatedUser,
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    fetchUser,
    updateUser,  // <-- Aquí agregamos updateUser
  };
}
