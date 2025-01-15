import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../Auth/useAuth';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deletePost, getEvents, getEventType } from '../../Store/eventManagementSlice.js';
import ConfirmationDialog from '../../Dialog/ConfirmationDialog.js';

const EventList = () => {

    const dispatch = useDispatch();
    const user = useAuth();
    const events = useSelector(state => state.event.data);
    const success = useSelector((state) => state.event.success);
    const totalEvents = useSelector(state => state.event.totalEvents);

    // Define your state variables using useState unconditionally
    const [removeID, setRemoveID] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1); // Store the current page
    const [limit] = React.useState(10); // Items per page (you can adjust this as needed)
    // Get user role from localStorage (assuming user data has a role field)
    const userRole = JSON.parse(localStorage.getItem('user'))?.role || 'user'; // Default to 'user' if not available


    // The useEffect hook is called unconditionally
    useEffect(() => {
        dispatch(getEventType());
        dispatch(getEvents({ page: currentPage, limit }));
    }, [user, currentPage, limit]);

    useEffect(() => {
        if (success) {
            alert("Post Deleted Successfully")
        }
    }, [success]);

    // Conditional rendering happens after the hooks
    if (!user) {
        return null; // Or you could show a loading spinner, or an error message, etc.
    }

    const handleDelete = async (eventID) => {
        setOpen(true);
        setRemoveID(eventID);

    };

    const handleClose = (newValue) => {
        alert(removeID)
        setOpen(false);
        if (newValue) {
            dispatch(deletePost(removeID));
        }
    };


    // Pagination logic
    const totalPages = Math.ceil(totalEvents / limit);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Container className="pt-4 h-100">
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
                                                    {post.tiltle}
                                                </Card.Title>
                                                {userRole === 'admin' &&
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
                                                }
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
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages).keys()].map((page) => (
                        <Pagination.Item
                            key={page + 1}
                            active={page + 1 === currentPage}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
                <ConfirmationDialog
                    open={open}
                    text="Are You Sure You Want to Delete this post?"
                    onClose={handleClose}
                />
            </Container>
        </>
    );
};

export default EventList;