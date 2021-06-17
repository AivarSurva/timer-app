import React, { Component } from 'react';
import './App.css';
import { TimerApp } from './Timer';

class App extends Component {
    render(){
        return(
            <div className="App">
                <TimerApp />
            </div>
        );
    }
}

export default App;