import React, { Component } from 'react';
import './App.css';
import TimerApp from './Timer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
    render(){
        return(
            <div className="App">
                <Router>
                    <Switch>
                        <Route>
                            <TimerApp />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;