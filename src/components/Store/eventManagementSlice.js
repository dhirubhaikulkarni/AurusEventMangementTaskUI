import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createBrowserHistory } from 'history';
import { decryptData, encryptData } from '../../security/crypto';
export const history = createBrowserHistory();


export const getEvents = ({ page, limit, searchTerm, startDate, endDate }) => async dispatch => {
    await axios.get(`${process.env.REACT_APP_API_URL}/events`, {
        params: {
            page, // Adds page as a query parameter
            limit, // Adds limit as a query parameter
            searchTerm,
            startDate,
            endDate
        }
    })
        .then(response => {
            response.data = decryptData(response.data)
            dispatch(setEvents(response.data.result))
            dispatch(setTotalEvents(response.data.totalEvents))
            dispatch(clearTimerMethod());
        }).catch((e) => {
            dispatch(setEvents([]))
        })

};
export const getEventType = () => async dispatch => {
    await axios.get(`${process.env.REACT_APP_API_URL}/events/eventType`)
        .then(response => {
            response.data = decryptData(response.data)
            dispatch(setEventType(response.data.filter(event => event.isActive)))
            dispatch(clearTimerMethod());
        }).catch((e) => {
            dispatch(setEventType([]))
        })

};
export const getUsers = () => async dispatch => {
    await axios.get(`${process.env.REACT_APP_API_URL}/events/usersDetails`)
        .then(response => {
            response.data = decryptData(response.data)
            dispatch(setUsers(response.data))
            dispatch(clearTimerMethod());
        }).catch((e) => {
            dispatch(setUsers([]))
            dispatch(clearTimerMethod());
        })

};

export const clearTimerMethod = () => async dispatch => {
    const timer = setTimeout(() => {
        dispatch(setSuccess(null));
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);

};

export const createEvent = (title, selectedCategory, selectedUser, location, address, startDate, endDate, content) => async dispatch => {
    let data = { title, selectedCategory, selectedUser, location, address, startDate, endDate, content }
    try {
        setLoading(true)
        await axios.post(`${process.env.REACT_APP_API_URL}/events/createEvent`, {
            data: encryptData(data)
        })
            .then(response => {
                response.data = decryptData(response.data)
                if (response.status === 200) {
                    dispatch(setLoading(false))
                    dispatch(setSuccess(response.data.message));
                    dispatch(clearTimerMethod());
                }
            }).catch((error) => {
                dispatch(setLoading(false))
                if (error.response && error.response.status === 400) {
                    dispatch(setError(error.response.data.message));
                    dispatch(clearTimerMethod());
                } else {
                    dispatch(setError('Failed to create an event.'));
                    dispatch(clearTimerMethod());
                }
            })

    } catch (error) {
        dispatch(setLoading(false))
        dispatch(setError('Event is not created due to some error, please try again'));
        dispatch(clearTimerMethod());
    }



};

export const updateEvent = (eventId, title, selectedCategory, selectedUser, location, address, startDate, endDate, content) => async dispatch => {
    try {
        let data = { title, selectedCategory, selectedUser, location, address, startDate, endDate, content }
        dispatch(setLoading(true));
        await axios.put(`${process.env.REACT_APP_API_URL}/events/editEvent/${eventId}`, {
            data: encryptData(data)
        })
            .then(response => {
                response.data = decryptData(response.data)
                if (response.status === 200) {
                    dispatch(setLoading(false));
                    dispatch(setSuccess(response.data.message));
                    dispatch(clearTimerMethod());
                }
            }).catch((error) => {
                dispatch(setLoading(false));
                dispatch(setError('Failed to Update Post.'));
                dispatch(clearTimerMethod());
            });
    } catch (error) {
        dispatch(setLoading(false));
        dispatch(setError('Failed to Update Post.'));
        dispatch(clearTimerMethod());
    }
};
export const deletePost = (ID, page, limit, searchTerm, startDate, endDate) => async (dispatch) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/events/${ID}`)
            .then((response) => {
                response.data = decryptData(response.data)
                if (response.status == 200) {
                    dispatch(setSuccess(response.data.message));
                    dispatch(getEvents(page, limit, searchTerm, startDate, endDate))
                    dispatch(clearTimerMethod());

                }
                else {
                    dispatch(setError('Failed to Delete Post.'));
                    dispatch(clearTimerMethod());
                }

            })
            .catch((error) => {
                dispatch(setError('Failed to Delete Post.'));
                dispatch(clearTimerMethod());
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

