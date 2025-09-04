import { useContext,  useEffect,  useMemo, useState } from "react";
import { Eventcontxt } from "../Contexts/EventContext";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";

import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import { formatDate } from './../../index';
import { SeatContextt } from "../Contexts/SeatContex";

export default function Seats({ seats, setSeats, latest = false, eventId,eventPrice }) {
  const getColor = (status, seatId) => {
    if (selectedSeats.includes(seatId) && status === "available") {
      return "bg-yellow-400"; // لون مميز للمقاعد المختارة
    }
    switch (status) {
      case "paid":
        return "bg-[#6340B6]";
      case "reserved":
        return "bg-[#6340B6]  opacity-[69%]";
      case "available":
        return "bg-[#D9D9D9]";
      default:
        return "bg-gray-200";
    }
  }

  const { events } = useContext(Eventcontxt);
  const { user } = useContext(AuthContext);
  const { fetchSeats } = useContext(SeatContextt);
  const API_URL = import.meta.env.VITE_API_URL;
  const latestUpcomingEvent = useMemo(() => {
    if (!events || events.length === 0) return null;

    const today = new Date();

    // فلتر الأحداث اللي تاريخها بعد النهارده
    const upcomingEvents = events.filter(
      (event) => new Date(event.date) >= today
    );
    
    if (upcomingEvents.length === 0) return null;

    // رتبهم بحسب التاريخ الأصغر (الأقرب للنهارده)
    return upcomingEvents.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )[0];
  }, [events]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmed, setconfirmed] = useState(
    JSON.parse(localStorage.getItem("confirmedSeats")) || []
  );
  const [reservedSeats, setReservedSeats] = useState(
    JSON.parse(localStorage.getItem("reservedSeats")) || []
  );
  const allReservedSeats = useMemo(() => {
    return [...new Set([...reservedSeats, ...confirmed])]; // use Set لتجنب التكرار
  }, [reservedSeats, confirmed]);
  // اختيار / إلغاء اختيار المقعد
  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };
  // تأكيد الحجز + إنشاء التذاكر
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return alert("Select at least one seat!");
    try {
      const res = await axios.post(
        `${API_URL}/tickets/book-multiple`,
        {
          eventId,
          seatIds: selectedSeats,
          userId:  user?._id||user?.id,
        }
      );

      console.log("Booked seats & tickets:", res.data);

      
     setSeats((prevSeats) =>
       prevSeats.map((seat) => {
         const updated = res.data.bookedSeats.find((s) => s._id === seat._id);
         return updated
           ? {
               ...seat,
               status: updated.status,
               bookedBy: updated.bookedBy,
               isBooked: updated.isBooked,
             }
           : seat;
       })
     );
      // إضافة المقاعد المحجوزة (reserved) إلى reservedSeats
      setReservedSeats((prev) => {
        const newReserved = [
          ...prev,
          ...res.data.bookedSeats.map((s) => s._id),
        ];
        localStorage.setItem("reservedSeats", JSON.stringify(newReserved));
        return newReserved;
      });

      setconfirmed((prev) => [...prev, ...selectedSeats]);
      localStorage.setItem(
        "confirmedSeats",
        JSON.stringify([...confirmed, ...selectedSeats])
      );
     
      setSelectedSeats([]);

      toast.success("Seats booked & tickets created successfully!");
    } catch (err) {
      console.log(err);
      
    }
  };
  //الغاء الحجز 
  const handleCancelSingleSeat = async (seatId) => {
    try {
      await axios.put(
        `${API_URL}/tickets/${eventId}/seats/${seatId}/cancel`,
        { userId: user?.id||user._id }
      );

        // تحديث حالة المقعد
     setSeats((prevSeats) =>
       prevSeats.map((seat) =>
         seat._id === seatId
           ? { ...seat, status: "available", userId: null }
           : seat
       )
     );

     //مسح التذكره الخاصه بالمقعد
        setconfirmed((prev) => prev.filter((s) => s._id !== seatId));
        localStorage.setItem(
          "confirmedSeats",
          JSON.stringify(
            JSON.parse(localStorage.getItem("confirmedSeats") || "[]").filter(
              (s) => s._id !== seatId
            )
          )
        );
      localStorage.removeItem("confirmedSeats");

      toast.info("Booking & tickets cancelled successfully!");
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    }
  };

  useEffect(() => {
    if (latestUpcomingEvent) {
     fetchSeats(latestUpcomingEvent.id);
   }
 },[latestUpcomingEvent?.id])

  
const qrData = `${window.location.origin}/#/payment?eventId=${eventId}&userId=${
  user?.id
}&seats=${allReservedSeats.join(",")}&total=${allReservedSeats.length * eventPrice}`;


  return (
    <>
      <div className="bg-white p-2 rounded-2xl shadow-md w-full lg:w-auto flex flex-wrap">
        {/* Left Side Info */}
        {latest && (
          <div className="w-full lg:w-1/3">
            <h2 className="text-xl font-bold mb-3">Latest Event</h2>
            <p className="  text-sm">
              <span className="font-semibold opacity-[47%]">Event Name:</span>{" "}
              <br />
              {latestUpcomingEvent && latestUpcomingEvent.title}
            </p>
            <p className="text-gray-700 text-sm mt-2">
              <span className="font-semibold opacity-[47%]">Event Date:</span>{" "}
              <br />
              {latestUpcomingEvent && formatDate(latestUpcomingEvent.date)}
            </p>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#6340B6]"></span>
                Paid Seats
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#6340B6] opacity-[69%]"></span>
                Reserved Seats
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-gray-300"></span>
                To be sold
              </div>
            </div>
          </div>
        )}

        {/* Right Side Seats Grid */}

        <div
          className={`w-full md:w-2/3 flex justify-center flex-col  items-center`}>
          <div className="title">
            <h3 className="font-bold text-xl mb-3 ">Seat Allocation System</h3>
          </div>
          <div className="mb-4 flex flex-col md:flex-row items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#6340B6]"></span>
              Paid Seats
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#6340B6] opacity-[69%]"></span>
              Reserved Seats
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-300"></span>
              To be sold
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid  grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
              {seats&&seats?.length > 0 ? (
                seats?.map((seat, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      seat.status === "available" && handleSeatSelect(seat._id);
                      seat.status == "reserved" &&
                        handleCancelSingleSeat(seat._id);
                    }}
                    className={`w-8 h-8 relative cursor-pointer rounded ${getColor(
                      seat.status,
                      seat._id
                    )}`}
                    title={`${
                      !latest
                        ? seat.status == "available"
                          ? "book"
                          : seat.status == "reserved"
                          ? "cancel book"
                          : "paid"
                        : ""
                    }  Seat ${seat.seatNumber} (${seat.status}) `}></div>
                ))
              ) : (
                <div>No Available Events Yet</div>
              )}
            </div>
            {selectedSeats.length > 0 && (
              <>
                <button
                  onClick={handleConfirmBooking}
                  className="bg-purple-600 cursor-pointer text-white p-2 rounded mt-2">
                  Confirm Booking ({selectedSeats.length} seats)
                </button>
              </>
            )}

            {((!latest ) && confirmed.length > 0) && (
              <div className="mt-4 flex flex-col items-center">
                <QRCodeCanvas value={qrData} size={200} />
                <p className="text-sm mt-2 text-gray-600">Scan to Pay</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
