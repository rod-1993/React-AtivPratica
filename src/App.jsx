
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { List } from './components';
import { favoritesActions } from './store/favorites';

function App() {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] =useState(false)

  const favorites = useSelector(({ favorites }) => favorites);

  const loadDetails = (items) => {
    const promises = items.map((item) => {
      return fetch(item.url).then((response) => response.json())
    });
    Promise.all(promises)
      .then((data) => {
        setLoading(false);  
        setItems(data);
      });
  }

  useEffect(() => {
    setLoading(true);
    // Inicialização
    const localData = localStorage.getItem('react-redux');
    if (localData) {
        const parsed = JSON.parse(localData);
        const { favorites } = parsed; 
        dispatch(favoritesActions.init(favorites));
    }

    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then((response) => {
          return response.json();
      })
      .then((data) => {
        const { results } = data;
        loadDetails(results);
      })
      .catch(() => {
        console.error('Error');
      });
  }, [dispatch]);

  const handleAddItem = useCallback((item) => {
    dispatch(favoritesActions.add(item));
  }, [dispatch]);

  const handleRemoveItem = useCallback((item) => {
    dispatch(favoritesActions.remove(item));
  }, [dispatch]);

  if (loading) {
    return <h1>Carregando...</h1>;  // Retorna a mensagem "Carregando..." na tela, enquanto carrega as imagens. Isso melhora a performance devido a não mostrar tela branca.
  }
  return (
    <div>
      <List 
        favorites={favorites}
        items={items}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default App;
