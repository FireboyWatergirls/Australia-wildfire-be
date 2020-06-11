const postgres = require('pg')
const db = require('../server/database')
const client = db.client

module.exports= {
  
  queryAllPoint:async()=>{
    const queryPoint =`
      SELECT *
      FROM fire_archive_m6
      `
    const result = await client.query(queryPoint)
    return result.rows
  },

//根据日期获得当天统计到的点
queryEachPoint:async(date)=>{
  //queryEachPoint: function (date){
    const text = `SELECT jsonb_build_object(
      'type',     'FeatureCollection',
      'features', jsonb_agg(feature)
  )
  FROM (
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(geom)::jsonb,
      'properties', to_jsonb(row) - 'gid' - 'geom'
    ) AS feature
    FROM (SELECT id,brightness, instrument, geom FROM fire_archive_m6 WHERE acq_date =$1)row) features`
    console.log("date")
    const values =[date]
    data = await client.query(text,values)
    return data
    },
    

//根据时间段获得该时间段内平均值
  queryNationalAve:async(startDate,endDate) =>{
    console.log(startDate)
    console.log(endDate)
    const text=`
    SELECT jsonb_build_object(
      'type',     'FeatureCollection',
      'features', jsonb_agg(feature)
  )
  FROM (
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(geom)::jsonb,
      'properties', to_jsonb(row) - 'gid' - 'geom'
    ) AS feature
    FROM(
      SELECT a.id,b.Ave_bright, b.geom as geom
      FROM fire_archive_m6 as a,(
        SELECT geom, round(SUM(brightness)/COUNT(brightness),2) as AVE_bright
        FROM fire_archive_m6
        GROUP BY geom
      )as b
      WHERE a.geom = b.geom AND acq_date between $1 and $2
        )row)features `
   const values= [startDate,endDate]
   data = await client.query(text,values)
  // await client.query('COMMIT')
   return data
  
    
  },
  //根据鼠标单击处选中对应的state，查询该state内所有站点该时间测得的温度
  queryLocationWithinState:async(startDate,endDate,lon,lat) =>{ 
    const text=`
    SELECT jsonb_build_object(
      'type',     'FeatureCollection',
      'features', jsonb_agg(feature)
  )
  FROM (
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(geom)::jsonb,
      'properties', to_jsonb(row) - 'gid' - 'geom'
    ) AS feature
    FROM(
      SELECT id, geom,brightness, instrument
      FROM fire_archive_m6
          WHERE CAST (acq_date AS date) between $1 and $2
          AND ST_WITHIN (
            fire_archive_m6.geom,
            (
              SELECT geom
                FROM aus_adm1
                WHERE ST_Contains (aus_adm1.geom, ST_SetSRID(ST_MakePoint($3,$4),4326))
          ))
       )row)features`
     const values= [startDate,endDate,lon,lat]
     data = await client.query(text,values)
        return data
      },
    
    
 
   //获取各个州的平均值
  queryAveBrightnessOfEachState: async (startDate,endDate)=> {
      const text=`
      SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(feature)
    )
    FROM (
      SELECT jsonb_build_object(
        'type',       'Feature',
        'id',         gid,
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(row) - 'gid' - 'geom'
      ) AS feature
      FROM(
      SELECT a.NAME_1 AS state_name, a.gid AS gid, a.geom AS geom, b.AveBrightness
      FROM aus_adm1 as a, (
        SELECT aus_adm1.gid as gid,round(SUM (fire_archive_m6.Brightness) / COUNT (fire_archive_m6.Brightness),2) as AveBrightness
        FROM fire_archive_m6,aus_adm1
        WHERE acq_date between  $1 and $2
        AND ST_Contains (aus_adm1.geom,fire_archive_m6.geom)
        GROUP BY aus_adm1.gid
      )  AS b
      WHERE b.gid = a.gid )row)features
        `
    values=[startDate, endDate]
    data = await client.query(text,values)
    console.log(data)
    return data
    
  },

  queryPolygon: async (lon,lat) => {
    const text=`
    SELECT jsonb_build_object(
      'type',     'FeatureCollection',
      'features', jsonb_agg(feature)
  )
  FROM (
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         gid,
      'geometry',   ST_AsGeoJSON(geom)::jsonb,
      'properties', to_jsonb(row) - 'gid' - 'geom'
    ) AS feature
    FROM(
      SELECT gid,geom
      FROM aus_adm1
      WHERE ST_Contains (aus_adm1.geom, ST_SetSRID(ST_MakePoint($1,$2),4326))row)features` 
      values=[lon,lat]
    
      data = await client.query(text,values)
      return data
  }
}
   // WHERE CAST (acq_date AS date) between '$1' and$2
  
