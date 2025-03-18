import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Импорт стилей

const Home = () => {
  const [dataExtin, setDataExtin] = useState([]);
  const [dataSensors, setDataSensors] = useState([]);
  const isAuth = localStorage.getItem('isAuth');

  const loadData = async () => {
    try {
      const responseExtinguisher = await axios.get("http://localhost:5000/extinguisher");
      const responseSensors = await axios.get("http://localhost:5000/sensors");

      setDataExtin(responseExtinguisher.data);
      setDataSensors(responseSensors.data);
      console.log("Данные о датчиках:", responseSensors.data);
      console.log("Данные об огнетушителях: ", responseExtinguisher.data);
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteItem = async (id, dataType) => {
    try {
      await axios.delete(`http://localhost:5000/${dataType}/${id}`);
      console.log(`Элемент ${id} удален из ${dataType}`);

      if (dataType === 'extinguisher') {
        setDataExtin(prevData => prevData.filter(item => item.id !== id));
      } else if (dataType === 'sensors') {
        setDataSensors(prevData => prevData.filter(item => item.id !== id));
      }

      console.log(`Обновленные данные для ${dataType}:`, dataType === 'extinguisher' ? dataExtin : dataSensors);
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  if(!isAuth){
    return <Link to="/ " />
  }

  return (
    <div className="home">
      <h1>Список активов предприятия</h1>
      <h2>Огнетушители</h2>
      {dataExtin.length === 0 ? (
        <h4>Огнетушители не обнаружены</h4>
      ) : (
        <ul>
          {dataExtin.map(item => (
            <li key={item.id}>
              <Link to={`/detail/extinguisher/${item.id}`}>{item.name}</Link>
              <button onClick={() => deleteItem(item.id, 'extinguisher')}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <h2>Датчики</h2>
      {dataSensors.length === 0 ? (
        <h4>Датчиков не обнаружено</h4>
      ) : (
        <ul>
          {dataSensors.map(item => (
            <li key={item.id}>
              <Link to={`/detail/sensors/${item.id}`}>{item.name}</Link>
              <button onClick={() => deleteItem(item.id, 'sensors')}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <Link to="/add" className="add-product-link">
        Добавить актив
      </Link>
      <Link to="/" className='exit-button'>
        Выход
      </Link>
    </div>
  );
};

export default Home;