import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../Auth/useAuth';
import { Container, Row, Col, Card, Pagination, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { clearTimerMethod, deletePost, getEvents, getEventType, setSuccess } from '../../Store/eventManagementSlice.js';
import ConfirmationDialog from '../../Dialog/ConfirmationDialog.js';
import debounce from 'lodash.debounce';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
    const dispatch = useDispatch();
    const user = useAuth();
    const events = useSelector((state) => state.event.data);
    const success = useSelector((state) => state.event.success);
    const loading = useSelector((state) => state.event.loading);
    const redirection = useSelector((state) => state.event.redirection);
    const totalEvents = useSelector((state) => state.event.totalEvents);
    const navigate = useNavigate();
    const [removeID, setRemoveID] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [limit, setRecordsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState(''); // For search by name
    const [startDate, setStartDate] = useState(''); // Start date filter
    const [endDate, setEndDate] = useState(''); // End date filter
    const [expandedPostId, setExpandedPostId] = useState(null);
    const token = JSON.parse(localStorage.getItem('jwt_token')); // Default to 'user' if not available
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role

    useEffect(() => {
        dispatch(getEventType());
        dispatch(getEvents({ page: currentPage, limit, searchTerm, startDate, endDate }));
    }, [dispatch, currentPage, limit, searchTerm, startDate, endDate]);

    useEffect(() => {
        navigate('/dashboard');
    }, [success]);

    const handleDelete = (eventID) => {
        setOpen(true);
        setRemoveID(eventID);
    };

    const handleClose = (newValue) => {
        setOpen(false);
        if (newValue) {
            dispatch(deletePost(removeID, { page: currentPage, limit, searchTerm, startDate, endDate }));
        }
    };

    const handleSearch = debounce((value) => {
        setSearchTerm(value);
    }, 500);

    const totalPages = Math.ceil(totalEvents / limit);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle page size change
    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(e.target.value); // Update the records per page
        setCurrentPage(1);
    };



    const handleToggle = (postId) => {
        setExpandedPostId((prev) => (prev === postId ? null : postId));
    };

    const sanitizedContent = (content) =>
        content.replace(/(<? *script)/gi, "illegalscript");

    return (
        <Container className="pt-4 h-100">
            {loading && (
                <div className="spinner-overlay d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
            {success && <Alert variant="success">{success}</Alert>}
            <Row className="mb-4">
                <Col md={3}>
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
                <Col md={3}>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setSearchTerm('')
                            setStartDate('')
                            setEndDate('')
                        }}
                    >
                        Reset Filters
                    </Button>

                </Col>
            </Row>
            <Row >
                {events.length > 0 &&
                    <div className='d-flex flex-column flex-md-row me-4 mb-4'>
                        <div className="me-4 mb-3 mb-md-0 d-flex align-items-center" style={{ minWidth: '150px', height: '40px' }}>
                            <label htmlFor="limit">Records per page:</label>
                            <select
                                id="limit"
                                value={limit}
                                onChange={handleRecordsPerPageChange}
                                className="ml-2"
                            >
                                <option value={2}>2</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                        <Pagination className="mb-3 mb-md-0 d-flex align-items-center" style={{ minWidth: '150px', height: '40px' }}>
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
                    </div>
                }
            </Row>

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
                                    style={{ width: '20%', height: 'auto' }}
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
                                            <strong className="col-3 col-lg-2 text-nowrap">State</strong>
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
                                            <div key={post._id}
                                                className="col-9 col-lg-10 leading-tight whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        expandedPostId === post._id
                                                            ? sanitizedContent(post.content) +
                                                            ' <span class="text-primary cursor-pointer">less</span>'
                                                            : sanitizedContent(
                                                                post.content.length > 100
                                                                    ? post.content.substr(0, 100) +
                                                                    '... <span class="text-primary cursor-pointer">more</span>'
                                                                    : post.content
                                                            ),
                                                }}
                                                onClick={() => handleToggle(post._id)}
                                            />
                                        </div>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </Col>
                ))
                }
            </Row >

            <ConfirmationDialog
                open={open}
                text="Are You Sure You Want to Delete this post?"
                onClose={handleClose}
            />
        </Container >
    );
};

export default EventList;
