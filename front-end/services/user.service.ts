import { api } from "./api.config";

const userService = {
 
 
  createUser,
  authUser,
  getUser,
 
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


/**
 * getUser method
 *
 * @param {number} id
 * @returns
 */
function getUser(id) {
  return api.getData(resource + "/users/"+id);
}



export default userService;
