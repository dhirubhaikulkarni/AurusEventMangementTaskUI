import React from 'react';
import { Container } from 'react-bootstrap';
import useAuth from '../../Auth/useAuth';

const EventList = () => {
    const user = useAuth();
    if (!user) {
        return null;
    }

    return (
        <Container className="py-4 h-100">
            This is event List
        </Container>
    );
};

export default EventList;