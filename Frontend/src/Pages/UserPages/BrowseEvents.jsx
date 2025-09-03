import { Link } from "react-router-dom";
import backarrow from "../../assets/Images/Back Arrow.png"
import { formatDate, formatTimeTo12Hour } from "../../..";
import { useContext, useEffect, useState } from "react";
import cash from "../../assets/Images/Cash.png";
import FlightSeat from "../../assets/Images/FlightSeat2.png";
import ticket from "../../assets/Images/Ticket.png";
import axios from "axios";
import { Eventcontxt } from "../../Contexts/EventContext";
import LoaderScreen from './../../Components/LoaderScreen';
import Search from './../../Components/Search';
import { AuthContext } from "../../Contexts/AuthContext";
export default function BrowseEvents() {
  const { events, setevents } = useContext(Eventcontxt);
  const [displayedEvents, setdisplayedEvents] = useState([]);
  const { token } = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(false);
  const getEvents = () => {
    setisLoading(true);
      return axios.get("http://localhost:5000/api/event").then(res => {
        setevents(res.data.events);
        setdisplayedEvents(res.data.events)
         setisLoading(false);
      }).catch(err => {
        console.log(err);
         setisLoading(false);
      });
  }
  useEffect(() => {
    getEvents();
  }, []);
  const [venues, setvenues] = useState([]);
    //getAllVenues
   useEffect(() => {
     if (!token) return; // لو token مش جاهز متعملش request
     axios
       .get("http://localhost:5000/api/venue/get", {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((res) => {
         console.log(res.data)
         setvenues(res.data) 
         
       })
       .catch((err) => console.log(err));
   }, [token]);
  if (isLoading) {
    return <LoaderScreen/>
  }
  const handleChange = (e) => {
   const value = e.target.value.toLowerCase();

   if (value === "") {
     setdisplayedEvents(events);
   } else {
     const newEvents = events.filter((el) =>
       el.title.toLowerCase().includes(value)
     );
     setdisplayedEvents(newEvents);
   }
  }
   const renderEvents = (events, status) => {
        //filter event by status
        const filteredEvents = events.filter((event) => event.status === status);
  
      return (
        <div className="flex  w-full md:w-[45%] lg:w-[30.3%] flex-col mb-4      gap-4">
          <div className="title my-2  flex justify-center  items-center gap-2">
            <span
              className="block  w-5 h-5 rounded-full "
              style={{
                backgroundColor: `${
                  status == "upcoming"
                    ? "#1A28BF"
                    : status == "pending"
                    ? "#1ABF46"
                    : "#BF1A1A"
                }`,
              }}></span>
            <span>
              {status == "upcoming"
                ? "Up-Coming"
                : status == "pending"
                ? "Pending"
                : "Closed"}
            </span>
          </div>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idxEvent) => {
              if (event.status == status) {
                return (
                  <div
                    key={event._id}
                    className="bg-white relative  p-7  shadow rounded-xl">
                    <h2 className="text-center">{event.title}</h2>
                 
                    <div className="flex items-center my-2  justify-between">
                      <div className="price flex items-center gap-1">
                        <img src={cash} alt="" />
                        <span className="text-[#0F5D13]">{event.price}EG</span>
                      </div>
                      <div className="totalseats flex items-center gap-1">
                        <img src={FlightSeat} alt="" />
                        <span className="text-[#EB3223]">{event.totalseats}</span>
                      </div>
                      <div className="price flex items-center gap-1">
                        <img src={ticket} alt="" />
                        <span className="text-[#8B2CF5]">
                          {event.availableSeats}
                        </span>
                      </div>
                    </div>
                    <div className="border-b mt-2 border-[#666666]"></div>
                    <div className="venue flex my-2 items-center gap-1 ">
                      <span className="text-[#666666]">Venue :</span>
                      <span className="text-sm">
                        {venues.map((venue, i) => {
                          if (i == idxEvent) {
                            return venue.name.split(" ", 2);
                          }
                        })}
                      </span>
                    </div>
                    <div className="date flex my-2 items-center gap-1 ">
                      <span className="text-[#666666]">Date :</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="time  text-sm flex my-2 items-center gap-1 ">
                      <span className="text-[#666666]">Time :</span>
                      <span>
                        from {formatTimeTo12Hour(event.starttime)} to{" "}
                        {formatTimeTo12Hour(event.endtime)}
                      </span>
                    </div>
                    <Link
                      to={`/eventDetails/${event._id}`}
                      className="toEventDetails   cursor-pointer rounded-full flex items-center justify-center w-8 h-8 absolute bottom-1 right-1">
                      <img src={backarrow} alt="" />
                    </Link>
                  </div>
                );
              }
            })
          ) : (
            <p className="text-center text-gray-500">No events</p>
          )}
        </div>
      );
    }
  return (
    <div className="relative bg-[#F2F2F2] min-h-screen ">
      <div className="bg-white flex items-center justify-between p-4">
        <h1 className="text-2xl">Browse Events</h1>
        <Search onChange={handleChange} placeHolder="search event by title" />
      </div>
      {displayedEvents.length > 0 ? (
        <div className="Events flex flex-wrap justify-center     px-4 gap-10 py-8 ">
          {renderEvents(displayedEvents, "upcoming")}
          {renderEvents(displayedEvents, "pending")}
          {renderEvents(displayedEvents, "closed")}
        </div>
      ) : (
        <div className=" absolute top-[50%] left-[50%] translate-x-[-50%]">
          <p className="text-center text-2xl font-extrabold">
            Not Available Events Founded
          </p>
        </div>
      )}
    </div>
  );
}
