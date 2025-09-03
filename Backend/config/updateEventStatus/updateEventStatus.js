// Function to update event status
const upadateEventstatus = async (event) => {
  const now = new Date();
  // check if event ended
  const eventDateTime = new Date(event.date);
  if (event.endtime) {
    const [h, m] = event.endtime.split(":");
    eventDateTime.setHours(h, m);
  }
  // حساب الفرق بالميلي ثانية
  const diff = eventDateTime - now;
  const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 أيام بالميلي ثانية

  if (now > eventDateTime) {
    event.status = "completed";
  } else if (event.bookedSeats >= event.totalseats) {
    event.status = "closed";
  } else if (diff <= threeDays) {
    event.status = "pending"; // الايفنت معاده قرب فاضل 3 ايام
  } else {
    event.status = "upcoming";
  }
  await event.save();
}
 
module.exports=upadateEventstatus