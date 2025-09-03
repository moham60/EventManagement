import axios from "axios"
import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import LoaderScreen from "../Components/LoaderScreen";


export default function BookingAndTicket() {
  const navigate = useNavigate();
  const {user}=useContext(AuthContext)
 
  const getAllTickets = () => {
    return axios.get("http://localhost:5000/api/tickets");
  };
  const getUserTicket = () => {
    return axios.get(`http://localhost:5000/api/tickets/user/${user?.id}`);
  }
  const { data ,isLoading} = useQuery({
    queryFn: user?.role=="admin"?getAllTickets:getUserTicket,
    queryKey: ["getTickets"]
  });
  const tickets = data?.data;
  const deleteTicketsForDeletedEvents = () => {
    axios.delete("http://localhost:5000/api/tickets/cleanup").then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    });
  }
  useEffect(() => { 
    if (user) {
      deleteTicketsForDeletedEvents();
      console.log("user", user);
      console.log("tickets",tickets)
    }
   }, [user]);
  if (isLoading) {
    return <LoaderScreen/>
  }
  if (!tickets) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className=" text-4xl font-extrabold sm:text-6xl">! No Tickets Yet</p>
      </div>
    );
  }


  return (
    <>
      {tickets && (
        <div className="min-h-screen p-4 bg-gray-100">
          {user?.role == "user" && (
            <h1 className="text-center my-4 text-3xl font-extrabold">
              My Tickets
            </h1>
          )}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {tickets.map((ticket) =>
              ticket.event ? (
                <div
                  key={ticket._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden relative">
                  {/* خطوط شبيهة بالتذكرة */}
                  <div className="absolute top-0 left-0 w-full h-full border-dashed border-2 border-gray-300 rounded-xl pointer-events-none"></div>
                  <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-100 rounded-full"></div>
                  <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-100 rounded-full"></div>
                  <div className="p-3 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-2">
                      {ticket.event.title}
                    </h2>
                    <p className="text-gray-500 mb-4">
                      {new Date(ticket.event.date).toLocaleDateString()}
                    </p>

                    <div className="w-full text-center  flex justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Booked Seat</p>
                        <p className="font-semibold text-green-600">
                          {ticket.seatNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Booked Seats</p>
                        <p className="font-semibold">
                          {ticket.event.bookedSeats}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Available Seats</p>
                        <p className="font-semibold text-blue-600">
                          {ticket.event.availableSeats}
                        </p>
                      </div>
                    </div>

                    <img
                      src={ticket.qrCode}
                      alt="QR Code"
                      className="w-24 h-24 mt-2"
                    />
                    {ticket.event.availableSeats > 0 ? (
                      <button
                        onClick={() => {
                          navigate(`/eventDetails/${ticket.event._id}`);
                        }}
                        className="p-3 bg-blue-600 my-4 cursor-pointer text-white rounded-xl">
                        {user?.role == "admin" ? "book Seat" : "book another"}
                      </button>
                    ) : (
                      <p className="text-red-500">
                        All seats are Booked Or Event is Closed
                      </p>
                    )}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </>
  );
}
