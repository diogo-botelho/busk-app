import axios from "axios";

import { LoginFormData } from "./interfaces/LoginFormData";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";
import { Coordinates } from "./interfaces/Coordinates";
import { BACKEND_BASE_URL } from "./config";

interface EventDetails {
  buskerId: number | undefined;
  title: string;
  type: string;
  coordinates: Coordinates;
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
    const url = `${BACKEND_BASE_URL}/${endpoint}`;
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
    console.log("api call", eventDetails);

    const res = await this.request("events/create", eventDetails, "post");
    return "Event added.";
  }

  /**
   * function to get all events. Returns [event, event,event] */
  static async getEvents() {
    const res = await this.request("events/");

    return res;
  }
}

export default BuskApi;
