import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './login.css';
import InputField from './inputField'; // reusable input field
import { toast } from 'react-toastify';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear the error message when the user starts typing
        if (error) setError('');
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents form default submission

        try {
            // Sending REST API request with username and password
            const response = await axios.post('http://5.180.148.40:9000/api/user-man/v1/user/validate', {
                username: formData.username,
                password: formData.password
            });
            console.log("response", response)
            // Checking if the response is successful
            if (response.status === 200) {
                const { access_token, refresh_token } = response.data; // Extract tokens from REST response

                // Set cookies for 1 day
                Cookies.set('accessToken', access_token, { expires: 10 });
                Cookies.set('refreshToken', refresh_token, { expires: 10 });

                // Navigate to the next page after successful login
                toast("You have successfully logged in");
                navigate('/cases');

            } else {
                // Handle errors when the response is not 200
                toast('An unexpected error has occurred. Please try again');
            }
        } catch (err) {
            // Error handling based on the type of error
            console.error('Error during login:', err);

            if (err.response) {

                toast(err.response?.data?.detail || 'Something went wrong. Please try again');

            } else if (err.request) {
                // No response from the server
                setError('No response from the server. Please check your connection.');
            } else {
                // Unknown error occurred
                setError('An unknown error occurred. Please try again.');
            }
        }
    };

    return (
        <Container fluid className="login-container">
            <Row className="login-row">
                <Col md={6} className="left-column">
                    <h1>DataSearch</h1>
                </Col>
                <Col md={6} className="right-column">
                    <Form className="login-form" onSubmit={handleLogin} >
                        <InputField
                            label="User Name *"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter Your Username"
                            controlId="Username"
                            autocomplete="off"
                            name="username"

                        />
                        <InputField
                            label="Password *"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Your Password"
                            // controlId="Username"
                            autocomplete="off"
                            name="password"

                        />
                        <div className="d-flex justify-content-between mt-2">
                            <a href="/forgotPassword" className="forgot-password-link">
                                Forgot Password?
                            </a>
                            <button type="submit" className="login-button">
                                Login
                            </button>
                        </div>
                        {error && <p className="error-text mt-3">{error}</p>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
