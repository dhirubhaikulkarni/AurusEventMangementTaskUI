import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaList, FaPlus, FaUser } from 'react-icons/fa';

import useAuth from '../Auth/useAuth';
import Profile from './Profile/Profile';
import Login from '../Auth/Login';
import EventList from './Events/EventList';

const Dashboard = () => {
  const user = useAuth();
  if (!user) {
    return null;
  }

  return (
    <Container fluid className="h-100">
      <Row className='h-100'>
        <Col xs={2} className="bg-light sidebar shadow py-3">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard/events">
              <FaList /> All Events
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/add-event">
              <FaPlus /> Add New Event
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/profile">
              <FaUser /> Profile
            </Nav.Link>
          </Nav>
        </Col>
        <Col xs={10} className="content-area">
          <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="profile" element={<Profile />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
