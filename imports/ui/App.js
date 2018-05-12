import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import * as d3 from "d3";
import TimeButton from "./TimeButton.js";
import { withTracker } from 'meteor/react-meteor-data';

import AccountsUIWrapper from "./AccountsUIWrapper.js";
import Comentario from "./Comentario.js";

import { Timetables } from "../api/methods.js";


class App extends Component {
	constructor(props){
		super(props);
		this.svg = React.createRef();

		this.state={
			selectedRoute:{},
			agency:"sf-muni",
			route:"N",
			listRoutes:[],
			horario:"todos"
		}


		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleAgencyChange = this.handleAgencyChange.bind(this);
		this.handleRouteChange = this.handleRouteChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleHorarioButton = this.handleHorarioButton.bind(this);
	}

	componentDidMount() {
		// Al principio me muestras las de la ruta N de San Francisco

		this.fetchBuses(this.state.agency,this.state.route);
		
	}

	fetchBuses(agency, route){
		Meteor.call("buses.get", agency, route, (err, res)=>{
			if(err) {
				alert(err);
				return;
			}
			// console.log("RES" + res);
			let selectedRoute= res.route[0];
			this.setState({
				selectedRoute,
				// listRoutes:[{tag:"N",title:"N"}]
				// listRoutes:this.fetchRutasParaAgencia(agency)
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
		this.dibujar(buses);

	}

	dibujar(buses){


		const selectedRoute = this.state.selectedRoute;
		const svg = d3.select("#svg");
		svg.selectAll("*").remove();
		const margin = ({top: 20, right: 30, bottom: 30, left: 150});
		const height = svg.attr("height") - margin.top - margin.bottom;
		const width = svg.attr("width") - margin.left - margin.right;

		// Todos
		let minDate = d3.min(buses[1], d => d.date);
	  let maxDate = new Date(minDate.getTime() + 24*60*60*1000); // minDate + 24 hours
		if(this.state.horario==="manana")
			maxDate = new Date(minDate.getTime() + 12*60*60*1000); // minDate + 12 hours
		if(this.state.horario==="tarde"){
			minDate = new Date(maxDate.getTime() - 12*60*60*1000);
		}


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

	handleAgencyChange(event){
		this.fetchRutasParaAgencia(event.target.value);
	}

	handleRouteChange(event){
		this.setState({
			route:event.target.value
		});
	}

	handleSubmit(event){
		alert("event "+event.target.value);
		const svg = d3.select("#svg");
		svg.selectAll("*").remove();
		this.fetchBuses(this.state.agency, this.state.route);
		event.preventDefault();
	}

	handleKeyPress(e) {
    if (e.key === 'Enter') {
      console.log("timetable.insertComment",this.state.agency, this.state.route, e.target.value);
      if(!this.props.currentUser)
      	alert("por favor ingrese");
      else
      	Meteor.call("timetable.insertComment",this.state.agency, this.state.route, e.target.value);
    }
  }

	getAgenciasTags(){
		return this.props.agencias.map((agencia)=>{
			return <option value={agencia.tag}>{agencia.title}</option>;
		});
	}

	fetchRutasParaAgencia(agency){
		Meteor.call("agencia.rutas",agency,(err,res)=>{
			if(err) {
				alert(err);
				return;
			}
			let rutas = res.route;
			//Agregamos a Mongo el listado de rutas
			Meteor.call("agencia.insertarRutas",agency,rutas);
			this.setState({
				agency:agency,
				listRoutes:rutas,
				route:rutas[0].tag
			});
			
		});
	}

	getRutasParaAgencia(){
		return (this.state.listRoutes.map((r)=>{
				return <option value={r.tag}>{r.title}</option>;
			}));
	}

	renderFormulario(){
		return (<center>
			<form className="row" onSubmit={this.handleSubmit}>
	      <label className="col">
	        Agencia:
	        <br/><select type="text" value={this.state.agency} onChange={this.handleAgencyChange}>
	        {this.getAgenciasTags()}
	        </select>
	      </label>
	      <span className="col-3"/>
	      <label className="col">
	        Ruta:
	        <br/><select type="text" value={this.state.route} onChange={this.handleRouteChange}>
	        {this.getRutasParaAgencia(this.state.agency)}
	        </select>
	      </label>
	      <button className="col" type="submit" value="Grafica!">Grafica!</button>
	    </form>
    </center>);
	}

	renderComments(){
		let msg = <div className="text-center"><h4>Añade tu comentario: </h4><input type="text" onKeyPress={this.handleKeyPress} /></div>
		if(this.props.agencias.length<=0) return msg;
		let agencia = this.props.agencias.find(a=>a.tag===this.state.agency);
		if(!agencia.routes) return msg;
		let ruta = agencia.routes.find(r=>r.tag===this.state.route);
		return(
			<div className="container">
			<div className="row">{msg}</div>
				<h4>Comentarios para la ruta de esta agencia</h4>
					<div className="row">
					{
						ruta.comments.map((c)=>{
							console.log("comentario",c);
							return (<Comentario creador={c.creador} opinion={c.opinion}/>);
						})						
					}
					</div>
			</div>
		);
	}

	handleHorarioButton(event){
		this.setState({
			horario:event.target.value
		});
	}

	render() {
		return (
			<div>
				<AccountsUIWrapper />
				<h1>horarios de buses por ruta y agencia</h1>
				{this.renderFormulario()}
				<div>
					<h3>Al hacer click, se grafican horarios de buses para agencia "{this.state.agency}" y ruta con tag "{this.state.route}" </h3>
					<h4>Tambien puedes escoger tu horario preferido</h4>
					<center>
						<button value="manana" onClick={this.handleHorarioButton}>Mañana</button>
						<span>				</span>
						<button value="tarde" onClick={this.handleHorarioButton}>Tarde</button>
						<span>				</span>
						<button value="todos" onClick={this.handleHorarioButton}>Todos</button>
					</center>
					{this.renderBuses()}
				</div>
				<svg 
				id ="svg"
				width="1280" 
				height="500" 
				// ref = {(svg)=>this.svg=svg}
				ref = {this.svg}
				></svg>
				{this.renderComments()}
			</div>
			);
	}
}

export default withTracker(() => {
  
  Meteor.subscribe("agencias");

  return {
    agencias: Timetables.find({}, {sort: {createdAt: -1}}).fetch(),
    currentUser: Meteor.user()
  };
})(App);
