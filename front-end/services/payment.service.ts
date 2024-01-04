
import axios from "axios";
import { paymentapi } from "./payment.api.config";
const url = "https://preproduction-gateway.bizao.com/mobilemoney/v1"
const paymentService = {
 
 
  requestPaymentUrl,
};

const resource = "";

 
/**
 * requestPaymentUrl method
 *
 * @param {Object} payload
 * @returns
 */
function requestPaymentUrl(payload) {

  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 453c14ca-b3be-3d4c-9913-33cab8f7d693',
    'country-code':'sn',
    'mno-name':payload.mno,
    // 'lang':'fr',
    'channel':'web',
    'Cookie':'route=1700728895.533.3407.482340|81ae3a9a04c06b83bdb4bb4311fcd72d'
  };

   
  return paymentapi.postData(resource ,payload, undefined, headers);

}


 



export default paymentService;
