import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]); // Состояние для хранения данных

  // Функция для загрузки данных
  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setData(response.data); // Обновляем состояние данными с сервера
      console.log("Данные загружены:", response.data);
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция для удаления товара
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      console.log(`Товар ${id} удален`);
      // Обновляем состояние, удаляя товар из списка
      setData(prevData => prevData.filter(item => item.id !== id));
      console.log("Обновленные данные:", data);
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  return (
    <div>
      <h1>Список товаров</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <Link to={`/detail/${item.id}`}>{item.name}</Link>
            <button onClick={() => deleteItem(item.id)} style={{ marginLeft: "10px" }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <Link to="/add">Добавить товар</Link>
    </div>
  );
};

export default Home;