import { useContext, useEffect, useState } from "react";
import maskGroup from "../assets/Images/Maskgroup.png";
import { AuthContext } from "../Contexts/AuthContext";
import { Eventcontxt } from "../Contexts/EventContext";
import { formatDate } from "../../index";
import axios from "axios";
import LoaderScreen from "../Components/LoaderScreen";

export default function DashboardUser() {
  const { user } = useContext(AuthContext);
  const { events } = useContext(Eventcontxt);
  const [isLoading, setisLoading] = useState(false);
  const [tickets, settickets] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const getUserTicket = () => {
  setisLoading(true)
    return axios.get(`${API_URL}/tickets/user/${user && user.id||user?._id}`).then(res => {
      console.log("tickets", res.data);
    settickets(res.data);
    setisLoading(false);
  }).catch(err => {
    console.log(err)
        setisLoading(false);
    });
  }
 
     
  useEffect(() => {
    if (user) {
        getUserTicket();
      }      
     
   }, [user]);
    const deleteTicketsForDeletedEvents = () => {
      axios
        .delete(`${API_URL}/tickets/cleanup`)
        .then((res) => {
          console.log(res.data);
          
        })
        .catch((err) => {
          console.log(err);
        });
  }; 
   useEffect(() => {
     deleteTicketsForDeletedEvents();
   }, [tickets]);

  if (isLoading) {
    return (
    <LoaderScreen/>
    );
  }
    
   
  return (
    <div className="px-4 py-16 lg:py-0 bg-[#F9F9F9] min-h-screen">
      {/* Header */}
      <div className="nav flex flex-col lg:flex-row gap-4 items-center justify-between bg-purple-600 text-white rounded-xl p-4 m-2 shadow-md">
        <div className="left w-full lg:w-auto flex items-center gap-3">
          <img src={maskGroup} alt="maskGroup" className="w-10 h-10" />
          <p className="text-lg">
            Hello, <span className="font-bold">{user && user.name}</span>
          </p>
        </div>
        <div className="right">
          <p className="italic">
            Enjoy the best events and book your seat now 🎉
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="cards flex flex-col md:flex-row gap-4 my-4">
        <div className="card w-full md:w-1/3 p-4 bg-white shadow rounded-xl text-center">
          <h3 className="font-bold text-gray-700">Total Events</h3>
          <p className="text-purple-600 font-extrabold text-xl">
            {events?.length || 0}
          </p>
        </div>
        <div className="card w-full md:w-1/3 p-4 bg-white shadow rounded-xl text-center">
          <h3 className="font-bold text-gray-700">My Tickets</h3>
          <p className="text-green-600 font-extrabold text-xl">
            {tickets ? tickets.length : 0}
          </p>
        </div>
        <div className="card w-full md:w-1/3 p-4 bg-white shadow rounded-xl text-center">
          <h3 className="font-bold text-gray-700">Next Event</h3>
          <p className="text-orange-500 font-semibold">
            {events && events.length > 0
              ? formatDate(events[0].date)
              : "No upcoming"}
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="upcoming bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="font-bold text-xl mb-3 text-gray-800">
          🎤 Upcoming Events
        </h2>
        {events && events.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event._id}
                className="border p-4 rounded-lg hover:shadow-lg cursor-pointer">
                <h3 className="font-bold text-lg text-purple-700">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  📅 {formatDate(event.date)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {event.description?.slice(0, 30)}...
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming events yet</p>
        )}
      </div>

      {/* My Tickets */}
      <div className="tickets bg-white rounded-xl shadow p-4">
        <h2 className="font-bold text-xl mb-3 text-gray-800">🎟 My Tickets</h2>
        {tickets && tickets.length > 0 ? (
          <ul className="space-y-3">
            {tickets.map((ticket, index) => (
              <li key={index} className="p-3 border rounded-lg">
                <p>
                  <span className="font-bold">Event:</span> {ticket.eventTitle}
                </p>
                <p>
                  <span className="font-bold">Seat:</span> {ticket.seatNumber}
                </p>
                {ticket.status == "booked" ? (
                  <p>Booked {ticket.seatNumber} But Not Paid</p>
                ) : (
                  ticket.status == "paid" && <p>Paid {ticket.seatNumber}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">You have no tickets yet.</p>
        )}
      </div>
    </div>
  );
}
