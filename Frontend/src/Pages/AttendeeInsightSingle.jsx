import { Link, useParams } from "react-router-dom";
import backarrow2 from "../assets/Images/BackArrow2.png";
import axios from "axios";
import { useQuery } from "react-query";
import { formatDate, formatTimeTo12Hour } from "../..";
import Search from './../Components/Search';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import BieCharSimple from "../Components/BieCharSimple";
import BieChart from "../Components/BieChart";
import BarChar from './../Components/BarChar';
import instagram from "../assets/Images/instagram.png";
import facebook from "../assets/Images/facebook.png";
import twiter from "../assets/Images/twitter.png";
import qrcode from "../assets/Images/qr-code.png"
import { useEffect, useState } from "react";

export default function AttendeeInsightSingle() {
  const { eventId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
    const getEventById = () => {
        return axios.get(`${API_URL}/event/${eventId}`);
    }
    const data = useQuery({
        queryFn: getEventById,
        queryKey: ["getEventById", eventId]
    });
  const event = data?.data?.data;
  const [chartData, setchartData] = useState(null);
  const [totalAttendees, settotalAttendees] = useState(0)
  const getBarCharData = () => {
    axios.get(`${API_URL}/event/${eventId}/attendees/locations`).then(res => {
      console.log(res.data);
      setchartData(res.data.data);
      settotalAttendees(res.data.totalPaidUsers);
    }).catch(err => {
      console.log(err)
    });
  }
  useEffect(() => {
    getBarCharData();
  }, []);
   const [labels, setLabels] = useState([]);
   const [series, setSeries] = useState([]);
  const getAgeChart = () => {
    axios.get(
      `${API_URL}/event/${eventId}/attendees/age-groups`
    ).then(res => {
    
      const data = res.data.data;
      console.log("age data",data)
        setSeries(data.map(item => item.y));
        setLabels(data.map((item) => item.x));
    }).catch(err => {
      console.log(err)
    });
  }

   useEffect(() => {
     getAgeChart();
   }, [eventId]);
    const getIntersChart = () => {
      axios
        .get(`${API_URL}/event/${eventId}/attendees/interests`)
        .then((res) => {
          console.log(res.data)
          
        })
        .catch((err) => {
          console.log(err);
        });
  };
  useEffect(() => {
    getIntersChart();
  }, [eventId]);
  const [locations, setlocations] = useState(null)
  const getAllLocationsUsers = () => {
    axios
      .get(`${API_URL}/user/locations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        setlocations(res.data.locations)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getAllLocationsUsers(); 
  },[])
  return (
    <div className=" relative px-4 py-16 md:py-18 lg:py-0 md:px-0 bg-[#F2F2F2] min-h-screen">
      <div className="bg-white flex flex-wrap gap-10 justify-center items-center lg:justify-between p-4">
        <div className="flex flex-col   gap-2">
          <div className="flex items-center gap-2">
            <Link to={"/"} className="toEventDetails  w-8 h-8  block">
              <img src={backarrow2} alt="" />
            </Link>

            <h1>
              Atteendee Insights- {event && event.title}
            </h1>
          </div>
          <ul className="list-disc ml-14">
            <li>Event Venue: {event && event.venue?.name}</li>
            <li>Event Date: {event && formatDate(event.date)}</li>
            <li>
              Event Time: {event && formatTimeTo12Hour(event.starttime)} to{" "}
              {event && formatTimeTo12Hour(event.endtime)}
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center gap-5 ">
          <Search placeHolder={"Search"} />
          <div className="count  andFilter  flex items-center gap-4  ">
            <div className="text-[#434343] flex items-center gap-2 max-w-[250px] p-2 rounded-2xl border border-[#434343]">
              Attendees: {totalAttendees && totalAttendees}
              <HiOutlineUserGroup />
            </div>

            <button className="text-[#434343] flex items-center rounded-2xl border border-[#434343]  justify-between cursor-pointer p-2 w-[110px] ">
              Filter
              <IoIosArrowDown />
            </button>
          </div>
        </div>
      </div>
      <div className="cards  flex flex-row  flex-wrap p-4">
        <div className="left p-4  w-full lg:w-[70%] flex flex-col gap-4 items-center">
          <BieCharSimple
            title={"Age Group"}
            labels={labels && labels}
            series={series && series}
          />
          <div className="flex items-center w-full flex-wrap  gap-4">
            <div className="biechar w-full lg:w-[45%] ">
              <BieChart
                title={"Attendee Interests"}
                labels={[
                  "Live Music",
                  "Inovation",
                  "EDM Music",
                  "Food Festivals",
                ]}
              />
            </div>
            <div className="bar w-full lg:w-[45%]">
              <BarChar categories={locations} data={chartData && chartData} />
            </div>
          </div>
        </div>
        <div className="right w-full  lg:w-[30%]">
          <div className="bg-white rounded-2xl p-4">
            <h3>Engangement & Social Media Reach</h3>
            <h4 className="text-gray-500">
              How attendees enganged with the event
            </h4>
            <div className="social my-4">
              <div className="insta border-b p-3 flex items-center justify-between border-gray-400">
                <div className="flex items-center gap-1">
                  <img className="w-8" src={instagram} alt="insta" />
                  <span>Instgram Mentions</span>
                </div>
                <span className="text-emerald-400">5,200</span>
              </div>
              <div className="facebook my-4 border-b p-3 flex items-center justify-between border-gray-400">
                <div className="flex items-center gap-1">
                  <img className="w-8" src={facebook} alt="facebook" />
                  <span>Facebook Shares</span>
                </div>
                <span className="text-emerald-400">5,200</span>
              </div>
              <div className="twiter my-4 border-b p-3 flex items-center justify-between border-gray-400">
                <div className="flex items-center gap-1">
                  <img className="w-8" src={twiter} alt="twiter" />
                  <span>Twiter Twits</span>
                </div>
                <span className="text-emerald-400">5,200</span>
              </div>
              <div className="qrcode my-4 border-b p-3 flex items-center justify-between border-gray-400">
                <div className="flex items-center gap-1">
                  <img className="w-5" src={qrcode} alt="qrcode" />
                  <span>Event Check-in (QR scans)</span>
                </div>
                <span className="text-emerald-400">5,200</span>
              </div>
              <p className="text-center text-emerald-400">Total: 40,800</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
