import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Form.css'

const Form = () => {
    const nameRef = useRef(null); // ссылка на поле "Название"
    const typeRef = useRef(null); // ссылка на выпадающий список
    const volumeRef = useRef(null); // ссылка на поле "Объем" (для огнетушителей)
    const radiusRef = useRef(null); // ссылка на поле "Радиус действия" (для датчиков)
    const navigate = Link();
    const [selectedType, setSelectedType] = useState(''); // состояние для хранения выбранного типа
    var urlForPost = useRef(null);
    const isAuth = localStorage.getItem('isAuth');

    // функция для обработки отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        const newItemData = {
            name: nameRef.current.value, // значение из поля "Название"
        };
        
        // дополнительные поля в зависимости от выбранного типа
        if (selectedType === 'огнетушители') {
            newItemData.volume = volumeRef.current.value; // значение из поля "Объем"
            urlForPost = 'http://localhost:5000/extinguisher';
        } else if (selectedType === 'датчики') {
            newItemData.radius = radiusRef.current.value; // значение из поля "Радиус действия"
            urlForPost = 'http://localhost:5000/sensors';
        }

        // выполнение POST-запроса для добавления нового товара
        axios.post(urlForPost, JSON.stringify(newItemData), {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                console.log("Добавленный товар:", response.data);
                navigate('/home');
            })
            .catch(error => console.error("Ошибка создания:", error));
    };

    // функция для обработки изменения выбранного типа
    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    if(!isAuth){
        return <Link to="/auth " />
    }

    return (
        <div className="form-container">
            <h2>Добавить новый товар</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Тип:
                    <select ref={typeRef} onChange={handleTypeChange} required>
                        <option value="">Выберите тип</option>
                        <option value="огнетушители">Огнетушители</option>
                        <option value="датчики">Датчики</option>
                    </select>
                </label>
                <br />
                <label>
                    Название:
                    <input type="text" ref={nameRef} required />
                </label>
                <br />
                {selectedType === 'огнетушители' && (
                    <label>
                        Объем:
                        <input type="number" ref={volumeRef} required />
                    </label>
                )}
                {selectedType === 'датчики' && (
                    <label>
                        Радиус действия:
                        <input type="number" ref={radiusRef} required />
                    </label>
                )}
                <br />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default Form;