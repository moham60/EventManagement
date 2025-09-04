import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Images/imgi_2_default.png";
import controlPanel from "../assets/Images/Control Panel.png";
import eventManage from "../assets/Images/EventAccepted2.png";
import logOut from "../assets/Images/Logout.png"
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import Collaborating from "../assets/Images/CollaboratingInCircle.png";
import statistics from "../assets/Images/Statistics.png";
import { VscClose } from "react-icons/vsc";
import { HiOutlineUserGroup } from "react-icons/hi2";

import { BsThreeDots } from "react-icons/bs";

export default function Sidebar() {
  const navigate = useNavigate();
  const { settoken, user,setUser } = useContext(AuthContext);
  const sideBarRef = useRef(null);
  const [open, setopen] = useState(false);
  const handleOpenSideBar = () => {
    sideBarRef.current.classList.remove("right-[-100%]");
    sideBarRef.current.classList.add("right-0");
    setopen(true);
  }
   const handleCloseSideBar = () => {
     sideBarRef.current.classList.add("right-[-100%]");
     sideBarRef.current.classList.remove("right-0");
      setopen(false);
  };
  
 
    return (
      <>
        <div className="bg-[#1E1E1E] text-white flex justify-between items-center lg:hidden fixed top-0 left-0 right-0 z-50 py-2 px-6">
          <Link to={"/"} className="logo flex   items-center gap-4">
            <img
              className="w-7 rounded-full border h-7"
              src={logo}
              alt="logo"
            />
            <div className="title hidden md:block relative">
              <h2 className="text-[18px]">EventX</h2>
              <span className="Reenie  text-[18px]">studio</span>
            </div>
          </Link>
          <div className="right transition duration-150">
            <button
              onClick={() => {
                if (open) {
                  handleCloseSideBar();
                } else {
                  handleOpenSideBar();
                }
              }}
              className="cursor-pointer">
              {open ? (
                <VscClose color="white" size={25} />
              ) : (
                <BsThreeDots color="white" size={25} />
              )}
            </button>
          </div>
        </div>
        <div
          ref={sideBarRef}
          className="bg-[#1E1E1E] transition-all duration-500 ease-in   p-4 w-[250px] right-[-100%] top-10 lg:left-0  lg:top-0   fixed z-52    text-white min-h-screen">
          <div className="logo flex  items-center gap-4">
            <img
              className="w-7 rounded-full border h-7"
              src={logo}
              alt="logo"
            />
            <div className="title  relative">
              <h2 className="text-[24px]">EventX</h2>
              <span className="Reenie  text-[24px]">studio</span>
            </div>
          </div>
          <div className="addQuickEvent hidden md:flex my-4   bg-[#282828] p-2 rounded-xl  items-center gap-4">
            <button className="p-2 h-7  text-2xl cursor-pointer w-7 flex items-center justify-center rounded bg-[#C1FF72] ">
              +
            </button>
            <div>
              <p>Add Quick Event</p>
              <span className="block text-sm">Events</span>
            </div>
          </div>
          <div className="border-b  my-7"></div>
          <div className="mainNavigation">
            <ul className=" flex  gap-6 flex-col ">
              <li className="flex items-center gap-3">
                {user?.role == "admin" ? (
                  <Link
                    className="flex items-center gap-2"
                    to={"/adminDashboard"}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={controlPanel}
                      alt=""
                    />
                    <span >Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    className="flex items-center gap-2"
                    to={"/userDashboard"}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={controlPanel}
                      alt=""
                    />
                    <span>Dashboard</span>
                  </Link>
                )}
              </li>
              {user?.role == "admin" ? (
                <li className="flex   items-center gap-3">
                  <Link className="flex items-center gap-2" to={"ManageEvents"}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={eventManage}
                      alt=""
                    />
                    <span>Manage Events</span>
                  </Link>
                </li>
              ) : (
                <li className="flex   items-center gap-3">
                  <Link
                    className="flex items-center gap-2"
                    to={"browseEvents"}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={eventManage}
                      alt=""
                    />
                    <span>Browse Events</span>
                  </Link>
                </li>
              )}
              {user?.role == "admin" && (
                <li className="flex   items-center gap-3">
                  <Link
                    className="flex items-center gap-2"
                    to={"allAttendeeInsights"}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={Collaborating}
                      alt=""
                    />
                    <span>Attendee Insights</span>
                  </Link>
                </li>
              )}
              <li className="flex   items-center gap-3">
                <Link className="flex items-center gap-2" to={"tickets"}>
                  <img
                    className="w-[25px] h-[25px]"
                    src={Collaborating}
                    alt=""
                  />
                  <span>Booking and Tickets</span>
                </Link>
              </li>
              {user?.role == "admin" && (
                <li className="flex   items-center gap-3">
                  <Link
                    className="flex items-center gap-2"
                    to={"reportsAndAnalytics"}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={statistics}
                      alt="statistics"
                    />
                    <span className="">Reports & Analytics</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="border-t  my-7"></div>
          <div className="acctountManagement">
            <h3 className="my-4">Account Management</h3>
            <div className="border-t  my-7"></div>
            <ul className="flex flex-col  gap-4">
              {user?.role == "user" && (
                <li className="flex   items-center gap-3">
                  <Link className="flex items-center gap-2" to={"profile"}>
                    <HiOutlineUserGroup className="text-white" size={30} />
                    <span className="capitalize">complete profile</span>
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={() => {
                    settoken(null);
                    setUser(null);
                    navigate("/login");
                    localStorage.clear();
                  }}
                  className="logOut flex items-center gap-2 cursor-pointer">
                  <img src={logOut} className="w-[20px] h-[20px]" alt="" />
                  <span>LogOut</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
}
