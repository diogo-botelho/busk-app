import { ChangeEvent, FormEvent, useState } from "react";

import { Button, TextInput, Box } from "@mantine/core";
import { useForm } from "@mantine/form";

import ErrorMessage from "../common/ErrorMessage";
import { LoginFormData } from "../interfaces/LoginFormData";

interface LoginFormParams {
  login: (email: LoginFormData) => void;
}

/**Login form.
 *
 * Shows form and manages update to state on changes.
 *
 * Props:
 *  - login(): function that authenticates user data
 *
 * State:
 *  - formData: tracks data inserted into form.
 *  - errors: tracks errors.
 *
 * On submission:
 *  - calls login function prop
 *
 * AllRoutes -> LoginForm -> ErrorMessage
 * Routed as /login
 * */

function LoginForm({ login }: LoginFormParams) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<string[] | []>([]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 5 ? null : "Password is too short"),
    },
  });

  /** Handle form submit:
   *
   * Calls login func prop and, if not successful, sets errors.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    console.log("submitting form")
    try {
      await login(formData);
    } catch (err) {
      if (Array.isArray(err)) {
        setFormErrors(["Invalid email or password."]);
      } else {
        setFormErrors([`${err}`]);
      }
    }
  }

  /** Update form data field */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <Box component="form" maw={400} mx="auto" onSubmit={form.onSubmit((values) => {
      console.log(values)
      handleSubmit
      })}>
      <header className="p-3 mb-4 bg-light border rounded-3">
        <h1 className="text-center">Log In</h1>
      </header>
      
        <TextInput
          label="Email"
          id="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          {...form.getInputProps('email')}
          
        />
        <TextInput
          label="Password"
          id="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          type="password"
          {...form.getInputProps('password')}
          
        />

        {formErrors.length > 0 && <ErrorMessage messages={formErrors} />}

        <Button type="submit" className="btn-primary mt-2" variant="filled">
          Submit
        </Button>
      
    </Box>
  );
}

export default LoginForm;
