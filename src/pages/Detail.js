import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Detail.css'

const Detail = () => {
    const { id, type } = useParams();
    const navigate = Link();
    const [itemData, setItemData] = useState({});
    const nameRef = useRef(null);
    const secondParam = useRef(null);
    const isAuth = localStorage.getItem('isAuth');

    console.log("Detail component rendered with id:", id, "and type:", type);

    useEffect(() => {
        const loadItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/${type}/${id}`);
                setItemData(response.data);
                console.log(`Загруженный ${type}:`, response.data);
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        };

        loadItem();
    }, [id, type]);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.value = itemData.name || '';
        }

        if (secondParam.current) {
            secondParam.current.value = itemData[type === 'sensors' ? 'radius' : 'volume'] || '';
        }
    }, [itemData, type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedItem = {
            name: nameRef.current.value,
            ...(type === 'sensors' ? { radius: secondParam.current.value } : { volume: secondParam.current.value })
        };

        axios.put(`http://localhost:5000/${type}/${id}`, JSON.stringify(updatedItem), {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                setItemData(response.data);
                console.log(`Обновленный ${type}:`, response.data);
                navigate('/');
            })
            .catch(error => console.error("Ошибка обновления:", error));
    };

    if(!isAuth){
        return <Link to="/auth " />
    }

    return (
        <div className="detail-container">
            <h1>{`Редактирование ${type === 'extinguisher' ? 'огнетушителя' : 'датчика'}`}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Название:
                    <input type="text" ref={nameRef} required />
                </label>
                <br />
                <label>
                    {type === "sensors" ? "Радиус:" : "Объем:"}
                    <input type="number" ref={secondParam} required />
                </label>
                <br />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default Detail;
