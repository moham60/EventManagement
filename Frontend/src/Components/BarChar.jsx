
import  Chart  from 'react-apexcharts';

export default function BarChar({
  data = [
    { x: "South Korea", y: 853, fillColor: "#004FFF" },
    { x: "Canada", y: 743, fillColor: "#E51C1F" },
    { x: "United Kingdom", y: 763, fillColor: "#0B862C" },
    { x: "Netherlands", y: 934, fillColor: "#9A20C2" },
    { x: "Italy", y: 783, fillColor: "#0B0602" },
    { x: "France", y: 643, fillColor: "#F37A23" },
    { x: "Japan", y: 687, fillColor: "#1ACAC1" },
    { x: "United States", y: 936, fillColor: "#CBCB3B" },
    { x: "China", y: 573, fillColor: "#767676" },
    { x: "Germany", y: 360, fillColor: "#D249C9" }
  ],
  categories=[
        "South Korea",
        "Canada",
        "United Kingdom",
        "Netherlands",
        "Italy",
        "France",
        "Japan",
        "United States",
        "China",
        "Germany",
      ]
}
)

{
  // ✅ لو array فاضية استخدم القيم الافتراضية
  const finalData =
    data.length > 0
      ? data
      : [
          { x: "South Korea", y: 853, fillColor: "#004FFF" },
          { x: "Canada", y: 743, fillColor: "#E51C1F" },
          { x: "United Kingdom", y: 763, fillColor: "#0B862C" },
          { x: "Netherlands", y: 934, fillColor: "#9A20C2" },
          { x: "Italy", y: 783, fillColor: "#0B0602" },
          { x: "France", y: 643, fillColor: "#F37A23" },
          { x: "Japan", y: 687, fillColor: "#1ACAC1" },
          { x: "United States", y: 936, fillColor: "#CBCB3B" },
          { x: "China", y: 573, fillColor: "#767676" },
          { x: "Germany", y: 360, fillColor: "#D249C9" },
        ];
  const finalCategories =
    categories.length > 0
      ? categories
      : [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany",
        ];
  var options = {
    series: [
      {
        data: finalData,
      },
    ],
    grid: {
      borderColor: "#999999",
      strokeDashArray: 1,
    },
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: "end",
        horizontal: false,
        columnWidth: "35%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: finalCategories,
    },
  };

  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="title my-3">
        <h2 className="uppercase font-extrabold">All attendees Locations</h2>
      </div>
      <div className="chart">
        <Chart
          options={options}
          series={options.series}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
}
