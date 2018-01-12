import React from 'react';
import './Home.css';
import bankSVG from './communityBank.svg';

export default function Home() {
    return(
        <div className="App">
           <img src={bankSVG} alt=""/>
           <a href={process.env.REACT_APP_LOGIN}>
               <button>Login</button>
           </a>
        </div>
    )
}