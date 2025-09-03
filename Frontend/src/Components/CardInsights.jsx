
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";

export default function CardInsights({ insight, rightTopIcon, heading2, count, increase = true, percentage }) {
  return (
    <div className="bg-white shadow  w-full rounded-2xl relative px-4 py-5">
      <div className="flex items-center justify-between">
        <h3>{insight}</h3>
        {rightTopIcon}
      </div>
      <h2 className="font-extrabold my-2">{heading2}</h2>
      {increase ? (
        <p className="ml-5 flex items-center gap-1  text-emerald-500">
          <FaArrowTrendUp /> <span>{percentage}% increase</span>
        </p>
      ) : (
        <p className="ml-5 flex items-center gap-1  text-[red]">
          <FaArrowTrendDown />
          <span>{percentage}% decrease</span>
        </p>
      )}
      <span className="count absolute bottom-2 right-2 ">{count}</span>
    </div>
  );
}
