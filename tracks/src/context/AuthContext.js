import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        case 'signup':
            return { errorMessage: '', token: action.payload };
        case 'signin':
            return { errorMessage: '', token: action.payload };
        case 'clear_error_message':
            return { ...state, errorMessage: '' };
        case 'signout':
            return { token: null, errorMessage: '' };
        default:
            return state;
    }
};

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
        dispatch({ type: 'signin', payload: token });
        navigate('TrackList');
    } else {
        navigate('Signup');
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' });
};

const signup = (dispatch) => {
    return async ({ email, password }) => {

        try {
            // make api request to signup with that email and password      
            const response = await trackerApi.post('/signup', { email, password });

            // if we signup, modify our state and say that we are authenticated
            await AsyncStorage.setItem('token', response.data.token);
            dispatch({ type: 'signup', payload: response.data.token });

            // navigate to main flow
            navigate('TrackList');

        } catch (err) {
            // if signing up fails we probably need to reflect an error message
            dispatch({
                type: 'add_error',
                payload: 'Something went wrong with sign up!'
            });
        }
    };
};

const signin = (dispatch) => {
    return async ({ email, password }) => {
        try {
            // try to signin
            const response = await trackerApi.post('/signin', { email, password });
            await AsyncStorage.setItem('token', response.data.token);
            dispatch({ type: 'signin', payload: response.data.token });

            // Handle success by updating state
            navigate('TrackList');

        } catch (err) {
            // Handle failure by showing error message
            dispatch({
                type: 'add_error',
                payload: 'Something went wrong with sign in'
            });
        }
    };
};

const signout = (dispatch) => {
    return async () => {
        // somehow signout !!

        await AsyncStorage.removeItem('token');
        dispatch({ type: 'signout' });
        navigate('loginFlow');
    };
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signup, signout, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: '' }
);