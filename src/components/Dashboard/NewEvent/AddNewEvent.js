import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent, getEventType, getUsers, setError, updateEvent } from '../../Store/eventManagementSlice';

const NewEvent = () => {
    const { eventId } = useParams();  // Get eventId from route params
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    // const [error, setError] = useState('');

    const categories = useSelector(state => state.event.eventTypes);
    const users = useSelector(state => state.event.users);
    const events = useSelector(state => state.event.data);

    const loading = useSelector(state => state.event.loading);
    const error = useSelector(state => state.event.error);
    const success = useSelector(state => state.event.success);
    const navigate = useNavigate();

    const formatDate = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date);
        return formattedDate.toISOString().slice(0, 16); // Get the first 16 characters: `YYYY-MM-DDTHH:mm`
    };

    useEffect(() => {
        dispatch(getEventType());
        dispatch(getUsers());

        if (eventId && events.length > 0) {
            const post = events.find(post => post._id === eventId);
            if (post) {
                debugger;
                setTitle(post.title)
                setContent(post.content)
                setSelectedCategory(post.eventType)
                setSelectedUser(post.eventUser)
                setStartDate(formatDate(post.startDate));
                setEndDate(formatDate(post.endDate));
                setLocation(post.location)
                setAddress(post.address)
            }
        }
        else {
            setTitle('')
            setContent('')
            setSelectedCategory('')
            setSelectedUser('')
            setStartDate('')
            setEndDate('')
            setLocation('')
            setAddress('')
        }
    }, [dispatch, eventId, events]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const validateDates = (newEndDate) => {
        if (startDate && new Date(newEndDate) < new Date(startDate)) {
            dispatch(setError("End date must be greater than or equal to start date."));
        } else {
            dispatch(setError(''));
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        validateDates(newEndDate);
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();

        currentDate.setSeconds(0, 0);

        if (selectedDate < currentDate) {
            dispatch(setError("Start Date & Time cannot be in the past."));
        } else {
            setStartDate(e.target.value);
            dispatch(setError(''));
        }

    };

    function previousPage() {
        navigate("/dashboard")
    }
    function ClearAll() {
        setTitle('')
        setContent('')
        setSelectedCategory('')
        setSelectedUser('')
        setStartDate('')
        setEndDate('')
        setLocation('')
        setAddress('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error) {
            dispatch(setError("Please fullfill the requirement"));
        }
        else {
            if (eventId) {
                dispatch(updateEvent(eventId,title, selectedCategory, selectedUser, location, address, startDate, endDate, content));
            } else {
                dispatch(createEvent(title, selectedCategory, selectedUser, location, address, startDate, endDate, content))
            }

            ClearAll()
            dispatch(setError(""));
        }
    };

    return (
        <Container className="py-4 h-100">
            <div className='px-4 pt-3 pb-4 rounded-4 shadow'>
                <h2>{eventId ? 'Edit Event' : 'Add New Event'}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <Form.Group controlId="formBasicTitle" className="mt-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className="col-12 col-md-4">
                            <Form.Group controlId="formBasicCategories" className="mt-3">
                                <Form.Select id="exampleSelect" value={selectedCategory} onChange={handleCategoryChange}>
                                    <option value="" disabled>Select an Event Type</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.type}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="col-12 col-md-4">
                            <Form.Group controlId="formBasicCategories" className="mt-3">
                                <Form.Select id="exampleSelect" value={selectedUser} onChange={handleUserChange}>
                                    <option value="" disabled>Select an Event Type</option>
                                    {users.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.firstName} {category.lastName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    {/* Start Date Field */}
                    <div className="row">
                        <div className="col-12 col-md-3">
                            <Form.Group controlId="formBasicLocation" className="mt-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className="col-12 col-md-3">
                            <Form.Group controlId="formBasicAddress" className="mt-3">
                                <Form.Label>Location Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Location Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>

                        {/* Start Date Field */}

                        <div className="col-12 col-md-3">
                            <Form.Group controlId="formBasicStartDate" className="mt-3">
                                <Form.Label>Start Date & Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={startDate}
                                    // onChange={(e) => setStartDate(e.target.value)}
                                    onChange={handleDateChange}
                                    required
                                />
                            </Form.Group>
                        </div>

                        {/* End Date Field */}
                        <div className="col-12 col-md-3">
                            <Form.Group controlId="formBasicEndDate" className="mt-3">
                                <Form.Label>End Date & Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>



                    <Form.Group controlId="formBasicContent" className="mt-3">
                        <ReactQuill
                            className="quill-editor"
                            value={content}
                            onChange={setContent}
                            modules={{
                                toolbar: [
                                    [{ header: '1' }, { header: '2' }, { font: [] }],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ align: [] }],
                                    ['link', 'image'],
                                    ['clean'],
                                ],
                            }}
                            formats={[
                                'header',
                                'font',
                                'size',
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'blockquote',
                                'list',
                                'bullet',
                                'indent',
                                'link',
                                'image',
                                'align',
                            ]}
                            placeholder="Write your content here..."
                            style={{ height: 'auto', marginBottom: '20px' }}
                        />
                    </Form.Group>

                    <div className='d-flex justify-content-end'>
                        <Button onClick={previousPage} variant="secondary" type="button" className="mt-3 px-5 mx-3 rounded-pill">
                            Cancel
                        </Button>

                        <Button variant="primary" type="submit" className="mt-3 px-5 rounded-pill">
                            {loading ? <Spinner animation="border" size="sm" /> : eventId ? 'Update Event' : 'Add Event'}
                            {/* {eventId ? 'Update Post' : 'Add Post'} */}
                        </Button>
                    </div>
                </Form>

            </div >

        </Container >
    );
};

export default NewEvent;