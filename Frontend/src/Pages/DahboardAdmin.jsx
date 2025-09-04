import { useContext} from "react"
import maskGroup from "../assets/Images/Maskgroup.png"
import { AuthContext} from "../Contexts/AuthContext";
import { IoNotifications } from "react-icons/io5";
import expectedEvent from "../assets/Images/EventAccepted.png"
import dancing from "../assets/Images/Dancing.png"
import { Eventcontxt } from './../Contexts/EventContext';
import MovieTicket from "../assets/Images/MovieTicket.png";
import Transaction from "../assets/Images/Transaction.png"
import { formatDate } from './../../index';
import NetSalesCard from "../Components/NetSalesCard";
import BieChart from "../Components/BieChart";
import Search from "../Components/Search";
import Seats from "../Components/Seats";
import { SeatContextt } from "../Contexts/SeatContex";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import LoaderScreen from "../Components/LoaderScreen";


export default function DahboardAdmin() {
  const { user } = useContext(AuthContext);
  const { events } = useContext(Eventcontxt);
const API_URL = import.meta.env.VITE_API_URL;

  const { seats } = useContext(SeatContextt);
  const getData = () => {
    return axios.get(`${API_URL}/dashboard/stats`);
  }
  const {data,isLoading} = useQuery({
    queryFn: getData,
    queryKey: ["getStats"]
  });
  const infoCards = data?.data;
 
  if (isLoading||!user||!events) {
    return <LoaderScreen/>
  }
  return (
    <div className="px-4 py-2 bg-[#F2F2F2] min-h-screen">
      <div className="nav flex flex-col lg:flex-row gap-4  items-center justify-between bg-black rounded-xl p-4 m-2">
        <div className="left w-full lg:w-auto flex items-center gap-2">
          <img src={maskGroup} alt="maskGroup" />
          <p className="text-white">Welcome {user?.name && user.name}</p>
        </div>
        <div className="right w-full lg:w-auto hidden md:flex items-center gap-2">
          <Search />
          <div className="notification flex items-center justify-center rounded-full bg-white w-10 h-10 ">
            <IoNotifications size={20} />
          </div>
          <div className="expectedEvent flex items-center justify-center rounded-full bg-white w-10 h-10 ">
            <img src={expectedEvent} alt="expectedEvent" />
          </div>
        </div>
      </div>
      <div className="cards flex flex-col lg:flex-row   gap-2">
        <div className="left  w-full lg:w-[75%] flex flex-col p-2">
          <div className="top flex flex-col lg:flex-row items-center gap-4">
            <div className="card w-full  lg:w-[30%] px-2 py-6 flex items-center gap-4 bg-white shadow rounded-xl">
              <img src={dancing} alt="dancing" />
              <div>
                <h3 className="font-medium uppercase">Events</h3>
                <h4 className="text-[#1968AF] font-bold text-[24px]">
                  {infoCards && infoCards.totalEvents} Events
                </h4>
              </div>
            </div>
            <div className="card w-full  lg:w-[30%] px-2 py-6 flex items-center gap-4 bg-white shadow rounded-xl">
              <img src={MovieTicket} alt="dancing" />
              <div>
                <h3 className="font-medium uppercase">Booking</h3>
                <h4 className="text-[#F29D38] font-bold text-[24px]">
                  {infoCards && infoCards.totalBookings}
                </h4>
              </div>
            </div>
            <div className="card w-full  lg:w-[30%] px-2 py-6 flex items-center gap-4 bg-white shadow rounded-xl">
              <img src={Transaction} alt="dancing" />
              <div>
                <h3 className="font-medium uppercase">Revenue</h3>
                <h4 className="text-[#197920] font-bold text-[24px]">
                  {infoCards && infoCards.totalRevenue} EG
                </h4>
              </div>
            </div>
          </div>
          <div className="middle flex flex-col lg:flex-row items-center gap-4 my-4 netSales">
            <div className="left w-full lg:w-[68%]">
              <NetSalesCard />
            </div>
            <div className="right flex justify-center md:block w-full lg:w-[35%] ">
              <BieChart title={"Customer Engangment"} />
            </div>
          </div>
          <div className="bottom">
            <Seats seats={seats && seats} latest   />  
          </div>   
        </div>
        <div className="right w-full lg:w-auto  self-baseline mt-3 flex p-4 rounded-2xl bg-white flex-col gap-4">
          <div className="UpComingEvent">
            <h3 className="text-[#4F4F4F] font-extrabold">UPCOMING EVENTS</h3>
          </div>
          <div className="events flex flex-col items-center gap-4">
            <div className="space-y-4">
              {events && events?.length > 0 ? (
                <>
                  {/* عرض أول 3 أحداث */}
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className="border p-3 w-full border-[#EEEEEE] rounded-xl">
                      <p>Event: {event.title}</p>
                      <p className="mt-2">Date: {formatDate(event.date)}</p>
                    </div>
                  ))}

                  {/* زر See All لو فيه أكثر من 3 أحداث */}
                  {events?.length > 3 && (
                    <Link
                      to="/ManageEvents"
                      onClick={() => console.log("Go to all events page")}
                      className="mt-2 text-gray-400 underline  block text-center">
                      See All
                    </Link>
                  )}
                </>
              ) : (
                <p>No Available Events Yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
