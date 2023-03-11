import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";
/**Renders a login form
 *
 * Props:
 *  - login(): function that authenticates user data
 *
 * State:
 *  - formData
 *  - errors
 *
 * Routes -> LoginForm
 * */

// interface RegistrationFormParams {
// }

const INITIAL_FORM_DATA = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

interface RegisterFormParams {
  register: (name: RegistrationFormData) => void;
}

function RegistrationForm({ register }: RegisterFormParams) {
  const [formData, setFormData] =
    useState<RegistrationFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<string[] | []>([]);
  const navigate = useNavigate();

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    try {
      evt.preventDefault();
      await register(formData);
      return navigate("/", { replace: true });
    } catch (err) {
      setErrors(["Something went wrong"]);
    }
  }

  return (
    <div className="background-form">
      <div className="row RegistrationForm generalForm">
        <h1 className="pt-3 RegistrationForm-title generalForm-title">
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="col-6 offset-3 pt-3">
            <div className="RegistrationForm-username">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="RegistrationForm-password">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="RegistrationForm-firstName">
              <label htmlFor="firstName">First Name</label>
              <input
                className="form-control"
                type="firstName"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="RegistrationForm-lastName">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="form-control"
                type="lastName"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="RegistrationForm-phone">
              <label htmlFor="phone">Phone</label>
              <input
                className="form-control"
                type="phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="RegistrationForm-email">
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.length > 0 && <Error messages={errors} />}
            <div className="RegistrationForm-button">
              <button className="btn btn-primary mt-2">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
