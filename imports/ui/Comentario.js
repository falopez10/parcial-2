import React, { Component } from 'react';

export default class Comentario extends Component {

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="col-2">
				<div className="card-body">
					<h5 className="card-title">{"Usuario: "+this.props.creador}</h5>
					<p className="card-text">{"Opinión: "+this.props.opinion}</p>
				</div>
			</div>
		);
	}
}
