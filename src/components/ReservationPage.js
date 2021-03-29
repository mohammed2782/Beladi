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
	Alert,
	TouchableOpacity,
	FlatList
} from 'react-native';
import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
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
  Textarea,
  ActionSheet,
  Root,
  Card,
  CardItem
} from "native-base";
import ProgressBar from './ProgressBar';

//import LinearGradient from 'react-native-linear-gradient';
import TabOne from "./SingleCarTabs/tabOne";
import TabTwo from "./SingleCarTabs/tabTwo";
import TabThree from "./SingleCarTabs/tabThree";
import Swiper from 'react-native-swiper';
import {BeladiHeaderWhiteBack} from './BeladiHeaderWhiteBack';
import globalvalidation from './globalvalidation.js';
export class ReservationPage extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : true,
			status : 0,
			zuid : null,
			nameEmpty:false,
			hpEmpty:false,
			msgEmpty:false,
			dateTimeEmpty:false,
			brandEmpty:false,
			stateEmpty:false,
			svcEmpty : false,
			custEmailError : false,
			isDateTimePickerVisible: false,
			startTimeMinu:480,
			endTimeMinu : 960,
			dateTime:null,
			brand :"BRAND",
			state : "STATE",
			
			center : "CENTER",
			reservationDates :null,
			haveReservations:false,
			makeReservationMode : false,
			svcDisabled : true,
			svcChoice:null,
			stateChoice : null,
			brandChoice : null,
			regid : 0
		};
	}
	
	registerUser = async()=>{
		//alert("changed in the sidebar level");
		this.setState({isRegistered:true});
	}
	
	unRegisterUser = async()=>{
		//alert("changed in the sidebar level");
		this.setState({isRegistered:false});
	}
	
	_showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
	_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
	
	_showResForm (){
		this.setState({makeReservationMode:true});
	}
	_handleDatePicked = (date) => {
		let apptTime =0;
		if (date.getDay()!=5){
			apptTime = (date.getHours()*60)+date.getMinutes();
			if (apptTime <= this.state.endTimeMinu && apptTime >= this.state.startTimeMinu)
				this.setState({dateTime:date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+", "+date.getHours()+":"+date.getMinutes(),});
			else
				Alert.alert("","Reservation Time must be within working hours range");
		}else{
			Alert.alert("","Friday is Off Day");
		}
		this._hideDateTimePicker();
	};
	_checkDate = (date)=>{
		alert(date);
	}
	
	async getCustomerId (){
		let id = null;
		try{
			id = await AsyncStorage.getItem("custId");
			
		}catch (error){
			alert(error);
		}
		return id;
	}
	
	async componentDidMount(){
		try{
			//check if the user registered , if not then redirect to the registeration screen
			const isThere = await globalvalidation.checkAvailableVinIdForRegisteredCustomer();
			
			if (!isThere){
				await Alert.alert('','You need to register first to make reservation');
				this.props.navigation.navigate("Register",{appCallBackFunction:this.registerUser, unRegCallBackFunction:this.unRegisterUser});
				return ;
			}
			let regidD = 0;
			regidD = await this.getCustomerId();
			this.setState({regid:regidD});
			
			await this.loadCustomerPromoInfo ();
			const reservationDates = await api.fetchOldNewReservationDate('EN',this.state.zuid,this.state.regid);
			if (reservationDates.length>0){
				this.setState({haveReservations:true,reservationDates:reservationDates});
			}
			const filters = await api.fetchReservationFiltersList('en');
			this.setState( (prevState) => { return {filters} } );
			//console.log(this.state.filters);
			var brandFilter = this.state.filters[0].singleFilter;
			brandFilter.push({"text":"Cancel","code":"CNCL"});
			this.setState({brandFilter:brandFilter});
			
			var stateFilter = this.state.filters[1].singleFilter;
			stateFilter.push({"text":"Cancel","code":"CNCL"});
			this.setState({stateFilter:stateFilter});
		}catch(error){
			alert(error);
			console.log(error);
		}
		this.setState({isLoading:false});
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
	
	_lookupStateFiler (choice){
		if (choice == 'CNCL'){
			this.setState({svcDisabled:true});
		}else{
			this.setState({svcFilter:null});
			const stateFilter = this.state.stateFilter;
			var svcFilterF = null;
			for (i=0; i < stateFilter.length; i++){
				if (choice == stateFilter[i].code){
					svcFilterF = [...stateFilter[i].innerFilter.singleFilter];//clone the array ES6
					break;
				}
			}
			svcFilterF.push({"text":"Cancel","code":"CNCL"});
			if (svcFilterF.length>0)
				this.setState({svcDisabled:false});
			else
				this.setState({svcDisabled:true});
			this.setState({svcFilter:svcFilterF,center:"CENTER", svcChoice:null});
			
		}
	}
	async loadCustomerPromoInfo (){
		const id = null;
		try{
			const zuidInPhone = await AsyncStorage.getItem("zuid");
			let custNameR = await AsyncStorage.getItem("custName");
			let custHPR = await AsyncStorage.getItem("custHP1");
			let custEmailR = await AsyncStorage.getItem("custEmail");
			let custBrandR = await AsyncStorage.getItem("custBrand");
			let custModelR = await AsyncStorage.getItem("custModel");
			if (custBrandR !=='' && custBrandR !== undefined && custBrandR !==null && custBrandR !=='undefined')
				brandChoice = custBrandR;
			else{
				custBrandR = "BRAND";
				brandChoice = null;
			}
			this.setState({zuid:zuidInPhone , custName:custNameR, custHP : custHPR, custEmail : custEmailR,brandChoice:brandChoice, brand : custBrandR , custModel:custModelR});
			
		}catch (error){
			alert(error);
		}
		return id;
	}
	
	async validateEmail(email) {
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
		return re.test(String (email).toLowerCase());
	}
	async _contactSend(){
		const custName = this.state.custName;
		const custHP = this.state.custHP;
		const custEmail = this.state.custEmail;
		const msg = this.state.msg;
		const dateTime = this.state.dateTime;
		const brand = this.state.brand;
		const brandChoice = this.state.brandChoice;
		const state = this.state.state;
		const stateChoice = this.state.stateChoice;
		const svc = this.state.center;
		const svcChoice = this.state.svcChoice;
		var allGood = true;
		var nameEmptyF = false; var hpEmptyF = false; var msgEmptyF = false;var custEmailError= false; var brandEmptyF = false; var dateTimeEmptyF= false;
		var stateEmptyF = false; var svcEmptyF = false;
		//alert(svc);
		if (stateChoice !=='' && stateChoice !== undefined && stateChoice !==null && stateChoice != 'undefined'){
			;
		}else{
			allGood = false;
			stateEmptyF = true;
		}
		
		if (svcChoice !=='' && svcChoice !== undefined && svcChoice !==null && svcChoice !=='undefined'){
			;
		}else{
			allGood = false;
			svcEmptyF = true;
		}
		
		if (custName !=='' && custName !== undefined && custName !==null && custName != 'undefined'){
			;
		}else{
			allGood = false;
			nameEmptyF = true;
		}
		if (brandChoice !=='' && brandChoice !== undefined && brandChoice !==null && brandChoice !=='undefined' && brandChoice !=='undefined'){
			;
		}else{
			allGood = false;
			brandEmptyF = true;
		}
		if (custHP !=='' && custHP !== undefined && custHP !==null && custHP !=='undefined' ){
			if (custHP.length != 11){
				Alert.alert("","Phone Number must be 11 digits");
				allGood = false;
				hpEmptyF = true;
			}
		}else{
			allGood = false;
			hpEmptyF = true;
		}
		if (dateTime !=='' && dateTime !== undefined && dateTime !==null && dateTime !== 'undefined'){
			;
		}else{
			allGood = false;
			dateTimeEmptyF = true;
		}
		if (custEmail !=='' && custEmail !== undefined && custEmail !==null && custEmail !== 'undefined'){
			if (!await this.validateEmail(custEmail)){
				allGood = false;
				custEmailError = true;
			}
		}
		this.setState({stateEmpty:stateEmptyF, svcEmpty: svcEmptyF, brandEmpty:brandEmptyF,dateTimeEmpty : dateTimeEmptyF , nameEmpty:nameEmptyF , hpEmpty:hpEmptyF, custEmailError:custEmailError });
		
		if (allGood){
			this.setState({isLoading:true});
			const result = await api.makeAppointment(this.state.zuid, custName, custHP, custEmail, brand, dateTime, msg,state, svc, this.state.regid,'EN'  );
			//this.setState({status:result.rs});
			//alert(result);
			if (result.errorMessage!==null && result.errorMessage!==undefined)
				alert(result.errorMessage);
			else{
				Alert.alert('','We have recieved your reservation, we will contact you soon.\nThank you');
				const reservationDates = await api.fetchOldNewReservationDate('EN',this.state.zuid);
				if (reservationDates.length>0){
					this.setState({haveReservations:true,makeReservationMode:false,reservationDates:reservationDates});
				}
			}
			this.setState({isLoading:false});
		}
		
	}
	
	
	render() {
		
		if (this.state.isLoading){
			return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
		}
		return(
		<Root>
			<ImageBackground style={styles.backgroundImage} source={require('../../img/contactusbg.png')} blurRadius={0} resizeMode = "cover">
				<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
					<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
						<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
							<View style={{flex:1.5, backgroundColor:"#004777"}}> 
								<View style={{flex:3}}>
									<BeladiHeaderWhiteBack navigation={this.props.navigation}/>
								</View>
								<View style={{flex:1,flexDirection : "column" , justifyContent:"flex-end" , alignItems:"center", flex:1,
									marginLeft:10, marginRight:30 , marginBottom :5,}}>
									<View style={{flex:1}}>
										<Image style={{resizeMode: 'contain'}} source ={require('../../img/calendar.png')} />
									</View>
									<View style={{flex:1}}>
									<Text style={{fontSize:13,paddingTop:5, fontWeight:"bold" ,color:"white"}}>
										Make reservation
									</Text>	
									</View>
								</View>
							</View>
							
							
							{ (!this.state.makeReservationMode && this.state.haveReservations)?
								<View>
								<View style={{flex:4, marginTop:10 , marginLeft:0 , marginRight:0}}>
									<FlatList 
										contentContainerStyle={{}}
										data={this.state.reservationDates}
										keyExtractor={item => item.id.toString()}
										renderItem={({item}) =>(
										
										<Card style={styles.mb,{marginLeft:0,marginRight:0}}>
											<CardItem cardBody style={{borderBottomWidth:0.5,borderBottomColor: 'grey',
											 }}>
											
												<View style={{flex:1,padding:10, alignItems:"center",backgroundColor:"#FAFAFA",justifyContent:"center", alignSelf:"center" , flexDirection:"row"}}>
													<View style={{ flex:2, alignItems: "flex-start"  , margin:0,padding:0 }}>
														<Text style={styles.carTitle}>{item.dateTime}</Text>													
													</View>
													<View style={{ flex: 1, alignItems: "flex-start"  , margin:0,padding:0 }}>
														<Text style={styles.carTitle}>{item.state}</Text>													
													</View>
													<View style={{ flex: 2, alignItems: "flex-start"  , margin:0,padding:0 }}>
														<Text style={styles.carTitle}>{item.svcCenter}</Text>													
													</View>
												</View>
												
											</CardItem>
											<View style={{flex:1}}>
													<Text style={styles.carTitle}>{item.notes}</Text>
												</View>
										</Card>
										)
									}
									/>
								</View>
								<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
											<Button block onPress={()=> {this._showResForm();}}
												style={{backgroundColor:"#004777", flex:1, margin: 15, marginTop: 10, padding:10 }}>
												<Text style={{color:"white"}}>Make New Reservation</Text>
											</Button>
								</View>
							</View>
							:
							
							
								<View style={{flex:6 , marginLeft:20,paddingTop:20, marginRight:20}}>
									<Form style={styles.form}>
										<View style={styles.formRow}>
											<Input 
												name = "customerName" placeholder="Your Name"
												value = {this.state.custName}
												onChangeText={customerName =>this.setState({custName:customerName})}
												style={[styles.textInputStyle,this.state.nameEmpty?styles.error:null]}
											/>
										</View>
										<View style={styles.formRow} >
											<View style={{flex:6}}>
												<Input 
												name = "custEmail" placeholder="Email"
												value = {this.state.custEmail}
												onChangeText={custEmail =>this.setState({custEmail:custEmail})}
												style={[styles.textInputStyle,this.state.custEmailError?styles.error:null]}
											/>
											</View>
											<View style={{flex:1}}/>
											<View style={{flex:4}}>
												<Input
													keyboardType={'numeric'}
													name = "custHP" placeholder="Phone number"
													value = {this.state.custHP}
													onChangeText={custHP =>this.setState({custHP:custHP})}
													style={[styles.textInputStyle,this.state.hpEmpty?styles.error:null]}
												/>
											</View>
										</View>
										<View style={{marginLeft:0,marginRight:10,flexDirection : "column" ,alignItems:"flex-start", justifyContent:"flex-start" , alignItems:"flex-start", flex:1 }}>
											<View style={{flex:1, paddingRight : 10 , marginBottom:0,justifyContent:"flex-end",alignItems:"flex-end",}}>
												<Text style={{color:"#004777",fontSize:10}}>Select date and time</Text>
											</View>
											<View style={{flex:1, paddingRight : 10 ,flexDirection:"row", marginBottom:10,justifyContent:"flex-end",alignItems:"flex-end",}}>
												<Text style={{color:"#004777",fontSize:10}}>Sat - Thu</Text>
												<Text style={{color:"#004777",fontSize:10}}>{' '}08:00 - 16:00</Text>
											</View>
										</View>
										<View style={styles.formRow,{marginBottom:10,alignItems:"flex-start",flexDirection:"row",justifyContent:"center"}}>
											<View style={{flex:2,alignItems:"flex-end",justifyContent:"center"}}>
												<Input 
													name = "dateTime"
													value = {this.state.dateTime} disabled
													style={[styles.textInputStyle,styles.dimmedcolor,this.state.dateTimeEmpty?styles.error:null]}
												/>
											</View>
											<View style={{flex:1,paddingLeft:5,alignItems:"flex-start",marginBottom:10,justifyContent:"center",alignSelf:"center"}}>
												<TouchableOpacity onPress={this._showDateTimePicker}>
													<Icon active type="FontAwesome" name="calendar" style={{color: '#004777',fontSize:27}} />
												</TouchableOpacity>
												<DateTimePicker mode="datetime"
													isVisible={this.state.isDateTimePickerVisible}
													onConfirm={this._handleDatePicked}
													onCancel={this._hideDateTimePicker}
													minimumDate={new Date()}
													onchange={this._checkDate}
												/>
											</View>
											<View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
												<Button  style ={[styles.actionBrand,this.state.brandEmpty?styles.error:null]}
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
																}else{
																	this.setState({ brandChoice: this.state.brandFilter[buttonIndex].code , brand : this.state.brandFilter[buttonIndex].text });
																}
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.brand}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
											
										</View>
										<View style={styles.formRow,{marginBottom:10,alignItems:"flex-start",flexDirection:"row",justifyContent:"center"}}>
											<View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
												<Button  style ={[styles.actionBrand,this.state.stateEmpty?styles.error:null]}
													onPress={() =>	
															ActionSheet.show({
																options: this.state.stateFilter,
																cancelButtonIndex: this.state.stateFilter.length-1,
																destructiveButtonIndex: this.state.stateFilter.length-1,
																title: "Select State"
															},
															buttonIndex => {
																if (this.state.stateFilter[buttonIndex].code =='CNCL'){
																	this.setState({state:"STATE", stateChoice:null});
																}else{
																	this.setState({ stateChoice: this.state.stateFilter[buttonIndex].code , state : this.state.stateFilter[buttonIndex].text });
																}
																this._lookupStateFiler(this.state.stateFilter[buttonIndex].code);
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.state}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
											<View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
												<Button  disabled={this.state.svcDisabled}  
												style ={[styles.actionBrand,this.state.svcEmpty?styles.error:null, this.state.svcDisabled?styles.disabled:null]}
												
													onPress={() =>	
															ActionSheet.show({
																options: this.state.svcFilter,
																cancelButtonIndex: this.state.svcFilter.length-1,
																destructiveButtonIndex: this.state.svcFilter.length-1,
																title: "Select Center"
															},
															buttonIndex => {
																if (this.state.svcFilter[buttonIndex].code =='CNCL'){
																	this.setState({center:"CENTER", svcChoice:null});
																}else{
																	this.setState({ svcChoice: this.state.svcFilter[buttonIndex].code , center : this.state.svcFilter[buttonIndex].text });
																}
																
															}
														)
													}
												>
													<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:15,marginLeft:15}}>{this.state.center}</Text>
													<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												</Button>
											</View>
										</View>
										
										<View style={styles.formRow}>
											<Input multiline={true} numberOfLine={5} name = "msg" 
												placeholder = "Notes"
												onChangeText={msg =>this.setState({msg:msg})}
												style={[styles.multiLineInputStyle,this.state.msgEmpty?styles.error:null]}
												bordered  /> 
										</View>
										
										<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
											<Button block onPress={()=> {this._contactSend();}}
												style={{backgroundColor:"#004777", flex:1, margin: 15, marginTop: 10, padding:10 }}>
												<Text style={{color:"white"}}>Send</Text>
											</Button>
										</View>
												
									</Form>
								</View>
							}
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>	
			</ImageBackground>
		</Root>
		);
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
		textInputStyle :{ width:"100%",height:40 ,borderColor: 'gray',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :12 , paddingTop:10 ,
			lineHeight:10 , borderRadius:7 , marginBottom : 10,textAlign:"center"},
		error : {borderColor: '#d1251a' , borderWidth:1.5},
		labelStyle : { fontSize:13 ,color:"#004777" , paddingRight : 10 , marginBottom:10},
		progressBar: {
		backgroundColor: '#0a0a0a',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		},
		ViewBTN : {flex:1.5,justifyContent :"center",borderTopWidth:1,borderTopColor:"white",alignItems:"center",justifyContent :"center",borderRightWidth:0.5,borderRightColor:"#f0f0f1"},
		multiLineInputStyle : {height:150 ,borderColor: 'gray',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :10 , paddingTop:10 ,
		lineHeight:10 , borderRadius:7 , marginBottom : 10 , textAlignVertical: "top"},
		actionBrand : {backgroundColor:"#004777",height:40,alignSelf:"center",borderRadius:5,alignSelf:"center",paddingTop:0,paddingBottom:0},
		disabled : {backgroundColor:"#C6DEFF"},
	    carTitle :{fontSize:11},
		dimmedcolor :{backgroundColor:"#c2c6c2"},
		
	}
);