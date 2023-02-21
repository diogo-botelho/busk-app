import { ChangeEvent, FormEvent, useState } from "react";
import Error from "./Error";

interface AddEventFormParams {
  submitEvent: () => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface AddEventFormData {
  title: string;
  type: string;
}

export function AddEventForm({ submitEvent }: AddEventFormParams) {
  const [formData, setFormData] = useState<AddEventFormData>({
    title: "",
    type: "",
  });
  const [errors, setErrors] = useState<string[] | []>([]);

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    try {
      evt.preventDefault();
      console.log("Submitting event form");
      submitEvent();
    } catch (err) {
      setErrors(["Something went wrong"]);
    }
  }

  return (
    <div className="background-form">
      <div className="row AddEventForm generalForm">
        <h1 className="pt-3 AddEventForm-title generalForm-title">Add Event</h1>
        <form onSubmit={handleSubmit}>
          <div className="col-6 offset-3 pt-3">
            <div className="AddEventForm-title">
              <label htmlFor="title">Title</label>
              <input
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="AddEventForm-password">
              <label htmlFor="type">Type</label>
              <input
                className="form-control"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
            {errors.length > 0 && <Error messages={errors} />}
            <div className="LoginForm-button">
              <button className="btn btn-primary mt-2">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
