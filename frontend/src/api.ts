import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

interface LoginFormData {
    username: string;
  }
  
interface RegistrationFormData {
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }

class BuskApi {
  
    // static token = localStorage.getItem("token");
    // // static token = null;
    static async request(endpoint: string, data = {}, method = "get") {
      console.debug("API Call:", endpoint, data, method);
  
      const url = `${BASE_URL}/${endpoint}`;
      const params = (method === "get")
        ? data
        : {};
  
      try {
        return (await axios({ url, method, data, params })).data;
      } catch (err) {
        console.log("error");
        // console.error("API Error:", err.response);
        // let message = err.response.data.error.message;
        // throw Array.isArray(message) ? message : [message];
      }
    }
  
    // Individual API routes
  
    // /** Get details on a company by handle.
    //  * returns { handle, name, description, numEmployees, logoUrl, jobs }
    //  * where jobs is [{ id, title, salary, equity }, ...]
    //  */
  
    // static async getCompany(handle) {
    //   const res = await this.request(`companies/${handle}`);
    //   return res.company;
    // }
  
    // /** get an array of companies with/without searchTerm 
    //  * returns [{handle, name, description, numEmployees logoUrl},...]
    // */
  
    // static async getCompanies(searchTerm) {
    //   const searchFilters = searchTerm ? { name: searchTerm } : null;
    //   const res = await this.request("companies", searchFilters);
    //   return res.companies;
    // }
  
    // /** get an array of jobs with/without searchTerm
    //  * returns [{id, title, salary, equity, companyHandle, companyName},...]
    // */
    // static async getJobs(searchTerm) {
    //   // console.log("api.js - getJobs:", searchTerm);
  
    //   const searchFilters = searchTerm ? { title: searchTerm } : null;
    //   // console.log("searchFilters:", { searchFilters });
  
    //   const res = await this.request("jobs", searchFilters);
    //   return res.jobs;
    // }
  
    /** function to log in a user, takes an object {username, password}
     * returns token */
    static async login(username: LoginFormData) {
  
      const res = await this.request(
        "login", //WARNING: this could be a source of error in the future, might need a /
        { username },
        "post");
  
    //   this.token = res.token;
    return res;
    }
  
    /** function to register a new user
     * takes an object  { username, password, firstName, lastName, email }
     * returns token */
    static async register({ username, firstName, lastName, phone, email }: RegistrationFormData) {
      // console.log("Api newUserData:", { newUserData });
      const res = await this.request(
        "register",
        { username, firstName, lastName, phone, email },
        "post");
  
    //   this.token = res.token;
      return res;
    }
  
    // /** function that updates a user's information,
    //  * takes an object { username, firstName, lastName, email }
    //  * returns user: { username, firstName, lastName, email, isAdmin }
    //  */
    // static async updateUser({ username, firstName, lastName, email }) {
    //   const patchData = { firstName, lastName, email };
  
    //   const res = await this.request(
    //     `users/${username}`,
    //     patchData,
    //     "patch");
  
    //   return res.user;
    // }
  
  
    // /**function that gets the information for one user
    //  * takes username,  
    //  * returns { username, firstName, lastName, isAdmin, jobs }
    //  * where jobs is { id, title, companyHandle, companyName, state }
    //  * */
  
    // static async getUser(username) {
    //   // console.log('get user', this.token)
    //   const res = await this.request(`users/${username}`);
    //   return res.user;
    // }
  
    // /**function that applies a job for a user,
    //  * takes username and jobId,
    //  * returns jobId
    //  */
  
    // static async applyForJob(username, jobId) {
    //   const res = await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
    //   return res.applied;
    // }
  
    /**function that gets a job,
       * takes jobId,
       * returns job
       */
    // static async getJob(jobId) {
    //   const res = await this.request(`jobs/${jobId}`);
    //   return res.job;
    // }
    // obviously, you'll add a lot here ...
  }
  
  export default BuskApi;
  

