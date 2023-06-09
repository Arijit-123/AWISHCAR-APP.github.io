import React, { useState,useEffect } from 'react'
import './App.css'
import Calendar from './Components/Calendar';
import Graph from './Components/Graph';

const App = () => {
  const [data, setData]=useState(0);

  const [props,setProp]=useState([]);
  const [noofasteroids,setNoofasteroids]=useState([]);
  const [near,setNear]=useState([]);
  const [submit,setSubmit]=useState(false);
  const[fastest,setFastest]=useState(null);
  const [nearasteroid,setNearasteroid]=useState(null);
  const [avgsize,setAvgsize]=useState(null);
  
  const API_KEY=process.env.REACT_APP_API_KEY;
    useEffect(() => {
        fetch(
      
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${data}&api_key=${API_KEY}`
        )
          .then((res) => res.json())
          .then((dataset) => {
            console.log('complete-info',dataset);
            setProp(dataset.near_earth_objects);            
         
            const API_date=Object.keys(dataset.near_earth_objects).sort();
            console.log('API_DATE',API_date);
            setNear(API_date)
            const speed=Object.values(dataset.near_earth_objects).flat();

            console.log('dataset answer',speed); 
           
            const fastestAsteroid = speed.reduce((prev, current) => {
              return prev.close_approach_data[0].relative_velocity.kilometers_per_hour >
                current.close_approach_data[0].relative_velocity.kilometers_per_hour
                ? prev
                : current;
            });
          
           

            console.log('dydjdjf',fastestAsteroid);
            
            setFastest(fastestAsteroid);

            const asteroid_nearest= speed.reduce((prev, current) => {
              return prev.close_approach_data[0].miss_distance.kilometers <
                current.close_approach_data[0].miss_distance.kilometers
                ? prev
                : current;
            });
            console.log('closest asteroid', asteroid_nearest);
               setNearasteroid(asteroid_nearest);
             var sum=0;
              const Summation=speed.reduce(
                (prev, current) => prev + current.estimated_diameter.kilometers.estimated_diameter_max,
                0
              );
           
              const averageSize = Summation / speed.length;
              
              setAvgsize(averageSize);
            const asteroidsByDate = API_date.map((date) => {
              return {
                count:dataset.near_earth_objects[date].length,
              };
            });
            setNoofasteroids(asteroidsByDate);
            console.log('asteroidsBydate',asteroidsByDate);
            console.log('speedtest');
        
            
          });
                

      }, [submit]);
    
  return (
    <div>
   <h1>Enter the date of choice</h1>
   <h4>* The result will give result of 7 days after the day you chose</h4>
   <h4>* Kindly do not enter a very near date to the present day</h4>
    <input type="date" name="start-date" className='Date' placeholder="Start Date" value={data} onChange={(e) => setData(e.target.value)} />
    <button onClick={()=>setSubmit(!submit)}> Submit </button>
     <Graph nearasteroids={near} noofasteroids={noofasteroids}/> 
     <div className='fastest'>
     <h1>The fastest Asteroid is</h1>
     <div>
     {fastest && (
        <div>
     <h3>Name:{fastest.name}</h3>
     <h3>Speed:{fastest.close_approach_data[0].relative_velocity.kilometers_per_hour}  km/hr</h3>
     </div>
     )}
     <hr></hr>
<h1>Closest Asteroid</h1>
     {nearasteroid && (
           <div>
           <h3>Asteroid Name: {nearasteroid.name} </h3> 
          <h3>Speed:{nearasteroid.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h</h3>
          </div>
        )}
            <hr></hr>
        <h1>Average Asteroid size</h1>
        <h3>AverageSize:{avgsize} km/h</h3>
     </div>
     </div>
    </div>
  )
}

export default App
