import axios from "axios";
import { createContext, useEffect, useState } from "react"



export const Eventcontxt = createContext();
export default function EventContext({ children }) {
  
  const [events, setevents] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) setevents(JSON.parse(stored));
  },[])
  useEffect(() => {
    axios.get("http://localhost:5000/api/event").then(res => {
      console.log("events",res.data.events)
      setevents(res.data.events);
      localStorage.setItem("events",JSON.stringify(res.data.events))
    }).catch(err => {
      console.log(err)
    });  
   },[])

  
 
  return (
    <Eventcontxt.Provider
      value={{
        events,
        setevents,
      }}>
      {children}
    </Eventcontxt.Provider>
  );
}
