import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState, useEffect } from "react";
import {  AuthContext } from "./../Contexts/AuthContext";
import { toast } from "react-toastify";
import backarrow from "../assets/Images/Back Arrow.png"
import { Link } from "react-router-dom";
import { formatDate, formatTimeTo12Hour } from './../../index';
import cash from "../assets/Images/Cash.png";
import FlightSeat from "../assets/Images/FlightSeat2.png";
import ticket from "../assets/Images/Ticket.png"
import { Eventcontxt } from "../Contexts/EventContext";
import Search from "../Components/Search";
export default function ManageEvents() {
  const [modelCreateEvent, setmodelCreateEvent] = useState(false);
  const { token } = useContext(AuthContext);
  const { setevents, events } = useContext(Eventcontxt);
  const [displayedEvents, setdisplayedEvents] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    setdisplayedEvents(events);
    console.log("displayedEvents",displayedEvents)
  }, [events]);

  const [venues, setvenues] = useState([
  ]);
  const handleOpen = () => setmodelCreateEvent(true);
  const handleClose = () => setmodelCreateEvent(false);
  
  //getAllVenues
 useEffect(() => {
   if (!token) return; // لو token مش جاهز متعملش request
   axios
     .get(`${API_URL}/venue/get`, {
       headers: { Authorization: `Bearer ${token}` },
     })
     .then((res) => {
       console.log(res.data)
       setvenues(res.data) 
       
     })
     .catch((err) => console.log(err));
 }, [token]);

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
   };
  //  إضافة حدث جديد
  const addEvent = (values) => {
    if (!token) {
      return;
    }
    axios
      .post(`${API_URL}/event`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Event Created:", res.data);
        toast.success("Event is Created Successfully");
        setevents((prev) => (
           [...prev, res.data]
        ));
        
        handleClose();
      })
      .catch((error) => {
        console.error(
          "Error creating event:",
          error.response?.data || error.message
        );
        toast.error(error.response?.data?.message || "Error creating event");
      });
  };

  const eventValues = {
    title: "",
    description: "",
    date: "",
    starttime: "",
    endtime:"",
    venue: "",
    capacity:"",
    price: "",
    organizer: "",
    status: "upcoming",
    totalseats: "",
    
  };

  const formikObj = useFormik({
    initialValues: eventValues,
    onSubmit: addEvent,
  });
const deleteEvent = (id) => {
  axios
    .delete(`${API_URL}/event/${id}`)
    .then((res) => {
      console.log("deleted", res.data);
      setevents((prev) => prev.filter((ev) => ev._id !== res.data.event._id));
      localStorage.removeItem("confirmedSeats");
    })
    .catch((err) => console.log(err));
};

 
  const renderEvents = (events, status) => {
      //filter event by status
      const filteredEvents = events.filter((event) => event.status === status);

    return (
      <div className="flex   w-full md:w-[45%] lg:w-[30.3%] flex-col mb-4      gap-4">
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
                  <button
                    onClick={() => {
                      deleteEvent(event._id);
                    }}
                    title="deleteEvent"
                    className="deleteEvent text-[red] cursor-pointer absolute right-2 top-2">
                    x
                  </button>
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
    <div className="relative  py-10 lg:py-0 bg-[#F2F2F2] min-h-screen ">
      <div className="bg-white flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between p-4">
        <div>
          <h1 className="text-2xl">Event Management Section</h1>
          <button
            onClick={handleOpen}
            className="border flex text-[#0122F5] items-center gap-4 p-2 border-[#0122F5] rounded cursor-pointer">
            <span className="border flex justify-center items-center border-[#0122F5] rounded-full w-4 h-4">
              +
            </span>
            <span>Add Event</span>
          </button>
        </div>
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

      {/* Main modal */}
      {modelCreateEvent && (
        <div className="absolute inset-0 bg-amber-50 ">
         
            <div className="absolute z-50 w-[90%] left-[50%] lg:top-[12%] translate-x-[-50%] top-[11%] sm:top-[17%] translate-y-[-50%] rounded-lg shadow-sm bg-white">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Event
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={formikObj.handleSubmit}>
                  {/* Event Name */}
                  <input
                    type="text"
                    name="title"
                    value={formikObj.values.title}
                    onChange={formikObj.handleChange}
                    placeholder="Event Name"
                    className="w-full border p-2 rounded"
                    required
                  />

                  {/* Description */}
                  <input
                    type="text"
                    name="description"
                    value={formikObj.values.description}
                    onChange={formikObj.handleChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    required
                  />

                  {/* Date */}
                  <input
                    type="date"
                    name="date"
                    value={formikObj.values.date}
                    onChange={formikObj.handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />

                  {/* Time */}
                  <div className="time">
                    <span>from</span>
                    <input
                      type="time"
                      name="starttime"
                      value={formikObj.values.starttime}
                      onChange={formikObj.handleChange}
                      className="w-full border p-2 rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      name="endtime"
                      value={formikObj.values.endtime}
                      onChange={formikObj.handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  {/* Venue (select from backend) */}
                  <select
                    name="venue"
                    value={formikObj.values.venue}
                    onChange={formikObj.handleChange}
                    className="w-full border p-2 rounded"
                    required>
                    <option value="">Select Venue</option>
                    {venues.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  {/* Status (select) */}
                  <select
                    name="status"
                    value={formikObj.values.status}
                    onChange={formikObj.handleChange}
                    className="w-full border p-2 rounded"
                    required>
                    <option value="upcoming">Upcoming</option>
                    <option value="pending">pending</option>
                    <option value="closed">Completed</option>
                  </select>

                  {/* Capacity */}
                  <input
                    type="number"
                    name="totalseats"
                    value={formikObj.values.totalseats}
                    onChange={formikObj.handleChange}
                    placeholder="totalSeats"
                    className="w-full border p-2 rounded"
                    required
                  />

                  {/* Base Price */}
                  <input
                    type="number"
                    name="price"
                    value={formikObj.values.price}
                    onChange={formikObj.handleChange}
                    placeholder="Base Price"
                    className="w-full border p-2 rounded"
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800">
                    Add Event
                  </button>
                </form>
              </div>
            </div>
          </div>
       
      )}
    </div>
  );
}
