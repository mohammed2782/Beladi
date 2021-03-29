import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	StyleSheet,
	ImageBackground,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../api/api.js';
import {
  Container,
  Content,
  Form,
  Item,
  Title,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  Header,
  Label,
  Input,
  ScrollableTab,
  ActionSheet,
  Root
} from "native-base";
import ProgressBar from './ProgressBar';

import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export class Register extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : true,
			isRegistered:false,
			updateInfo : false,
			status : 0,
			
			nameEmpty:false,
			hpEmpty:false,
			custEmailError : false,
			vinEmpty:false,
			brandEmpty:false,
			yearEmpty:false,
			modelEmpty:false,
			colorEmpty:false,
			modelDisabled : true,
			
			custId : null,
			
			appCallBackFunction : this.props.navigation.state.params.appCallBackFunction,
			appUnregisterCallBackFunction : this.props.navigation.state.params.unRegCallBackFunction,
			brand :"BRAND",
			year : "YEAR",
			model :"MODEL",
			color :"COLOR",
			brandName :null,
			brandFilter : null,
			yearFilter : null,
			modelFilter : null,
			colorFilter : null,
		};
	}
	_updateRegInfo (){
		this.setState({updateInfo:true, modelDisabled : false});
		const modelName = this.state.model;
		const modelChoice = this.state.modelChoice;
		this._lookupModelFiler (this.state.brand);
		this.setState({model:modelName,modelChoice:modelChoice});
	
	}
	async removeCustomerIdFromStorage (){
		
		try {
			await AsyncStorage.removeItem("custId");
			return true;
		}catch(exception) {
			return false;
		}
		
	}
	async componentDidMount (){
		await this.getCustomerId();
		await this.getPlayerId();
		let kickout = false;
		const filters = await api.fetchEcommerceFiltersList('en');
		console.log(filters);
		this.setState( (prevState) => { return {filters} } );
		// brand filter
		var brandFilter = this.state.filters[0].singleFilter;
		brandFilter.push({"text":"Cancel","code":"CNCL"});
		this.setState({brandFilter:brandFilter});
		// year filter
		var yearFilter = this.state.filters[2].singleFilter;
		yearFilter.push({"text":"Cancel","code":"CNCL"});
		this.setState({yearFilter:yearFilter});
		//color filter
		var colorFilter = this.state.filters[3].singleFilter;
		colorFilter.push({"text":"Cancel","code":"CNCL"});
		this.setState({colorFilter:colorFilter});
		
		
		if (this.state.custId !=null && this.state.custId !==undefined){
			const customerInfo = await api.getRegisterCustomerInfoBeladi(this.state.custId,'EN');
			if (customerInfo != "error_nt"){
				if (customerInfo !== undefined && customerInfo!=null){
					if (customerInfo.vinId !==undefined && customerInfo.vinId !=null){
						kickout = false;
					}else{
						kickout = true;
					}
				}else{
					kickout = true;
				}
			}
			if (kickout){
				await this.removeCustomerIdFromStorage();
				this.state.appUnregisterCallBackFunction();
				await alert("Your registeration had been cancelled, please register again");
				//return;
			}
			this.setState({model :customerInfo.model});
			this.setState({brandName:customerInfo.brandName});
			this.setState({brand:customerInfo.brand});
			this.setState({color :customerInfo.color});
			this.setState({year :customerInfo.year});
			
			this.setState({brandChoice:customerInfo.brand});
			this.setState({modelChoice:customerInfo.modelCode});
			this.setState({yearChoice:customerInfo.year});
			this.setState({colorChoice:customerInfo.colorCode});
			
			this.setState({custName:customerInfo.custName});
			this.setState({custHP1:customerInfo.custHP1});
			this.setState({custEmail:customerInfo.email});
			this.setState({custVin:customerInfo.vinId});
			this.setState({isRegistered:true});
		}
		this.setState({isLoading:false});
		
	}
	async _cancelReg(){
		Alert.alert(
		  'Registeration',
		  "Are you sure you want to cancel your registeration? this operation can't be undone",
		  [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'OK', onPress: () => this._confirmedCancel()},
		  ],
		  { cancelable: false }
		);
	}
	async _confirmedCancel(){
		this.setState({isLoading:true});
		try{
			const zuidInPhone = await AsyncStorage.getItem("zuid");
			await api.cancelRegisterationBeladi(zuidInPhone, this.state.custId, "EN");
			this.setState({custId : null});
			this.setState({isRegistered:false});
			this.setState({custName:null});
			this.setState({custHP1:null});
			this.setState({custEmail:null});
			this.setState({custVin:null});
			await this.removeCustomerIdFromStorage();
			this.state.appUnregisterCallBackFunction();
			await alert("Your registeration had been cancelled, Thank you.");
		}catch(error){
			console.log(error);
		}
		
		this.setState({isLoading:false});
	}
	
	async validateEmail(email) {
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
		return re.test(String (email).toLowerCase());
	}
	
	async _registerCustomer(){
		let zuid=0;
		let custId=0;
		const custName = this.state.custName;
		const custHP1 = this.state.custHP1;
		const custEmail = this.state.custEmail;
		const custVin = this.state.custVin;
		const brand = this.state.brandChoice;
		const year  = this.state.yearChoice;
		const model = this.state.modelChoice;
		const color = this.state.colorChoice;
		var allGood = true;
		var nameEmptyF = false; var hpEmptyF = false; var vinEmptyF = false; var custEmailError= false; 
		var brandEmptyF=false; var yearEmptyF = false; var modelEmptyF = false; var colorEmptyF = false;
		await AsyncStorage.getItem("zuid").then((value) => zuid = value);
		await AsyncStorage.getItem("custId").then((value) => custId = value);
		if (custId !=='' && custId !== undefined && custId !==null && custId != 'undefined'){
			;
		}else{
			custId = 0;
		}
		if (color !=='' && color !== undefined && color !==null && color != 'undefined'){
			;
		}else{
			allGood = false;
			colorEmptyF = true;
		}
		if (brand !=='' && brand !== undefined && brand !==null && brand != 'undefined'){
			;
		}else{
			allGood = false;
			brandEmptyF = true;
		}
		if (year !=='' && year !== undefined && year !==null && year != 'undefined'){
			;
		}else{
			allGood = false;
			yearEmptyF = true;
		}
		if (model !=='' && model !== undefined && model !==null && model != 'undefined'){
			;
		}else{
			allGood = false;
			modelEmptyF = true;
		}
		
		if (custName !=='' && custName !== undefined && custName !==null && custName != 'undefined'){
			;
		}else{
			allGood = false;
			nameEmptyF = true;
		}
		if (custHP1 !=='' && custHP1 !== undefined && custHP1 !==null && custHP1 !=='undefined' ){
			if (custHP1.length != 11){
				Alert.alert("","Phone Number must be 11 digits");
				allGood = false;
				hpEmptyF = true;
			}
		}else{
			allGood = false;
			hpEmptyF = true;
		}
		if (custVin !=='' && custVin !== undefined && custVin !==null && custVin !== 'undefined'){
			if (custVin.length ==17){
				;
			}else{
				alert("VinNo should be 17 digit");
				allGood = false;
				vinEmptyF = true;
			}
		}else{
			allGood = false;
			vinEmptyF = true;
		}
		if (custEmail !=='' && custEmail !== undefined && custEmail !==null && custEmail !== 'undefined'){
			if (!await this.validateEmail(custEmail)){
				allGood = false;
				custEmailError = true;
			}
		}
		//console.log("brandEmptyF-->"+brandEmptyF);
		this.setState({brandEmpty:brandEmptyF, yearEmpty:yearEmptyF, modelEmpty:modelEmptyF, colorEmpty:colorEmptyF, vinEmpty : vinEmptyF , nameEmpty:nameEmptyF , hpEmpty:hpEmptyF, custEmailError:custEmailError });
		
		if (allGood){
			//alert("custid===>"+custId);
			this.setState({isLoading:true});
			try{
				const result = await api.registerCustomerBeladi(zuid,custId,brand, model, color, year, custName, custHP1, custEmail, custVin , this.state.playerid, 'EN'  );
				
				if (result.errorMessage!==null && result.errorMessage!==undefined)
					alert(result.errorMessage);
				else{
					//store in AsyncStorage
					if (result.custId !=null && result.custId !==undefined){
						this.setState({updateInfo:false});
						//console.log("load info");
						const customerInfo = await api.getRegisterCustomerInfoBeladi(result.custId,'EN');
						//console.log("after load info "+result.custId+","+customerInfo.custName+","+customerInfo.custHP1+","+customerInfo.email);
						await this.storeRegInfoInDevice(result.custId, customerInfo.custName , customerInfo.custHP1, customerInfo.email, brand, model);
						//console.log("after storeRegInfoInDevice");
						this.setState({custId :result.custId});
						this.setState({model :customerInfo.model});
						this.setState({brandName:customerInfo.brandName});
						this.setState({brand:customerInfo.brand});
						this.setState({color :customerInfo.color});
						this.setState({year :customerInfo.year});
						this.setState({custName:customerInfo.custName});
						this.setState({custHP1:customerInfo.custHP1});
						this.setState({custEmail:customerInfo.email});
						this.setState({custVin:customerInfo.vinId});
						//console.log("before callback");
						this.state.appCallBackFunction();
						//console.log("after callback");
						await alert("You have registered successfully");
						this.setState({isRegistered:true});
						this.setState({updateInfo:false});
					}
					
				}
			}catch(error){
				console.log(error);
			}
		}
		this.setState({isLoading:false});
	}
	
	async storeRegInfoInDevice (custId, custName, custHP1, custEmail, custBrand, custModel){
		console.log("inside async storage");
		try{
			console.log("async before custId");
			if (custId !==undefined)
			await AsyncStorage.setItem("custId", JSON.stringify(custId));
			if (custHP1 !==undefined)
				await AsyncStorage.setItem("custHP1",custHP1);
			if (custName !==undefined)
				await AsyncStorage.setItem("custName",custName);
			if (custEmail !==undefined)
				await AsyncStorage.setItem("custEmail",custEmail);
			if (custBrand !==undefined)
				await AsyncStorage.setItem("custBrand",custBrand);
			if (custModel !==undefined)
				await AsyncStorage.setItem("custModel",custModel);
			console.log("async before fnished");
		}catch(error){
			console.log(error);
		}
	}
	_lookupModelFiler (choice){
		if (choice == 'CNCL'){
			this.setState({modelDisabled:true});
		}else{
			this.setState({modelFilter:null});
			const brandFilter = this.state.brandFilter;
			var modelFilterF = null;
			for (i=0; i < brandFilter.length; i++){
				if (choice == brandFilter[i].code){
					modelFilterF = [...brandFilter[i].innerFilter.singleFilter];//clone the array ES6
					break;
				}
			}
			modelFilterF.push({"text":"Cancel","code":"CNCL"});
			if (modelFilterF.length>0)
				this.setState({modelDisabled:false});
			else
				this.setState({modelDisabled:true});
			this.setState({modelFilter:modelFilterF,model:"MODEL", modelChoice:null});
			
		}
	}
	async getCustomerId (){
		const id = null;
		try{
			const id = await AsyncStorage.getItem("custId");
			this.setState({custId:id});
			
		}catch (error){
			alert(error);
		}
		return id;
	}
	
	async getPlayerId (){
		const pid = null;
		try{
			const pid = await AsyncStorage.getItem("playerid");
			this.setState({playerid:pid});
			
		}catch (error){
			alert(error);
		}
		return pid;
	}
	
	render() {
		if (this.state.isLoading){
			return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
		}
		if(!this.state.isRegistered || this.state.updateInfo){
			return(
				<Root>
				<ImageBackground style={styles.backgroundImage}
						 source={require('../../img/inner/regbkg.png')} blurRadius={0} resizeMode = "cover">
					
						<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
							<View style={{flexDirection : "row" ,marginTop:20, flex:1,paddingLeft:0}}>
								<View style={{flex:1}}/>
								<View style={{flex:1, justifyContent : "flex-start", alignItems:"center"}}>
									<Button	transparent onPress={() => this.props.navigation.openDrawer()}>
										<Image source={require("../../img/BurgerMenuEnWhite.png")}  style={{ 
											flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'}}/>
									</Button>
								</View>
								<View style={{flex:4}}/>
								<View style={{flex:3 , justifyContent:"flex-end" }}>
									<Image source={require('../../img/logowhite.png')}
										style={{
											flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'
											}}
									/>
								</View>
							<View style={{flex:1}}/>	
						</View>
						<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1,
								marginLeft:30, marginRight:30 ,marginTop:"5%", marginBottom :20}}>
							{this.state.custId ?<Text style={{ fontSize:15, fontWeight:"bold" ,color:"white"}}>
								 Update Registeration Info
							</Text>
							:
							<Text style={{ fontSize:16, fontWeight:"bold" ,color:"white"}}>
								 Register now !
							</Text>
							}			
						</View>
						<View style={{flex:11}}>
							<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
									<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
							<View >
								<View style={{flex:6 , marginLeft:30, marginRight:30,backgroundColor:"white",
									shadowOffset:{  width: 2,  height: 2,  }, shadowColor: 'black', shadowRadius: 2,shadowOpacity: 1.0,}}>
									<Content padder>
										<Form style={styles.form}>
											<Item style={[this.state.nameEmpty?styles.validationError:null]}>
												<Icon active name="person" />
												<Input
													name = "customerName" 
													placeholder="Name"
													value = {this.state.custName}
													onChangeText={customerName =>this.setState({custName:customerName})}
													style={styles.textInputStyle}
												/>
											</Item>
											<Item style={[this.state.hpEmpty?styles.validationError:null]}>
												<Icon active type="FontAwesome" name="phone" />
												<Input
													keyboardType={'numeric'}
													name = "custHP1"
													placeholder="Phone number"
													value = {this.state.custHP1}
													onChangeText={custHP1 =>this.setState({custHP1:custHP1})}									
													style={styles.textInputStyle}
												/>
											</Item>
											<Item style={[this.state.custEmailError?styles.validationError:null]}>
												<Icon active type="FontAwesome" name="envelope" />
												<Input
													name = "custEmail"
													placeholder="Email"
													value = {this.state.custEmail}
													onChangeText={custEmail =>this.setState({custEmail:custEmail})}
													style={styles.textInputStyle}
												/>
											</Item>
											<Item style={[this.state.vinEmpty?styles.validationError:null]}>
												<Icon active type="FontAwesome" name="barcode" />
												<Input
													name = "custVin"
													placeholder="Car VIN"
													value = {this.state.custVin}
													onChangeText={custVin =>this.setState({custVin:custVin})}	
													style={styles.textInputStyle}
												/>
											</Item>
										<View style={{flexDirection:"row",flex:1,marginTop:10,alignItems:"center",justifyContent:"center",}}>
											<View style={{flex:1,alignItems:"flex-start",justifyContent:"center"}}>
												<Button  style ={{flex:1},[styles.actionBrand,this.state.brandEmpty?styles.error:null]}
													onPress={() =>	
															ActionSheet.show({
																options: this.state.brandFilter,
																cancelButtonIndex: this.state.brandFilter.length-1,
																destructiveButtonIndex: this.state.brandFilter.length-1,
																title: "Select Brand"
															},
															buttonIndex => {
																if (this.state.brandFilter[buttonIndex].code =='CNCL'){
																	this.setState({brand:"BRAND", brandChoice:null});
																	this.setState({model:"MODEL", modelChoice:null});
																}else{
																	this.setState({ brandChoice: this.state.brandFilter[buttonIndex].code , brand : this.state.brandFilter[buttonIndex].text });
																}
																this._lookupModelFiler(this.state.brandFilter[buttonIndex].code);
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.brand}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
										
											<View style={{flex:2,alignItems:"flex-start",justifyContent:"center"}}>
												<Button disabled={this.state.modelDisabled}  
												style ={[styles.actionBrand,this.state.modelEmpty?styles.error:null, this.state.modelDisabled?styles.disabled:null]}
													onPress={() =>	
															ActionSheet.show({
																options: this.state.modelFilter,
																cancelButtonIndex: this.state.modelFilter.length-1,
																destructiveButtonIndex: this.state.modelFilter.length-1,
																title: "Select Model"
															},
															buttonIndex => {
																if (this.state.modelFilter[buttonIndex].code =='CNCL'){
																	this.setState({model:"MODEL", modelChoice:null});
																}else{
																	this.setState({ modelChoice: this.state.modelFilter[buttonIndex].code , model : this.state.modelFilter[buttonIndex].text });
																}
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.model}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
										</View>
										<View style={{flexDirection:"row",flex:1,marginTop:10,alignItems:"flex-start",justifyContent:"flex-start",}}>
											<View style={{flex:1,alignItems:"flex-start",marginLeft:5,justifyContent:"center",}}>
												<Button  style ={[styles.actionBrandYear,this.state.yearEmpty?styles.error:null]}
													onPress={() =>	
															ActionSheet.show({
																options: this.state.yearFilter,
																cancelButtonIndex: this.state.yearFilter.length-1,
																destructiveButtonIndex: this.state.yearFilter.length-1,
																title: "Select Year"
															},
															buttonIndex => {
																if (this.state.yearFilter[buttonIndex].code =='CNCL'){
																	this.setState({year:"YEAR", yearChoice:null});
																}else{
																	this.setState({ yearChoice: this.state.yearFilter[buttonIndex].code , year : this.state.yearFilter[buttonIndex].text });
																}
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.year}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
											<View style={{flex:1,alignItems:"flex-start",justifyContent:"center"}}>
												<Button  style ={[styles.actionBrandYear,this.state.colorEmpty?styles.error:null]}
													onPress={() =>	
															ActionSheet.show({
																options: this.state.colorFilter,
																cancelButtonIndex: this.state.colorFilter.length-1,
																destructiveButtonIndex: this.state.colorFilter.length-1,
																title: "Select Color"
															},
															buttonIndex => {
																if (this.state.colorFilter[buttonIndex].code =='CNCL'){
																	this.setState({color:"COLOR", colorChoice:null});
																}else{
																	this.setState({ colorChoice: this.state.colorFilter[buttonIndex].code , color : this.state.colorFilter[buttonIndex].text });
																}
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.color}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
										</View>
										<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
											<Button block onPress={()=> {this._registerCustomer();}}
												style={{backgroundColor:"#004777", flex:1, margin: 15, marginTop: 10, padding:10 }}>
												<Text style={{color:"white"}}>ok</Text>
											</Button>
										</View>
												
									</Form>
								</Content>
							</View>
						<View style={{flex:5}}/>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
		</View>
	</View>
				
	</ImageBackground>
	</Root>
			);
		}else{ // if registered
			return(
				<ImageBackground style={styles.backgroundImage}
						 source={require('../../img/inforegbk.png')} blurRadius={0} resizeMode = "cover">
							<View style={{flex:1, backgroundColor:"#004777"}}>
							
								<View style={{flexDirection : "row" ,marginTop:20, flex:1,paddingLeft:0}}>
									<View style={{flex:1}}/>
									<View style={{flex:1, justifyContent : "flex-start", alignItems:"center"}}>
										<Button	transparent onPress={() => this.props.navigation.openDrawer()}>
											<Image source={require("../../img/BurgerMenuEnWhite.png")}  style={{ 
												flex:1,
												width: "100%",
												height: "100%",
												resizeMode: 'contain'}}/>
										</Button>
									</View>
									<View style={{flex:4}}/>
									<View style={{flex:3 , justifyContent:"flex-end" }}>
										<Image source={require('../../img/logowhite.png')}
											style={{
												flex:1,
												width: "100%",
												height: "100%",
												resizeMode: 'contain'
												}}
										/>
									</View>
									<View style={{flex:1}}/>	
								</View>
								<View style={{flexDirection : "column" , justifyContent:"flex-start" , alignItems:"center", flex:1,
									marginLeft:30, marginRight:30 ,marginTop:"5%", marginBottom :20}}>
									{this.state.custId ?<Text style={{ fontSize:15, fontWeight:"bold" ,color:"white"}}>
									 Update Registeration Info
									</Text>
									:
									<Text style={{ fontSize:16, fontWeight:"bold" ,color:"white"}}>
									 Register now !
									</Text>
									}
									<Text style={{ fontSize:15, fontWeight:"bold" ,color:"white"}}>
										Welcome {this.state.custName}
									</Text>
								</View>
						
							</View>
						<View style={{flex:3 , marginLeft:30, marginRight:30,marginTop:"5%",paddingTop:10}}>
							<View style={{flexDirection:"row"}} >
								<View>
									<Label style={styles.labelStyle}>
										Brand: 
									</Label>
								</View>
								<View>
									<Text>
									{this.state.brandName}
									</Text>
								</View>
							</View>
							<View style={{flexDirection:"row"}} >
								<View>
									<Label style={styles.labelStyle}>
										Model: 
									</Label>
								</View>
								<View>
									<Text>
									{this.state.model}
									</Text>
								</View>
							</View>
							<View style={{flexDirection:"row"}} >
								<View>
									<Label style={styles.labelStyle}>
										Color: 
									</Label>
								</View>
								<View>
									<Text>
									{this.state.color}
									</Text>
								</View>
							</View>
							<View style={{flexDirection:"row"}} >
								<View>
									<Label style={styles.labelStyle}>
										Year: 
									</Label>
								</View>
								<View>
									<Text>
									{this.state.year}
									</Text>
								</View>
							</View>
								<View style={{flexDirection:"row"}} >
									<Label style={styles.labelStyle}>
										Phone number:  
									</Label>
									<Text>
										{this.state.custHP1}
									</Text>
								</View>
								<View style={{flexDirection:"row"}} >
									<Label style={styles.labelStyle}>
										Email:  
									</Label>
									<Text>
										{this.state.custEmail}
									</Text>
									
								</View>
								<View style={styles.formRow,{flexDirection:"row"}}>
									<Label style={styles.labelStyle}>
										Car VIN:  
									</Label>
									<Text>
										{this.state.custVin}
									</Text>
								</View>
								
								<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
									<Button iconLeft onPress={()=> {this._updateRegInfo();}}
										style={{backgroundColor:"#004777", flex:1, margin: 5, marginTop: 10, padding:5 }}>
										<View style={{flex:1,alignItems:"center",justifyContent:"center" }}>
											<Icon active type="FontAwesome" name="pencil" style={{color: 'white',fontSize:17}} />
											<Text style={{color:"white",fontSize:15,marginRight:5,fontWeight:"bold"}}>Update</Text>
										</View>
									</Button>
									<Button iconLeft onPress={()=> {this._cancelReg();}}
										style={{backgroundColor:"#C72E2E", flex:1, margin:0, marginTop: 10, padding:5,}}>
										<View style={{flex:1,alignItems:"center",justifyContent:"center" }}>
											<Text style={{color:"white",fontSize:15,marginRight:5,fontWeight:"bold",alignSelf:"center",alignItems:"center",justifyContent:"center"}}>Cancel</Text>
											<Text style={{color:"white",fontSize:15,marginRight:5,fontWeight:"bold",alignSelf:"center",alignItems:"center",justifyContent:"center"}}>Registeration</Text>
										</View>
									</Button>
								</View>

						</View>
				</ImageBackground>
			);
		}
	}
}
/*
{
"partSerialNo" :"helllo"
}
*/
const styles = StyleSheet.create(
	{
		backgroundImage: {flex: 1, width:undefined, height:undefined },
		form:{flexDirection : "column" , justifyContent:"flex-start" },
		formRow : {flexDirection : "row" , justifyContent:"flex-start" , alignItems:"center", flex:1 },
		textInputStyle :{  borderColor: 'gray',backgroundColor :"#FFF",  flex:1 , fontSize :12 , paddingTop:10 ,},
		validationError : {borderColor: '#d1251a' , borderBottomWidth:1},
		error : {borderColor: '#d1251a' , borderWidth:1.5},
		labelStyle : {fontFamily:"Franklin Gothic Book Regular" , fontSize:13 ,color:"#004777" , paddingRight : 10 , marginBottom:10},
		progressBar: {
			backgroundColor: '#0a0a0a',
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		actionBrand : {flex:1,backgroundColor:"#004777",height:40,alignSelf:"center",borderRadius:5,paddingTop:0,paddingBottom:0},
		actionBrandYear : {flex:1,backgroundColor:"#004777",height:40,alignSelf:"flex-start",borderRadius:5,paddingTop:0,paddingBottom:0},
		disabled : {backgroundColor:"#C6DEFF"},
		
	}
);