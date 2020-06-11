var express = require('express');
var app = express()
var router = express.Router();
const postgres = require('pg')
const db = require('../server/database')
const client = db.client
var fire_nrt = require('../models/fire_nrt')
//var testdata=require('../data/modis_7d.geojson')
//import * as testdata from '../data/modis_7d.geojson';
/* GET home page. */

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
  });

router.get('/',   function(req, res, next) {
	
//console.log(fire_nrt.queryAllPoint.to_json)

//var data = fire_nrt.queryNationalAve("2019-1-3","2019-3-3").to_json
//console.log(data)
//res.send(data)
  
});


router.get('/fire_m6/fireNationalAve/:startdate/:enddate',  async(req,res)=>{
	console.log("start to get")
	var data = await fire_nrt.queryNationalAve(req.params.startdate,req.params.enddate)
	res.send(data.rows)
	console.log(data.rows)
})

router.get('/fire_m6/firePoint/:date', async(req,res)=>{
	 data= await fire_nrt.queryEachPoint(req.params.date)
	 //console.log("after await")
	 res.send(data.rows)
	 //console.log(data)	
	})

router.get('/fire_m6/locationWithinState/:startdate/:enddate/:lon/:lat',  async(req,res)=>{
	//console.log(" in locationWithinState"+req.params.pointClick)
	var data = await fire_nrt.queryLocationWithinState(req.params.startdate,req.params.enddate,req.params.lon,req.params.lat)
	console.log(data)
	res.send(data.rows)
	//console.log(data)
})

router.get('/fire_m6/AveBrightnessOfState/:startdate/:enddate',  async(req,res)=>{
	var data = await fire_nrt.queryAveBrightnessOfEachState(req.params.startdate,req.params.enddate)
	console.log("returned")
	console.log(data)

	res.send(data.rows)
	
})

router.get('/fire_m6/polygon/:lon/:lat',async(req,res)=>{	
	var data = await  fire_nrt. queryPolygon(req.params.lon,req.params.lat)
	
	res.send(data.rows)
	//(data)
})



module.exports = router;
