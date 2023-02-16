import { ChangeEvent, FormEvent, useState } from "react";
import Error from "./Error";
import { LoginFormData } from "./interfaces/LoginFormData";
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

interface LoginFormParams {
  login: (username: LoginFormData) => void;
}

function LoginForm({ login }: LoginFormParams) {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
  });
  const [errors, setErrors] = useState<string[] | []>([]);

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    try {
      evt.preventDefault();
      await login(formData);
    } catch (err) {
      setErrors(["Something went wrong"]);
    }
  }

  return (
    <div className="background-form">
      <div className="row LoginForm generalForm">
        <h1 className="pt-3 LoginForm-title generalForm-title">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="col-6 offset-3 pt-3">
            <div className="LoginForm-username">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {/* <div className="LoginForm-password">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div> */}
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

export default LoginForm;
