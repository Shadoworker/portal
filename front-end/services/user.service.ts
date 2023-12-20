import { api } from "./api.config";

const userService = {
 
 
  createUser,
  authUser,
 
};

const resource = "";

 
/**
 * createUser method
 *
 * @param {Object} payload
 * @returns
 */
function createUser(payload) {
  return api.postData(resource + "/auth/local/register", payload);
}


 
/**
 * authUser method
 *
 * @param {Object} payload
 * @returns
 */
function authUser(payload) {
  return api.postData(resource + "/auth/local", payload);
}



export default userService;
