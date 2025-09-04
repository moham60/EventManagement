import Chart from "react-apexcharts";

export default function BieChart({
  labels  ,title,height=300}) {
  const options = {
    chart: {
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    labels: labels,
   
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    colors: ["#0DF38A", "#7224F2", "#2D44EC", "#FF371F"],
  };
    const finalLabels =
      labels.length > 0 ? labels : ["18-25", "Gr", "Group C", "Group D"];
    const finalSeries = series.length > 0 ? series : [44, 55, 41, 67];


  return (
    <div className="bg-white w-full  p-4 flex flex-col justify-center items-center rounded-2xl">
      <div className="title my-4">
        <h3 className="font-bold uppercase">{ title}</h3>
      </div>
      <div className="chart ">
        <Chart options={options} series={series} type="donut" width="300" height={height} />
      </div>
    </div>
  );
}
