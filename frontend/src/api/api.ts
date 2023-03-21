import axios, { AxiosError } from "axios";
import { LatLngExpression } from "leaflet";

import { BACKEND_BASE_URL } from "../config";
import { LoginFormData } from "../interfaces/LoginFormData";
import { SignupFormData } from "../interfaces/SignupFormData";

interface EventDetailsInterface {
  buskerId: number | undefined;
  title: string;
  type: string;
  coordinates: LatLngExpression;
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

  /** Get the current user. Takes username.
   * Returns user object {userId, username, firstName, lastName, phone, email}
   */
  static async getCurrentUser(username: string) {
    let res = await this.request(`users/${username}`);
    return res;
  }

  /** Log in a user. Takes an object {username, password}. Returns token */
  static async login(loginData: LoginFormData) {
    const res = await this.request("auth/login", loginData, "post");
    return res.token;
  }

  /** Signup a new user.
   *  Takes an object { username, password, firstName, lastName, phone, email }.
   *  Returns token */
  static async signup(signupData: SignupFormData) {
    const res = await this.request("auth/signup", signupData, "post");
    return res.token;
  }

  /** Event API Routes */

  /** Get all events. Returns [{buskerId, title, type, coordinates}, ...] */
  static async getEvents() {
    const res = await this.request("events/");

    return res;
  }

  /** Get details on a event by eventId. */

  static async getEvent(eventId: number | undefined) {
    let res = await this.request(`events/${eventId}`);
    return res.event;
  }

  /** Create a new event.
   *  Takes an object eventDetails { title, type, coordinates }.
   *  Returns event. */
  static async createEvent(eventDetails: EventDetailsInterface) {
    const res = await this.request("events/create", eventDetails, "post");
    return res.event;
  }

  /** Update an event.
   *  Takes eventId and an object eventDetails { title, type, coordinates }.
   *  Returns event */
  static async updateEvent(eventId: number, updateData: EventDetailsInterface) {
    const res = await this.request(`events/${eventId}`, updateData, "patch");

    return res.event;
  }

  /** Get an event.
   *  Takes eventId.
   *  Returns event */
  static async removeEvent(eventId: number) {
    const res = await this.request(`events/${eventId}`, {}, "delete");

    return res;
  }
}

export default BuskApi;
