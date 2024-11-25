import React, { useState } from 'react';
import { Button, Form, Image, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import APIs, { endpoints } from '../Configs/APIs';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationality, setNationality] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const urlImg = "https://s3-alpha-sig.figma.com/img/0f30/b72e/7049e3ec6fc322f9eef4ef959fd24ca8?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MhW1oUNv1RPgdAenpWEiPeY0XrBj2TPrgKQzm7ZrkVyuLUv0mf0xNsb3C76aYdxsA1Mts~6ZxorcfDJ4bZ~yqb2HKAH3d2yjnnpBqAvpRibzQ2MOfBMyq0hPzg8NJw72nJHu4A3ZlSnPOia3wB~IKdykV7qla7FqevY4VnHmnqN4a5q5oANGjZOpub4FgeXhgoYnuqUeHHn4JlCoEhZYPooeIaeXuMijH9YQMXcNM2mWPAkxkK8nS-WSyYUooqblYanKp9Qxu~JTZBsJvQHiX9U6NVNUX-YRS~1puDXodi-Jt~GPXUWLbL5Lz-91X54XtwZ5X8xKiOvjD~nro56hWA__";

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        const registerData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username,
            password: password,
            birthday: birthDay,
            nationality: nationality,
            role: "viewer",
        };

        try {
            const response = await APIs.post(endpoints['register'], registerData);
            cookie.save('access-token', response.data.access, { path: '/' });
            navigate('/login');
        } catch (error) {
            setError('An error occurred during registration. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="register">
            <header className="detailheader">
                <h1>REGISTER</h1>
            </header>
            <div className="registerform">
                <div className="image">
                    <Image src={urlImg} alt="Image Register" />
                </div>
                <div className="registersubmit">
                    <div className="title">
                        <h2>Register</h2>
                        <p>Join us today!</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleRegister} className="mt-4">
                        <Form.Group className="mb-3" controlId="formUsername">
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

                        <div className='fullnameform'>
                            <Form.Group className="mb-3" controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 lastname" controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter Birthday"
                                value={birthDay}
                                onChange={(e) => setBirthDay(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Nationality</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Nationality"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="urlregister">
                            Already have an account? <Link to="/login">Login</Link>
                        </div>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Submit'}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
