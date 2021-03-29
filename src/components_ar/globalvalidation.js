import {
AsyncStorage
} from 'react-native';
import api from '../api/api.js';
const vindIdNotAvailableMsgEn = "Your registeration had been cancelled";
export default {
	
	async checkAvailableVinIdForRegisteredCustomer(){
		let id; 
		await this.getCustomerId().then(idre=> id = idre);
		let customerInfo=null;
		//console.log("this is id--->"+id);
		if (id !==undefined && id !=null){
			customerInfo = await api.getRegisterCustomerInfoBeladi(id,'AR');
			//console.log("have id and this is custinfo==>"+customerInfo);
		}else{
			//alert(vindIdNotAvailableMsgEn);
			await this.removeCustomerIdFromStorage();
			//console.log("no id and remove the custid from aync storage");
			return false;
		}
		if (customerInfo != "error_nt"){
			if (customerInfo !== undefined && customerInfo!=null){
				if (customerInfo.vinId !==undefined && customerInfo.vinId !=null){
					//console.log("have vindid and should return true");
					return true;
				}else{
					//alert(vindIdNotAvailableMsgEn);
					await this.removeCustomerIdFromStorage();
					return false;
					//console.log("no vinid and remove the custid from aync storage");
				}
			}else{
				//alert(vindIdNotAvailableMsgEn);
				await this.removeCustomerIdFromStorage();
				//console.log("no customer info and remove the custid from aync storage");
			}
		}else{
			return true;
		}			
			
		return false;
	},
	
	async getCustomerId (){
		let id = null;
		try{
			id = await AsyncStorage.getItem("custId");
			
		}catch (error){
			alert(error);
		}
		return id;
	},
	
	async removeCustomerIdFromStorage (){
		
		try {
			await AsyncStorage.removeItem("custId");
			return true;
		}catch(exception) {
			return false;
		}
		
	}
	
}