import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import * as d3 from "d3";

// Aqui se guarda cada documento tipo "agencia"
export const Timetables = new Mongo.Collection("timetables");

// Poblar primer nivel de colección: Trae las agencias
if(Meteor.isServer)
  {

  	//Trae todas las agencias
		Meteor.publish("agencias", function publicarAgencias(){

			return Timetables.find();
		});

		//Si DB esta vacia, agrega la info de agencias y sus rutas
  	if(Timetables.find().count()===0)
  	{
  		console.log("poblando MongoDB");
	  	let urlAgencies = "http://webservices.nextbus.com/service/publicJSONFeed?command=agencyList";
	  	let urlBaseRoutes = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=";
	  	try{
				let agencies = HTTP.get(urlAgencies).data.agency;
		  	agencies.forEach((a)=>{
	  			// Se crea sin rutas para despues actualizar solo donde no haya.
		  		Timetables.insert({
  		  		title: a.title,
  		  		regionTitle: a.regionTitle,
  		  		tag: a.tag,
  		  	});
		  	});
			} catch(err){
				throw new Meteor.Error(err);
			}
  	}
  }

Meteor.methods({
	"buses.get"(agency, route) {	
		//Trae para solo una agencia(sf-muni), solo una ruta (N).
		let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=schedule&a="
		+agency+"&r="+route;
		try{
			return HTTP.get(url).data;
		} catch(err){
			return "No se obtuvo resultado :( prueba con otra ruta";
			// throw new Meteor.Error(err);
		}
  },
  "agencia.rutas"(agency){
  	let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a="+agency;
  	try{
			return HTTP.get(url).data;
		} catch(err){
			return "No se obtuvo resultado :( prueba con otra agencia";
			// throw new Meteor.Error(err);
		}
  },
  "agencia.insertarRutas"(agency,routes){
  	//Si ya tenía rutas, no inserto nada para no sobreponer comentarios
  	if(Timetables.find({
  		tag:agency,
  		routes:{$exists:true}
  	}).count()>0)
  		return;

  	let rutas = routes.map((r)=>{
  		return {
  			title: r.title,
  			tag: r.tag,
  			comments:[]
  		}
  	});
  	Timetables.update({tag:agency},
  	{$set:
  		{	routes:rutas}
  	});


  }
  ,
  "timetable.insertComment"(agency, route, opinion){
  	if (!this.userId) {
  		console.log("intenta insertar comentario sin hacer log in")
			throw new Meteor.Error("No autorizado");
		}
		let comentario = {
			opinion,
			creador: Meteor.user().username
		}
		//insertar comentario en la ruta de una agencia.
		Timetables.update(
			{
				tag : agency,
				routes:
				{ $elemMatch: 
					{ 
						tag: route
					} 
				}			
			} , 
			{
				$push: 
				{
					"routes.$.comments": comentario
				}
			}
			);
  }

});