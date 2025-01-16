import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createBrowserHistory } from 'history';
import { encryptData, decryptData } from '../../security/crypto';
export const history = createBrowserHistory();


export const registerUser = (email, password, firstName, lastName, contactNumber) => async dispatch => {
    let data = {
        email,
        password,
        firstName,
        lastName,
        contactNumber
    }
    try {
        setLoading(true)
        await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, { data: encryptData(data) })
            .then(response => {
                response.data = decryptData(response.data)
                if (response.status === 200) {
                    dispatch(setLoading(false))
                    dispatch(setSuccess(response.data.message));
                }
            }).catch((error) => {
                dispatch(setLoading(false))
                if (error.response && error.response.status === 400) {
                    dispatch(setError(error.response.data.message || 'Email or username is already taken.'));
                } else {
                    dispatch(setError('Failed to register user.'));
                }
            })

    } catch (error) {
        dispatch(setLoading(false))
        dispatch(setError('Login failed, please try again'));
    }



};
export const loginUser = (email, password) => async dispatch => {
    let data = { email, password }

    try {
        dispatch(setLoading(true))
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, encryptData(data))
            .then(response => {
                if (response.data.error) {
                    dispatch(response.data.error.message)
                }
                else {

                    localStorage.setItem('user', JSON.stringify(response.data));
                    dispatch(setError(null));
                    history.push("/dashboard");
                }
            }).catch((error) => {
                dispatch(setLoading(false))
                dispatch(setError('Login failed, please try again'));
            })

    } catch (error) {
        dispatch(setError('Login failed, please try again'));
    }



};



const initialState = {
    data: [],
    success: "",
    error: "",
    loading: false

};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
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
    setSuccess,
    setError,
    setLoading
} = loginSlice.actions;

export default loginSlice.reducer;

