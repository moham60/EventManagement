export function formatDate(date){
     const formattedDate = new Date(date).toLocaleDateString("en-GB", {
       day: "numeric",
       month: "long",
       year: "numeric",
     
     });
    return formattedDate;
}

export function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // format required for input type="date"
}

export function formatTimeTo12Hour(timeStr) {
  if (!timeStr) return "";
  let [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // 0 -> 12
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
