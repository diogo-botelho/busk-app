import axios, { AxiosError } from "axios";

import { LoginFormData } from "../interfaces/LoginFormData";
import { RegistrationFormData } from "../interfaces/RegistrationFormData";
import { Coordinates } from "../interfaces/Coordinates";

import { BACKEND_BASE_URL } from "../config";

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
  static token: string | undefined;

  static async request(endpoint: string, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BACKEND_BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${BuskApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        let message = err.response.data.error.message;
        throw Array.isArray(message) ? message : [message];
      } else {
        throw new Error("Something went wrong. Please try again later.");
      }
    }
  }

  /** User API Routes */

  /** Function to get the current user. Takes username, returns a token. */
  static async getCurrentUser(username: string) {
    let res = await this.request(`users/${username}`);
    return res;
  }

  /** Function to log in a user, takes an object {username, password}
   *  Returns token */
  static async login(loginData: LoginFormData) {
    const res = await this.request("auth/login", loginData, "post");
    return res.token;
  }

  /** Function to register a new user. Takes an object
   * { username, password, firstName, lastName, phone, email }. Returns token */
  static async register(registerData: RegistrationFormData) {
    const res = await this.request("auth/register", registerData, "post");
    return res.token;
  }

  /** Event API Routes */

  /** Function to create a new event, takes an object eventDetails
   * { title, type, coordinates }. Returns event. */
  static async createEvent(eventDetails: EventDetails) {
    const res = await this.request("events/create", eventDetails, "post");
    return res.event;
  }

  /** Function to get all events. Returns [event, event,event] */
  static async getEvents() {
    const res = await this.request("events/");

    return res;
  }

  /** Function to get an event. Takes eventId. Returns event */
  static async updateEvent(eventId: number,updateData:EventDetails) {
    const res = await this.request(`events/${eventId}`, updateData, "patch");

    return res;
  }

  /** Function to get an event. Takes eventId. Returns event */
  static async removeEvent(eventId: number) {
    const res = await this.request(`events/${eventId}`, {}, "delete");

    return res;
  }
}

export default BuskApi;
