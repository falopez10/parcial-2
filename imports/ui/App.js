import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import * as d3 from "d3";
import TimeButton from "./TimeButton.js";

export default class App extends Component {
	constructor(props){
		super(props);
		this.svg = React.createRef();

		this.state={
			selectedRoute:{}
		}
	}

	componentDidMount() {
		Meteor.call("buses.get", (err, res)=>{
			if(err) "hay un err";
			console.log(res);
			let selectedRoute= res.route[0];
			this.setState({
				selectedRoute
			});

		});
		
	}

	renderBuses(){
		if(!this.state.selectedRoute.tr)
			return <p>Cargando...</p>;
		let buses = []

		this.state.selectedRoute.tr.forEach((bus)=>{
			let route = bus.stop.filter((d) => d.content!=="--");
			route.forEach((d) => d.date = new Date(+d.epochTime));    
			buses.push(route);
		});

		// console.log("buses",buses);

		// Estoy haciendo el map para un solo bus
		// return buses[1].map((busStop)=>{
		// 	return (<div key={busStop.tag}>{busStop.tag}</div>);
		// });
		this.dibujar(buses);

	}

	dibujar(buses){
		const selectedRoute = this.state.selectedRoute;
		const svg = d3.select("#svg");
		const margin = ({top: 20, right: 30, bottom: 30, left: 150});
		const height = svg.attr("height") - margin.top - margin.bottom;
		const width = svg.attr("width") - margin.left - margin.right;

		const minDate = d3.min(buses[1], d => d.date);
  const maxDate = new Date(minDate.getTime() + 22*60*60*1000); // minDate + 24 hours

  const x = d3.scaleTime()
  .domain([ minDate, maxDate ])
  .range([margin.left, width - margin.right]);
  const y = d3.scaleBand()
  .domain(d3.range(buses[1].length))
  .rangeRound([height - margin.bottom, margin.top]);
  
  const xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x))
  // .call(g => g.select(".domain").remove());
  const yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y)
  	.tickFormat((d) => selectedRoute.header.stop[d].content));  

  const line = d3.line()
  .x(d => x(d.date))
  .y((d,i) => y(i) + y.bandwidth()/2);

  svg.append("g")
  .call(xAxis);

  svg.append("g")
  .call(yAxis);
  
  svg.selectAll(".routes")
  .data(buses)
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("d", line);
  return svg.node(); 
}

filtrarBusesPorTiempo(){
	
}

render() {
	return (
		<div>
			<h1>Nextbus in d3!</h1>
			<div>
				<h2>Aquí se desplegará la información: </h2>
				{this.renderBuses()}
			</div>
			<svg 
			id ="svg"
			width="1280" 
			height="500" 
			// ref = {(svg)=>this.svg=svg}
			ref = {this.svg}
			></svg>
			<TimeButton time=""/>
			<TimeButton time=""/>
			<TimeButton time=""/>
			<TimeButton time=""/>
		</div>
		);
}
}
