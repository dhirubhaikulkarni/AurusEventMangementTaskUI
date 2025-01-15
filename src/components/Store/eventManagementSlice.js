import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();


export const getEvents = ({ page, limit, searchTerm, startDate, endDate }) => async dispatch => {
    await axios.get(`${process.env.REACT_APP_API_URL}/events/getEvents`, {
        params: {
            page, // Adds page as a query parameter
            limit, // Adds limit as a query parameter
            searchTerm,
            startDate,
            endDate
        }
    })
        .then(response => {
            debugger;
            dispatch(setEvents(response.data.result))
            dispatch(setTotalEvents(response.data.totalEvents))
        }).catch((e) => {
            dispatch(setEvents([]))
        })

};
export const getEventType = () => async dispatch => {
    await axios.get(`${process.env.REACT_APP_API_URL}/events/eventType`)
        .then(response => {
            dispatch(setEventType(response.data.filter(event => event.isActive)))
        }).catch((e) => {
            dispatch(setEventType([]))
        })

};
export const getUsers = () => async dispatch => {
    await axios.get(`${process.env.REACT_APP_API_URL}/events/usersDetails`)
        .then(response => {
            dispatch(setUsers(response.data))
        }).catch((e) => {
            dispatch(setUsers([]))
        })

};

export const createEvent = (title, selectedCategory, selectedUser, location, address, startDate, endDate, content) => async dispatch => {

    try {
        setLoading(true)
        await axios.post(`${process.env.REACT_APP_API_URL}/events/createEvent`, {
            title, selectedCategory, selectedUser, location, address, startDate, endDate, content
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch(setLoading(false))
                    dispatch(setSuccess('Event Created successfully!'));
                    history.push('/dashboard');
                    const timer = setTimeout(() => {
                        dispatch(setSuccess(null));
                    }, 1000);
                    // Clear timeout if the component is unmounted
                    return () => clearTimeout(timer);
                }
            }).catch((error) => {
                dispatch(setLoading(false))
                if (error.response && error.response.status === 400) {
                    dispatch(setError(error.response.data.message));
                } else {
                    dispatch(setError('Failed to create an event.'));
                }
            })

    } catch (error) {
        dispatch(setLoading(false))
        dispatch(setError('Event is not created due to some error, please try again'));
    }



};

export const updateEvent = (eventId, title, selectedCategory, selectedUser, location, address, startDate, endDate, content) => async dispatch => {
    try {
        dispatch(setLoading(true));
        await axios.put(`${process.env.REACT_APP_API_URL}/events/editEvent/${eventId}`, {
            title, selectedCategory, selectedUser, location, address, startDate, endDate, content
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch(setLoading(false));
                    dispatch(setSuccess('Post updated successfully!'));
                    const timer = setTimeout(() => {
                        dispatch(setSuccess(null));
                    }, 1000);
                    // Clear timeout if the component is unmounted
                    return () => clearTimeout(timer);
                }
            }).catch((error) => {
                dispatch(setLoading(false));
                dispatch(setError('Failed to Update Post.'));
            });
    } catch (error) {
        dispatch(setLoading(false));
        dispatch(setError('Failed to Update Post.'));
    }
};
export const deletePost = (ID) => async (dispatch) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/events/${ID}`)
            .then((response) => {
                if (response.status == 200) {
                    dispatch(setSuccess("Event Deleted Successfully"));
                    dispatch(getEvents())
                    const timer = setTimeout(() => {
                        dispatch(setSuccess(null));
                    }, 1000);
                    // Clear timeout if the component is unmounted
                    return () => clearTimeout(timer);

                }
                else {
                    dispatch(setError('Failed to Delete Post.'));
                }

            })
            .catch((error) => {
                dispatch(setError('Failed to Delete Post.'));
            });
    } catch (e) {
        return console.error(e.message);
    }
};

const initialState = {
    data: [],
    eventTypes: [],
    users: [],
    success: null,
    error: "",
    loading: false,
    totalEvents: 0


};

const eventManagementSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setEvents: (state, action) => {
            state.data = action.payload
        },
        setTotalEvents: (state, action) => {
            state.totalEvents = action.payload
        },
        setEventType: (state, action) => {
            state.eventTypes = action.payload
        },
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setSuccess: (state, action) => {
            state.success = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
});

export const {
    setEvents,
    setTotalEvents,
    setEventType,
    setUsers,
    setSuccess,
    setError,
    setLoading
} = eventManagementSlice.actions;

export default eventManagementSlice.reducer;

