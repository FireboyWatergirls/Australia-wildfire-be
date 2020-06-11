/**
 * Postgres DB Module
 */
//https://data.gov.au/geoserver/fires-in-australia-s-forests-2011-16-2018/wms?request=GetCapabilities
const postgres = require('pg')
//const connectionString =" postgres:angel148@localhost/AustraliaFire"

// Initialize postgres client
//const client = new postgres.Client({ connectionString })
//console.log(client.database)
//console.log(client.host)
// Connect to the DB

const client = new postgres.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'AustraliaFire',
  password: 'angel148',
  port: '5432',
})
client.connect().then(() => { 
  console.log(`Connected To ${client.database} at ${client.host}:${client.port}`)
}).catch(console.log ("db connection error"))

module.exports = {client}
  /** Query the current time */

/*Query the locations of the fire: SELECT the_geom FROM fire_archive_m6_96619*/
/*Query the Attribute of the fire according to id鼠标单击事件 + date  SELECT * FROM fire_archive_m6_96619 WHERE acq_date between '2019-08-10' and '2019-08-12'*/
/*Query the locations of the fire within an area and a time period, compute the average brightness*/


/*不同时间尺度
  每天  每个月
*/







  /** Query the locations as geojson, for a given type */



