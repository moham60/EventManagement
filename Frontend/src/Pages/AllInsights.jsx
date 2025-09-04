import { HiOutlineUserGroup } from "react-icons/hi2";
import people from "../assets/Images/People.png"
import Search from "../Components/Search";
import CardInsights from './../Components/CardInsights';
import googleGroup from "../assets/Images/GoogleGroups.png";
import webAdvertisement from "../assets/Images/WebAdvertising.png";
import location from "../assets/Images/Location.png";
import gender from "../assets/Images/Gender.png";

import { FiCalendar } from "react-icons/fi";
import BarChar from "../Components/BarChar";
import BieChart from './../Components/BieChart';
import BieCharSimple from "../Components/BieCharSimple";

export default function AllInsights() {
  return (
    <div className="bg-[#F2F2F2] px-4 py-16 min-h-screen p-4">
      <div className="header p-4 gap-2 flex-col items-center  lg:flex-row  bg-white rounded-2xl flex  justify-center lg:justify-between">
        <div className="left flex items-center gap-2">
          <img src={people} alt="peopel" />
          <h1>All Attendee Insights</h1>
        </div>
        <div className="right flex flex-col  md:flex-row items-center gap-3">
          <div className="count max-w-[250px] p-2 flex items-center rounded-2xl border border-[#434343] ">
            <span className="text-[#434343]">Attendees: 7523</span>
            <HiOutlineUserGroup />
          </div>
          <Search />
        </div>
      </div>
      <div className="cards flex mt-4 flex-col   lg:flex-row gap-2">
        <div className="left w-full   lg:w-[30%] flex items-center flex-col gap-8">
          <CardInsights
            insight={"Attendee age"}
            heading2={"18-24 Years"}
            increase
            count={"2345"}
            percentage={"35"}
            rightTopIcon={<FiCalendar />}
          />
          <CardInsights
            insight={"Attendee age"}
            heading2={"18-24 Years"}
            increase
            count={"2345"}
            percentage={"35"}
            rightTopIcon={<img src={gender} alt="gender" />}
          />
          <CardInsights
            insight={"Attendee age"}
            heading2={"18-24 Years"}
            increase
            count={"2345"}
            percentage={"35"}
            rightTopIcon={<img src={location} alt="location" />}
          />
          <CardInsights
            insight={"Attendee age"}
            heading2={"18-24 Years"}
            increase={false}
            count={"2345"}
            percentage={"25"}
            rightTopIcon={<img src={googleGroup} alt="googleGroup" />}
          />
          <CardInsights
            insight={"Attendee age"}
            heading2={"18-24 Years"}
            increase={false}
            count={"2345"}
            percentage={"25"}
            rightTopIcon={<img src={webAdvertisement} alt="webAdvertisement" />}
          />
        </div>
        <div className="right w-full lg:w-[69%] flex flex-col gap-2">
          <BarChar />
          <div className="bottom flex flex-col xl:flex-row  items-center gap-4">
            <BieChart
              labels={[
                "interest-A",
                "interest-B",
                "interest-C",
                "interest-D",
                "interest-E",
              ]}
              title={"Attendee Insights"}
            />
            <BieCharSimple
              title={"Attendee age"}
              labels={[
                "18-24 Years",
                "25-34 Years",
                "35-44 Years",
                "44+ Years",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
