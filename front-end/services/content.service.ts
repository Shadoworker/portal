import { api } from "./api.config";

const contentService = {
 
  getRubrics,
  getRubricGames,

  createStat,

  getHeroes,
  getBanners,
  getFeaturedProducts,
  getNewestProducts,
  getContacts,


 
};

const resource = "";


/**
 * --- method
 *
 * @returns
 */
 function getHeroes() {
  return api.getData(resource + "/heroes?populate=image");
}
 
/**
 * --- method
 *
 * @returns
 */
function getBanners() {
  return api.getData(resource + "/bannieres?populate=image");
}
 
/**
 * --- method
 *
 * @returns
 */
function getContacts() {
  return api.getData(resource + "/contacts");
}
 

/**
 * --- method
 *
 * @returns
 */
 function getRubrics() {
  return api.getData(resource + "/rubrics");
}
 


/**
 * --- method
 * @param {number} rubricId
 * @returns
 */
function getRubricGames(rubricId) {
  return api.getData(resource + "/rubrics/"+rubricId+"?populate\[games\][populate]=*");
}

/**
 * --- method
 *
 * @returns
 */
 function getFeaturedProducts() {
  let filter = `?filters[enVedette][$eq]=true`;
  return api.getData(resource + "/produits"+filter+"&_limit=8&populate=images");
}


/**
 * --- method
 *
 * @returns
 */
 function getNewestProducts() {
  return api.getData(resource + "/produits?_sort=createdAt:desc&_limit=8&populate=images");
}


/**
 * --- method
 *
 * @returns
 */
 function getProducts() {
  return api.getData(resource + "/products?filters\[product_categories\][name][$notContains]=Nouveauté&populate=images");
}


/**
 * --- method
 * @param {number} userId
 * @returns
 */
function getPreferredSizes(userId:number) {
  let filter = `?filters[user][id][$eq]=${userId}`;
  return api.getData(resource + "/preferred-sizes"+filter+"&populate=size");
}


/**
 * createState method
 *
 * @param {Object} payload
 * @returns
 */
function createStat(payload) {
  return api.postData(resource + "/stats", payload);
}





export default contentService;
