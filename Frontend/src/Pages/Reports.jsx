
import { FaArrowTrendDown } from 'react-icons/fa6';
export default function Reports() {
  const API_URL = import.meta.env.VITE_API_URL;
  const handleDownload = (type) => {
    // استبدل الرابط دا بالـ API endpoint عندك
    const url = `${API_URL}/reports/${type}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="flex  flex-col min-h-screen items-center justify-center  gap-4 
      p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-700">
        Download Dashboard Reports
      </h2>
      <p className="text-gray-500 text-sm">
        اختر الصيغة المناسبة لتحميل التقرير
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleDownload("excel")}
          className="flex items-center gap-2 rounded p-2 text-white cursor-pointer bg-green-600 hover:bg-green-700">
          <FaArrowTrendDown size={18} /> Excel
        </button>

        <button
          onClick={() => handleDownload("csv")}
          className="flex items-center gap-2 rounded p-2 text-white cursor-pointer bg-blue-600 hover:bg-blue-700">
          <FaArrowTrendDown size={18} /> CSV
        </button>
      </div>
    </div>
  );
}
