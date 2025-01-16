import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../Auth/useAuth';
import { Container, Row, Col, Card, Pagination, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deletePost, getEvents, getEventType } from '../../Store/eventManagementSlice.js';
import ConfirmationDialog from '../../Dialog/ConfirmationDialog.js';
import debounce from 'lodash.debounce'; // Install lodash if not already installed: npm install lodash
import { jwtDecode } from 'jwt-decode';

const EventList = () => {
    const dispatch = useDispatch();
    const user = useAuth();
    const events = useSelector((state) => state.event.data);
    const success = useSelector((state) => state.event.success);
    const totalEvents = useSelector((state) => state.event.totalEvents);

    const [removeID, setRemoveID] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [limit] = useState(10); // Items per page
    const [searchTerm, setSearchTerm] = useState(''); // For search by name
    const [startDate, setStartDate] = useState(''); // Start date filter
    const [endDate, setEndDate] = useState(''); // End date filter

    const token = JSON.parse(localStorage.getItem('jwt_token')); // Default to 'user' if not available
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role

    useEffect(() => {
        dispatch(getEventType());
        dispatch(getEvents({ page: currentPage, limit, searchTerm, startDate, endDate }));
    }, [dispatch, currentPage, limit, searchTerm, startDate, endDate]);

    useEffect(() => {
        if (success) {
            alert("Post Deleted Successfully");
        }
    }, [success]);

    const handleDelete = (eventID) => {
        setOpen(true);
        setRemoveID(eventID);
    };

    const handleClose = (newValue) => {
        setOpen(false);
        if (newValue) {
            dispatch(deletePost(removeID,{ page: currentPage, limit, searchTerm, startDate, endDate }));
        }
    };

    const handleSearch = debounce((value) => {
        setSearchTerm(value);
    }, 500);

    const totalPages = Math.ceil(totalEvents / limit);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Container className="pt-4 h-100">
            {/* Filters Section */}
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Search events by name"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Control
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Control
                        type="date"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Col>
                <Col md={2}>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setCurrentPage(1); // Reset to the first page
                            dispatch(getEvents({ page: 1, limit, searchTerm, startDate, endDate }));
                        }}
                    >
                        Apply Filters
                    </Button>
                </Col>
            </Row>

            {/* Event Cards */}
            <Row>
                {events.map((post) => (
                    <Col
                        key={post._id}
                        md={12}
                        className="d-flex justify-content-around mb-4 w-100"
                    >
                        <Card
                            style={{ width: '100%', height: 'auto' }}
                            className="border-0 shadow"
                        >
                            <div className="d-lg-flex p-3">
                                <Card.Img
                                    className="rounded-3 c-w-100 my-3 my-lg-0"
                                    style={{ width: '20%' }}
                                    variant="top"
                                    src="https://www.midlothiancenter.com/wp-content/uploads/2020/06/Event-management-Concept.-The.jpg"
                                />
                                <Card.Body className="p-0 px-lg-3 d-flex justify-content-between align-items-center w-100">
                                    <div className="w-100">
                                        <div className="row">
                                            <Card.Title className="col-9 col-lg-10 fs-3 fw-semibold">
                                            </Card.Title>
                                            {userRole === 'admin' && (
                                                <div className="col-3 col-lg-2 d-flex justify-content-end align-items-center">
                                                    <Link
                                                        to={`/dashboard/add-event/${post._id}`}
                                                        className="mx-3"
                                                    >
                                                        <FaEdit size={20} className="text-primary" />
                                                    </Link>
                                                    <FaTrash
                                                        size={20}
                                                        className="text-danger"
                                                        onClick={() => handleDelete(post._id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Event Name</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {post.title}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Event Type</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {post.categoryDetails.type}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Event For</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {post.userDetails.firstName} {post.userDetails.lastName}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Location</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {post.location}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Address</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {post.address}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Event Start Date</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {new Date(post.startDate).toLocaleString('en-US')}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Event End Date</strong>
                                            <div className="col-9 col-lg-10 text-nowrap">
                                                {new Date(post.endDate).toLocaleString('en-US')}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <strong className="col-3 col-lg-2 text-nowrap">Event Description</strong>
                                            <div className="col-9 col-lg-10 leading-tight whitespace-pre-wrap" dangerouslySetInnerHTML={{
                                                __html: post.content.replace(
                                                    /(<? *script)/gi,
                                                    "illegalscript"
                                                ),
                                            }}>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <Pagination>
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={open}
                text="Are You Sure You Want to Delete this post?"
                onClose={handleClose}
            />
        </Container>
    );
};

export default EventList;
