import axios from "axios";
import { createContext, useState } from "react"

export const SeatContextt = createContext();
export default function SeatContex({children}) {
  const [seats, setseats] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchSeats = async (eventId) => {
      try {
         console.log(eventId)
         const res = await axios.get(
           `${API_URL}/event/${eventId}/seats`
         );
          console.log("seats",res.data.seats)
         setseats(res.data.seats);
         
       } catch (err) {
         console.error("Error fetching seats:", err);
        
       }
     };
  return (
    <SeatContextt.Provider value={{seats,setseats,fetchSeats}}>
      {children}
    </SeatContextt.Provider>
  )
}
