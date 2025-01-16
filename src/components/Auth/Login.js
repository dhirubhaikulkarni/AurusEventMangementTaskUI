import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../Store/loginSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { decryptData, encryptData } from '../../security/crypto';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.login.loading);


  const handleSubmit = async (e) => {
    dispatch(setLoading(true));
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      dispatch(setLoading(false));
      return;
    }

    let data = { email, password }
    const encryptedData = encryptData(data);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { data: encryptedData });
      response.data = decryptData(response.data)
      if (response.data.error) {
        setError(response.data.error.message);
        dispatch(setLoading(false));
      } else {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('jwt_token', JSON.stringify(response.data.token));
        setError(null);
        navigate('/dashboard');
        dispatch(setLoading(false));
      }
    } catch (error) {
      setError('Invalid Credentials..');
      dispatch(setLoading(false));
    }
  };

  return (
    <Container className="h-100 mt-5">
      {loading && (
        <div className="spinner-overlay d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <div className="d-flex justify-content-center h-auto">

        <Col className="bg-primary-subtle p-4 rounded-4 shadow" xs={12} sm={9} md={6} lg={5} xl={4}>

          <div className='bg-primary w-100 rounded-4'>
            <img className='w-100 rounded-4' height={180} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzmvWwOZz4d-8L5DAz4Bhy1piaP0FkFdnpKg&s'>
            </img>
          </div>
          <h2 className='w-100 mt-3 text-center'>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className='mt-3'>

            <Form.Group controlId="formBasicEmail">
              <Form.Control className='rounded-pill'
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3 position-relative">
              <Form.Control
                className="rounded-pill"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="position-absolute end-0 top-50 translate-middle-y pe-3"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>

            <div className='d-flex justify-content-center'>
              <Button variant="primary" type="submit" className="mt-3 px-5 rounded-pill">
                Login
              </Button>
            </div>
            <hr className='w-100'></hr>
            <a className='d-flex justify-content-center mt-2' href='#'>
              Forgot password?
            </a>

            <div className='d-flex justify-content-center'>
              <a href='/signup'>
                <Button variant="primary" className="mt-3 px-5 rounded-pill">
                  Create an account
                </Button>
              </a>
            </div>

          </Form>
        </Col>
      </div>
    </Container>
  );
};

export default Login;
