import axios from "axios";

import { LoginFormData } from "./interfaces/LoginFormData";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

interface EventDetails {
  title: string;
  type: string;
  coordinates: Coordinates | null;
}

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class BuskApi {
  // static token = localStorage.getItem("token");
  // // static token = null;
  static async request(endpoint: string, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params })).data;
    } catch (err) {
      console.log("error");
      // console.error("API Error:", err.response);
      // let message = err.response.data.error.message;
      // throw Array.isArray(message) ? message : [message];
    }
  }

  /** function to log in a user, takes an object {username, password}
   * returns token */
  static async login(username: LoginFormData) {
    const res = (await this.request("auth/login", username, "post")).user;
    //   this.token = res.token;
    return res;
  }

  /** function to register a new user
   * takes an object  { username, password, firstName, lastName, email }
   * returns token */
  static async register({
    username,
    firstName,
    lastName,
    phone,
    email,
  }: RegistrationFormData) {
    // console.log("Api newUserData:", { newUserData });
    const res = await this.request(
      "auth/register",
      { username, firstName, lastName, phone, email },
      "post"
    );

    //   this.token = res.token;
    return res;
  }

  /**
   * function to create a new event, takes an object
   * eventDetails { title, type, coordinates }
   * Returns string "Event added." */
  static async createEvent(eventDetails: EventDetails) {
    console.log(eventDetails);
    // const res = (await this.request("events/create", eventDetails, "post"));
    return "Event added.";
  }
}

export default BuskApi;
