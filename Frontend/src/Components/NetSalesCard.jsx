
import { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Eventcontxt } from "../Contexts/EventContext";
import axios from "axios";

const weeklyData = [
  { name: "Week 1", value:300 },
  { name: "Week 2", value:400 },
  { name: "Week 3", value:200 },
  { name: "Week 4", value:500},
  { name: "Week 5", value:100,},
  { name: "Week 6", value:1000 },
  { name: "Week 7", value:1200 },
];
const monthlyData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value:1400  },
  { name: "Mar", value: 1500},
  { name: "Apr", value:1700  },
  { name: "May", value: 1800 },
  { name: "Jun", value: 1900 },
];

export default function NetSalesCard() {
    const [filter, setFilter] = useState("weekly");
 
const data = filter === "weekly" ? weeklyData : monthlyData;
     const API_URL = import.meta.env.VITE_API_URL;
      const [infoCards, setinfoCards] = useState(null)
      useEffect(() => {
        axios.get(`${API_URL}/dashboard/stats`).then(res => {
          setinfoCards(res.data);
          console.log(res.data)
    
        }).catch(err => {
          console.log(err);
        });
      },[])
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">NET SALES</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-black text-white text-sm px-3 py-1 rounded-lg cursor-pointer">
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 text-center mb-6">
        <div>
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-red-500 font-bold">
            {infoCards && infoCards.totalRevenue} EG
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Total Tickets</p>
          <p className="text-red-500 font-bold">
            {infoCards && infoCards.totalBookings} Tickets{" "}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Total Events</p>
          <p className="text-red-500 font-bold">
            {infoCards&&infoCards.totalEvents} Events
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f87171"
            strokeWidth={3}
            dot={{ r: 5, fill: "#f87171" }}>
            <LabelList dataKey="value" position="top" />
            <LabelList dataKey="percent" position="bottom" />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
