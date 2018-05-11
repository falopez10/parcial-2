import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import * as d3 from "d3";


Meteor.methods({
	"buses.get"() {	
		//Trae para solo una agencia, con ese tiempo que no entiendo.
		let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=schedule&a=sf-muni&r=N";
		try{
			return HTTP.get(url).data;
		} catch(err){
			throw new Meteor.Error(err);
		}
  }
});