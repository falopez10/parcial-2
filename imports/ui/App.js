import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class App extends Component {
	constructor(props){
		super(props);

		this.state={
			buses:[]
		}
	}

	componentDidMount() {
		Meteor.call("buses.get", (err, res)=>{
			if(err) "hay un err";
			console.log(res);
			console.log(res.vehicle);
			this.setState({
				buses:res.vehicle
			});
		});
		
	}

	renderBuses(){
		return this.state.buses.map((bus)=>{
			return(
				<div key={bus.id}>
					{"id: "+bus.id + " ruta: "+bus.routeTag+" lat y long: "+bus.lat+", "+bus.lon}
				</div>
				)
		})
	}

	render() {
		return (
			<div>
				<h1>Nextbus in d3!</h1>
				<div>
					<h2>Aquí se desplegará la información: </h2>
					{this.renderBuses()}
				</div>
			</div>
		);
	}
}
