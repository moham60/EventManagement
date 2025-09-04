import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";


export default function Layout() {
  return (
    <div className=" flex relative bg-white  flex-col  ">
      
      <Sidebar />

      {/* Main Content */}
      <div className=" ml-0    lg:ml-[250px]">
        <Outlet />
      </div>
    </div>
  );
}
