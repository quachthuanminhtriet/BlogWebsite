import React, { useState } from 'react';
import { Button, Form, Image, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import APIs, { endpoints } from '../Configs/APIs';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const urlImg = "https://s3-alpha-sig.figma.com/img/0f30/b72e/7049e3ec6fc322f9eef4ef959fd24ca8?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MhW1oUNv1RPgdAenpWEiPeY0XrBj2TPrgKQzm7ZrkVyuLUv0mf0xNsb3C76aYdxsA1Mts~6ZxorcfDJ4bZ~yqb2HKAH3d2yjnnpBqAvpRibzQ2MOfBMyq0hPzg8NJw72nJHu4A3ZlSnPOia3wB~IKdykV7qla7FqevY4VnHmnqN4a5q5oANGjZOpub4FgeXhgoYnuqUeHHn4JlCoEhZYPooeIaeXuMijH9YQMXcNM2mWPAkxkK8nS-WSyYUooqblYanKp9Qxu~JTZBsJvQHiX9U6NVNUX-YRS~1puDXodi-Jt~GPXUWLbL5Lz-91X54XtwZ5X8xKiOvjD~nro56hWA__";

    const previousPage = location.state?.from || "/";

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        const loginData = {
            username: username,
            password: password,
        };

        try {
            const response = await APIs.post(endpoints['login'], loginData);
            cookie.save('access-token', response.data.access);
            navigate(previousPage, { replace: true });
        } catch (error) {
            setError('Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <header className="detailheader">
                <h1>LOGIN</h1>
            </header>
            <div className="loginform">
                <div className="image">
                    <Image src={urlImg} alt="Image Login" />
                </div>
                <div className="loginsubmit">
                    <div className="title">
                        <h2>Login</h2>
                        <p>Come here with me</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin} className="mt-4">
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="urlregister">
                            If you don't have an account? <Link to="/register">Register</Link>
                        </div>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Submit'}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
