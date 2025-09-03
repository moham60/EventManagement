import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link,  useParams } from "react-router-dom"
import backarrow2 from "../assets/Images/BackArrow2.png"
import {  formatDateForInput } from "../..";
import pen from "../assets/Images/Pen.png";
import location from "../assets/Images/Location.png";
import price from "../assets/Images/PriceTagUSD.png";
import seat from "../assets/Images/FlightSeat.png";
import waitingRoom from "../assets/Images/WaitingRoom.png";
import popular from "../assets/Images/Popular.png";
import tags from "../assets/Images/Tags.png";
import group from "../assets/Images/Group.png";
import qrCode from "../assets/Images/QrCode.png"
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Eventcontxt } from "../Contexts/EventContext";
import { formatDate, formatTimeTo12Hour } from './../../index';

import Seats from "../Components/Seats";
import { SeatContextt } from "../Contexts/SeatContex";
import { AuthContext } from "../Contexts/AuthContext";
export default function EventDetails() {
  
  const { eventId } = useParams();
    const [eventDtails, seteventDtails] = useState(null);
  const [editEvent, seteditEvent] = useState(false);
    const getEventById = () => {
        axios
          .get(`http://localhost:5000/api/event/${eventId}`)
          .then((res) => {
            console.log(res);
            seteventDtails(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
    }
    const { setevents } = useContext(Eventcontxt);
    const updateEvent = (values) => {
        axios
          .put(`http://localhost:5000/api/event/edit/${eventId}`, values)
          .then((res) => {
            console.log(res.data);
            seteventDtails(res.data.event);
            const updatedEvent = res.data.event;
            setevents((prevEvents) =>
              prevEvents.map((ev) =>
                ev._id === updatedEvent._id ? updatedEvent : ev
              )
            );
            toast.success("Updated Sucess");
          })
          .catch((err) => {
            console.log(err);
          });
  }
  const handleEdit = () => {
    seteditEvent(!editEvent);
  }
    const formikObj = useFormik({
      initialValues: {
        title: eventDtails?.title || "",
        price: eventDtails?.price || "",
        totalseats: eventDtails?.totalseats || "",
        availableSeats: eventDtails?.availableSeats || "",
        popularity: eventDtails?.popularity || "",
        starttime: eventDtails?.starttime || "",
        date: eventDtails ? formatDateForInput(eventDtails.date) : "",
        description: eventDtails?.description || "",
        expectedAttends:
          eventDtails?.expectedAttends !== undefined &&
          eventDtails?.expectedAttends,
        tags: eventDtails?.tags || "",
        venueName: eventDtails?.venue?.name || "",  
      },
      enableReinitialize: true, // after values come from api the values are updated
      onSubmit: updateEvent,
    });
  


const { setseats,seats,fetchSeats } = useContext(SeatContextt);
  useEffect(() => {
   getEventById();
  }, []);
 useEffect(() => {
   fetchSeats(eventId);
 }, []);


  const handleEditVenueName = () => {
    axios
      .put(`http://localhost:5000/api/venue/updateNameVenue/${eventDtails.venue._id}`, {
        name: eventDtails?.venue?.name,
      })
      .then((res) => {
       console.log(res)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  
  useEffect(() => {
     if (eventDtails?.status === "closed") {
       setseats([]); // remove all seat with closed events
     }
  },[eventDtails?.status])
    const {user}=useContext(AuthContext)
  return (
    <div className="p-5 relative">
      <Link
        to={`${
          user?.role == "admin"
            ? "/ManageEvents"
            : "/userDashboard/browseEvents"
        }`}
        className="toEventDetails  w-8 h-8 absolute left-4 top-10">
        <img src={backarrow2} alt="" />
      </Link>

      <h1 className="text-center mb-8 text-[24px]">Event Details</h1>
      <div className="inpts">
        <form>
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            <div className="w-full lg:w-[70%] ">
              <label htmlFor="title" className="block  ml-1 mb-1">
                Event Name
              </label>
              <div className="nameInpt relative  ">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.title ?? ""
                      : eventDtails?.title ?? ""
                  }
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={pen} alt="Pen" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[30%] ">
              <label htmlFor="date" className="block  ml-1 mb-1">
                Event Date
              </label>
              <div className="nameInpt relative  ">
                <input
                  type="text"
                  id="date"
                  name="date"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.date ?? ""
                      : formatDate(eventDtails?.date) ?? ""
                  }
                  onChange={formikObj.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex my-4 flex-wrap lg:flex-nowrap items-center gap-2">
            <div className="w-full lg:w-[70%] ">
              <label htmlFor="venue" className="block  ml-1 mb-1">
                Event Venue
              </label>
              <div className="venueInpt relative  ">
                <input
                  type="text"
                  id="venue"
                  name="venueName"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={eventDtails && eventDtails.venue?.name}
                  onChange={(e) => {
                    if (editEvent) {
                      seteventDtails((prev) => ({
                        ...prev,
                        venue: {
                          ...prev.venue,
                          name: e.target.value,
                        },
                      }));
                    }
                  }}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={location} alt="location" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[30%] ">
              <label htmlFor="starttime" className="block  ml-1 mb-1">
                Event Time
              </label>
              <div className="timeInpt relative  ">
                <input
                  type="text"
                  id="strattime"
                  name="strattime"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formatTimeTo12Hour(formikObj.values.starttime) ?? ""
                      : formatTimeTo12Hour(eventDtails?.starttime) ?? ""
                  }
                  onChange={formikObj.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="description mb-2">
            <label htmlFor="description" className="block my-2">
              Event Description
            </label>
            <textarea
              spellCheck={false}
              rows={5}
              value={
                editEvent
                  ? formikObj.values.description ?? ""
                  : eventDtails?.description ?? ""
              }
              onChange={formikObj.handleChange}
              className="border resize-none border-[#ADADAD] w-full rounded-lg p-3"
              name="description"
              id="description"></textarea>
          </div>
          <div className="flex my-4 flex-wrap lg:flex-nowrap items-center gap-2">
            <div className="w-full md:w-[48%] lg:w-[24%] ">
              <label htmlFor="price" className="block  ml-1 mb-1">
                Total Price
              </label>
              <div className="priceInpt relative  ">
                <input
                  type="number"
                  id="price"
                  name="price"
                  autoComplete="off"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.price ?? ""
                      : eventDtails?.price ?? ""
                  }
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={price} alt="price" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[48%] lg:w-[24%] ">
              <label htmlFor="seats" className="block  ml-1 mb-1">
                Total Seat
              </label>
              <div className="seatsInpt relative  ">
                <input
                  type="number"
                  id="seats"
                  name="totalseats
"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.totalseats ?? ""
                      : eventDtails?.totalseats ?? ""
                  }
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={seat} alt="seat" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[48%] lg:w-[24%] ">
              <label htmlFor="availableSeats" className="block  ml-1 mb-1">
                Available Seat
              </label>
              <div className="availableSeatsInpt relative  ">
                <input
                  type="number"
                  id="availableSeats"
                  name="availableSeats"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={formikObj.values.availableSeats}
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={waitingRoom} alt="waitingRoom" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[48%] lg:w-[24%] ">
              <label htmlFor="popularity" className="block  ml-1 mb-1">
                Popularity
              </label>
              <div className="popularInpt relative  ">
                <input
                  type="text"
                  id="popularity"
                  name="popularity"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.popularity ?? ""
                      : eventDtails?.popularity ?? ""
                  }
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={popular} alt="popular" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row  items-center gap-2">
        <div className="seatAllocation rounded-2xl border border-[#ADADAD] w-full lg:w-[60%]">
          {eventDtails?.status === "closed" ? (
            <p className="text-center text-red-600 py-4">
              Seats are not available for closed events
            </p>
          ) : (
            <Seats
              seats={seats&&seats}
              eventPrice={eventDtails && eventDtails.price}
              eventId={eventId}
              latest={false}
                setSeats={setseats}
               
            />
          )}
        </div>
        <div className="editAndScanForPayment    w-full lg:w-[40%]">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <div className=" w-full xl:w-[48%]   ">
              <label htmlFor="tags" className="block  ml-1 mb-1">
                Tags
              </label>
              <div className="tagsInpt relative  ">
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.tags ?? ""
                      : eventDtails?.tags ?? ""
                  }
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={tags} alt="tags" />
                </div>
              </div>
            </div>
            <div className=" w-full xl:w-[48%]   ">
              <label htmlFor="expectedAttends" className="block  ml-1 mb-1">
                Total expectedAttends
              </label>
              <div className="seatsInpt relative  ">
                <input
                  type="number"
                  id="expectedAttends"
                  name="expectedAttends"
                  className="border border-[#ADADAD] w-full rounded-lg p-3 "
                  value={
                    editEvent
                      ? formikObj.values.expectedAttends ?? ""
                      : eventDtails?.expectedAttends ?? ""
                  }
                  onChange={formikObj.handleChange}
                />

                <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                  <img src={group} alt="expectedAttends" />
                </div>
              </div>
            </div>
          </div>
          <button className="QrCode cursor-pointer border my-2 flex flex-col lg:flex-row items-center justify-center gap-2 rounded-xl  border-[#ADADAD] p-4">
            <div className="frame w-[50%] lg:w-[25%]">
              <img src={qrCode} className="w-full" alt="Qr" />
            </div>
            <p className="max-w-[250px]">Scan QR Code for easy Payment</p>
          </button>
          {(user?.role == "admin" &&eventDtails?.status!=="closed")&& (
            <div className="editBtn flex flex-col lg:flex-row justify-center gap-2 items-center my-2">
              <button
                onClick={handleEdit}
                className={`bg-[#CF730A] cursor-pointer w-full hover:bg-[#8b4e09] lg:w-[42%] editBtn text-white rounded-lg p-2
                ${editEvent ? "hidden" : "block"}
              `}>
                Edit
              </button>
              <button
                onClick={() => {
                  handleEdit();
                  formikObj.handleSubmit();
                  handleEditVenueName();
                }}
                className={`bg-[blue] cursor-pointer w-full hover:bg-[#8b4e09] lg:w-[42%] editBtn text-white rounded-lg p-2
                ${!editEvent ? "hidden" : "block"}
              `}>
                Save Changes
              </button>

              <Link
                to={`/insightEvent/${eventId}`}
                className="attendeeInsight w-full lg:w-[50%] text-center text-white bg-[#1A6291] rounded-lg p-2">
                Attendee Insight
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
