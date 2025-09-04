import Chart from "react-apexcharts";

export default function BieCharSimple({ title, labels, series = [500, 350, 245, 124] }) {
   // الأرقام اللي عايز تعرضها
const finalLabels =
  labels.length > 0 ? labels : ["18-24", "25-34", "35-44", "45+"];
const finalSeries = series.length > 0 ? series : [500, 350, 245, 124];
  const options = {
    chart: {
      type: "pie",
      toolbar: {
        show: false,
      },
    },
    labels: finalLabels,

    legend: {
      position: "bottom",
    },

    colors: ["#59C86A", "#A72711", "#8322F9", "#E7CE33"],
  };

  return (
    <div className="bg-white w-full  flex flex-col items-center rounded-2xl p-4">
      <div className="title mb-2">
        <h3 className="font-bold uppercase">{title}</h3>
      </div>
      <div className="chart">
        <Chart
          options={options}
          series={finalSeries}
          type="pie"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
