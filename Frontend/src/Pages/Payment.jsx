// src/Components/Payment.jsx
import { useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SeatContextt } from "../Contexts/SeatContex";


export default function Payment() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const userId = searchParams.get("userId"); 
  const total = searchParams.get("total") || 0;
  const [isPaid, setIsPaid] = useState(false);
  const [bookedseats, setbookedseats] = useState([]);
  const seatsIds = JSON.parse(localStorage.getItem("confirmedSeats"));
  const { fetchSeats } = useContext(SeatContextt);
  const API_URL = import.meta.env.VITE_API_URL;
  const handlePayment = async () => {
    try {
      await axios.post(`${API_URL}/pay/${eventId}`, {
        seatIds: seatsIds,
        userId,
      });
      setIsPaid(true);
      localStorage.removeItem("confirmedSeats");
      fetchSeats(eventId);
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };
   const getEventById = () => {
     axios
       .get(`${API_URL}/event/${eventId}`)
       .then((res) => {
         console.log(res.data);
         setbookedseats((res.data.seats.filter(el=>el.status==="reserved")));
          console.log("bookedseats",bookedseats)
       })
       .catch((err) => {
         console.log(err);
       });
   };
   useEffect(() => {
     getEventById();
    }, []);

  if (bookedseats.length==0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold text-lg">
          ❌ لم يتم اختيار أي مقاعد
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          💳 صفحة الدفع
        </h1>

        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          المقاعد المختارة:
        </h2>
        <ul className="grid grid-cols-2 gap-3 mb-6">
          {bookedseats.map((seat, index) => (
            <li
              key={index}
              className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg text-center shadow-sm">
              🎟 المقعد رقم: {seat.seatNumber}
            </li>
          ))}
        </ul>

        <p className="text-xl font-bold text-gray-800 mb-6 text-center">
          الإجمالي: <span className="text-green-600">{total} $</span>
        </p>

        {!isPaid ? (
          <button
            onClick={handlePayment}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-200">
            ✅ ادفع الآن
          </button>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <p className="text-green-600 font-bold text-lg mb-4">
              ✅ تم الدفع بنجاح
            </p>
            <h3 className="mb-4 text-gray-700 font-medium">
              🎟 QR Code الخاص بتذكرتك:
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {bookedseats&&bookedseats.map((seat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-gray-100 p-4 rounded-xl shadow-md">
                  <QRCodeSVG
                    value={`Event:${eventId},Seat:${seat.seatNumber},User:${userId}`}
                    size={120}
                  />
                  <p className="text-sm font-semibold text-gray-700 mt-2">
                    المقعد: {seat.seatNumber}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
