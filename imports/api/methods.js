import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import * as d3 from "d3";


Meteor.methods({
	"buses.get"() {	
		//Trae para solo una agencia, con ese tiempo que no entiendo.
		let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=N&t=1144953500233";
		try{
			return HTTP.get(url).data;
		} catch(err){
			throw new Meteor.Error(err);
		}
  }
});