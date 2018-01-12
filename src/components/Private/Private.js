import React from 'react';
import './Private.css'
import { connect } from 'react-redux'; // Connect is not part of react or the store.
import { getUserInfo } from '../../ducks/users';


class Private extends React.Component {

    // Fires a action that updates the store.
    componentDidMount() {
        this.props.getUserInfo()
    }

    bankBalance() {
        return '$' + Math.floor((Math.random() + 1) * 1000) + '.00';
    }
    render() {
        const user = this.props.user;
        return (
            <div className='container'>
                <h1>Community Bank</h1><hr />
                <h4>Account information:</h4>
                {user ? <img className='avatar' src={user.img} /> : null}
                <p>Username: {user ? user.username : null}</p>
                <p>Email: {user ? user.email : null}</p>
                <p>ID: {user ? user.auth_id : null}</p>
                <h4>Available balance: {user ? this.bankBalance() : null} </h4>
                <a href='http://localhost:4000/auth/logout'><button>Log out</button></a>
            </div>
        )
    }
}

function mapStateToProps(state) {    // "state" represents the entire object of the store's state.
    console.log(state);
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { getUserInfo })(Private)   // mapStateToProps passes in all of state from store. getUserInfo is only available to componentDidMount because it is within connect which connects to store.