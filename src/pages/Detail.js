import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itemData, setItemData] = useState({}); // Состояние для хранения данных товара
    const nameRef = useRef(null);

    // Загрузка данных товара при монтировании компонента
    useEffect(() => {
        const loadItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/items/${id}`);
                setItemData(response.data);
                console.log("Загруженный товар:", response.data);
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        };

        loadItem();
    }, [id]);

    // Обновление значения поля name при изменении itemData
    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.value = itemData.name || '';
        }
    }, [itemData]);

    // Функция обновления товара
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedItem = {
            name: nameRef.current.value,
        };

        axios.put(`http://localhost:5000/items/${id}`, JSON.stringify(updatedItem), {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                setItemData(response.data);
                console.log("Обновленный товар:", response.data);
                navigate('/');
            })
            .catch(error => console.error("Ошибка обновления:", error));
    };

    return (
        <div>
            <h1>Редактирование товара</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Название:
                    <input type="text" ref={nameRef} required />
                </label>
                <br />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default Detail;