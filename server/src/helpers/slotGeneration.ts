const formatTimeToAMPM = (time24: string): string => {
  if (!time24) return "12:00 AM";
  const [hoursStr, minutesStr] = time24.split(":");
  const hours = Number(hoursStr) || 0;
  const minutes = Number(minutesStr) || 0;
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Helper function to generate time slots
export const generateTimeSlots = (daySchedule: any) => {
  if (!daySchedule.isWorking) return [];

  const slots: Array<{
    slotTime: string;
    isBooked: boolean;
    appointmentId: null;
  }> = [];

  const startTime = daySchedule.startTime || "09:00";
  const endTime = daySchedule.endTime || "17:00";

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const patientsPerHour = Number(daySchedule.patientPerHour) || 1;
  const slotDurationMinutes = 60 / patientsPerHour;

  let breakStartHour = 0,
    breakStartMinute = 0,
    breakEndHour = 0,
    breakEndMinute = 0;

  if (daySchedule.hasBreak && daySchedule.breakStart && daySchedule.breakEnd) {
    [breakStartHour, breakStartMinute] = daySchedule.breakStart
      .split(":")
      .map(Number);
    [breakEndHour, breakEndMinute] = daySchedule.breakEnd
      .split(":")
      .map(Number);
  }

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const slotStart = `${currentHour.toString().padStart(2, "0")}:${Math.round(currentMinute).toString().padStart(2, "0")}`;

    let slotEndMinute = Math.round(currentMinute + slotDurationMinutes);
    let slotEndHour = currentHour;

    if (slotEndMinute >= 60) {
      slotEndHour += Math.floor(slotEndMinute / 60);
      slotEndMinute = slotEndMinute % 60;
    }

    const slotEnd = `${slotEndHour.toString().padStart(2, "0")}:${slotEndMinute.toString().padStart(2, "0")}`;

    const isBreakTime =
      daySchedule.hasBreak &&
      (currentHour > breakStartHour ||
        (currentHour === breakStartHour &&
          currentMinute >= breakStartMinute)) &&
      (currentHour < breakEndHour ||
        (currentHour === breakEndHour && currentMinute < breakEndMinute));

    if (!isBreakTime) {
      slots.push({
        slotTime: `${formatTimeToAMPM(slotStart)} - ${formatTimeToAMPM(slotEnd)}`,
        isBooked: false,
        appointmentId: null,
      });
    }

    currentMinute += slotDurationMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  return slots;
};
