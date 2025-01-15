import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { ResetUser, getUser } from '../../src/components/Store/userSlice'
import { useNavigate } from 'react-router-dom';
export const Header = () => {

  //const user = useSelector(getUser);
  const user = localStorage.getItem('user');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('user');
    // Dispatch action to reset user state
    dispatch(ResetUser());
    navigate("/login")
  };

  const handleDasboard = () => {
    
    navigate("/dashboard")
  };


  return (
    <Navbar expand="lg" className='bg-primary px-4'>
      <Navbar.Brand className='fw-bold text-white'>AURUS EVENT MANAGEMENT</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">

        </Nav>
        <Nav className="ml-auto">
          {user ? (
            <>
              <Nav.Link onClick={handleDasboard}>
                <div className='text-white d-flex justify-content-center border border-white rounded-pill px-3 py-2'>
                  Dashboard
                </div>
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>
                <div className='text-white d-flex justify-content-center border border-white rounded-pill px-3 py-2'>
                  Logout
                </div>
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/login">
                <div className='text-white d-flex justify-content-center border border-white rounded-pill px-3 py-2'>
                  Login
                </div>
              </Nav.Link>
              <Nav.Link href="/signup">
                <div className='text-white d-flex justify-content-center border border-white rounded-pill px-3 py-2'>
                  Signup
                </div>
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
