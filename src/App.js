import React, { Component } from 'react';
import './App.css';

class App extends Component {
	render(){
		return(
			<div className="App">
				<Text value="React App template."/>
			</div>
		);
	}
}

function Text(props) {
	return(
		<h1>{props.value}</h1>
	);
}

export default App;