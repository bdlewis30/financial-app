import axios from 'axios';

const initialState = {
    user: {}
}

// PUT THE ACTION TYPES INSIDE A STRING SO IF YOU MISTYPE IT DOESN'T THROW AN ERROR
const GET_USER_INFO = 'GET_USER_INFO';

//Action creator. Action creators return objects.
export function getUserInfo(){
    // Because axios was included, middleware is needed.
    let userData = axios.get('/auth/me').then( res => {     // The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.
    return res.data;
})
    return {
        type: GET_USER_INFO,
        payload: userData
    }
}


export default function reducer(state = initialState, action){
    switch(action.type) {
        case GET_USER_INFO + '_FULFILLED':  //This is applymidleware.
            return Object.assign({}, state, {user: action.payload})  // order is important
        default:
            return state;
    }
}