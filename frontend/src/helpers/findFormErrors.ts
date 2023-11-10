import { EventFormData, EventFormErrors } from "../interfaces/EventFormData";

export default function findFormErrors(eventData: EventFormData) {
  const newErrors: EventFormErrors = {};
  if (!eventData.title || eventData.title === "")
    newErrors.title = "Please include a title";
  if (!eventData.type || eventData.type === "")
    newErrors.type = "Please include a type";
  if (!eventData.date || eventData.date === "")
    newErrors.date = "Please include a date";
  if (!eventData.startTime || eventData.startTime === "")
    newErrors.startTime = "Please include a start time";
  if (!eventData.endTime || eventData.endTime === "")
    newErrors.endTime = "Please include a end time";
  if (!eventData.coordinates)
    newErrors.coordinates = "Please select a location";

  return newErrors;
}
