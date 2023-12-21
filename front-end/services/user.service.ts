import { api } from "./api.config";

const userService = {
 
 
  createUser,
  authUser,
  updateUser,
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
 * updateUser method
 *
 * @param {number} id
 * @param {Object} payload
 * @returns
 */
function updateUser(id, payload) {
  return api.putData(resource + "/users/"+id, payload);
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
