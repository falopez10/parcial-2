import React, { Component } from 'react';

// La idea es usar esta clase para filtrar los buses que paran en cierto horario.
export default class TimeButton extends Component {
	constructor(props){
		super(props);
		
	}

	
	onClick(){
		this.props.onClick(this.props.time);
	}

	render(){
		return (
			<div >
				<button onClick={this.onClick.bind(this)}>{this.props.time}</button>
			</div>
		);
	}
}
