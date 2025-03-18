import React, { useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegAndAuth.css'

const Login = () => {
    const [login, setLogin] = useState('');
    const [pswd, setPswd] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            //запрос на бд на проверку пароля
            const response = await axios.get(`http://localhost:5000/login?login=${login}&pswd=${pswd}`);
            if(response.data.length > 0){
                localStorage.setItem('isAuth', 'true');
                navigate('/home');
            }else{
                setError('Неверный логин или пароль');
            }
        } catch{
            setError('Ошибка входа');
            console.error('Ошибка входа: ', error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Вход</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Логин:
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={pswd}
                        onChange={(e) => setPswd(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Войти</button>
            </form>
            <p>
                Нет аккаунта? <a href="/reg">Зарегистрируйтесь</a>
            </p>
        </div>
    );
};

export default Login;
