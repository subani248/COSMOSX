import { createContext, useContext, useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchFavorites();
    else setFavorites([]);
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await favoritesAPI.getAll();
      setFavorites(data);
    } catch {} finally { setLoading(false); }
  };

  const addFavorite = async (item) => {
    const { data } = await favoritesAPI.add(item);
    setFavorites((prev) => [data, ...prev]);
    return data;
  };

  const removeFavorite = async (id) => {
    await favoritesAPI.remove(id);
    setFavorites((prev) => prev.filter((f) => f._id !== id));
  };

  const isFavorite = (nasaId) => favorites.some((f) => f.nasaId === nasaId);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
