import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const nameRef = useRef(null);
    const navigate = useNavigate();

    let newItemData = {}; // Локальная переменная для нового товара

    // Функция добавления товара
    const handleSubmit = (e) => {
        e.preventDefault();
        newItemData = {
            name: nameRef.current.value,
        };

        axios.post("http://localhost:5000/items", JSON.stringify(newItemData), {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                console.log("Добавленный товар:", response.data);
                navigate('/');
            })
            .catch(error => console.error("Ошибка создания:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Название:
                <input type="text" ref={nameRef} required />
            </label>
            <br />
            <button type="submit">Добавить</button>
        </form>
    );
};

export default Form;
