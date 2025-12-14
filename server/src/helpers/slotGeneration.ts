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

  const slots: {
    slotTime: string;
    isBooked: boolean;
    appointmentId: null;
  }[] = [];

  const startTime = daySchedule.startTime ?? "09:00";
  const endTime = daySchedule.endTime ?? "17:00";

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const patientsPerHour = Math.max(1, Number(daySchedule.patientPerHour) || 1);
  const slotDurationMinutes = Math.floor(60 / patientsPerHour); // ✅ FIX

  let breakStartHour = -1,
    breakStartMinute = -1,
    breakEndHour = -1,
    breakEndMinute = -1;

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
    (currentHour === endHour &&
      currentMinute + slotDurationMinutes <= endMinute)
  ) {
    const slotStartHour = currentHour;
    const slotStartMinute = currentMinute;

    let slotEndMinute = slotStartMinute + slotDurationMinutes;
    let slotEndHour = slotStartHour;

    if (slotEndMinute >= 60) {
      slotEndHour += Math.floor(slotEndMinute / 60);
      slotEndMinute %= 60;
    }

    // ⛔ Skip slot if it overlaps break
    const overlapsBreak =
      daySchedule.hasBreak &&
      slotStartHour * 60 + slotStartMinute <
        breakEndHour * 60 + breakEndMinute &&
      slotEndHour * 60 + slotEndMinute > breakStartHour * 60 + breakStartMinute;

    if (!overlapsBreak) {
      const slotStart = `${slotStartHour.toString().padStart(2, "0")}:${slotStartMinute
        .toString()
        .padStart(2, "0")}`;

      const slotEnd = `${slotEndHour.toString().padStart(2, "0")}:${slotEndMinute
        .toString()
        .padStart(2, "0")}`;

      slots.push({
        slotTime: `${formatTimeToAMPM(slotStart)} - ${formatTimeToAMPM(slotEnd)}`,
        isBooked: false,
        appointmentId: null,
      });
    }

    currentMinute += slotDurationMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }

  return slots;
};
