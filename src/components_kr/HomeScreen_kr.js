import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {ImageBackground} from "react-native";
import {
TabBarIOS,
Text,
View,
Image,
StyleSheet,
Animated,
Linking,
TouchableHighlight ,
Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {BeladiHeader_kr} from './BeladiHeader_kr';
import {SocialMediaShare} from './SocialMediaShare';
//import OtherTab from './OtherTab';
//import LinearGradient from 'react-native-linear-gradient';
import { createStackNavigator, DrawerNavigator } from "react-navigation";
import OneSignal from 'react-native-onesignal';
import {
  Container,
  Header,
  Title,Badge,
  Fab,
  Button,
  IconNB,
  Left,
  Right,
  Body,
  Icon,
  Content,
  ListItem,
  Input,
} from "native-base";
import { Grid, Row ,Col} from "react-native-easy-grid";

/*
to get the device info
*/
import DeviceInfo from 'react-native-device-info';
import api from '../api/api.js';
import { withNavigationFocus } from 'react-navigation';
	 class HomeScreen_kr extends Component {
		constructor(props) {
			super(props);
			this.state = {
				active: false,
				zuserid : null,
				shouldChangeOil : false,
				showOilInput : true,
				isLoading : true,
			};
		}
		async componentDidUpdate(prevProps) {
			
			if (prevProps.isFocused !== this.props.isFocused) {
				console.log('here we go ====>'+this.props.isFocused);
				if(this.props.isFocused)
					await this._prepareData();			
			}
		}
		async componentDidMount(){
			await this._prepareData();
			
		}
		async _prepareData(){
			OneSignal.addEventListener('opened', this.onOpened.bind(this));
			OneSignal.addEventListener('ids', this.onIds.bind(this));
			//OneSignal.configure();
			
			//await this._methodToReloadOnOilPopUpClose();
			try{
					//alert('checking');
					let zuid = 0;
					let playerid ;
					let savedplayeridinserver =0 ;
					let mobileLang = "";
					await AsyncStorage.getItem("zuid").then((value) => zuid = value);
					await AsyncStorage.getItem("playerid").then((value) => playerid = value);
					await AsyncStorage.getItem("savedplayeridinserver").then((value) => savedplayeridinserver = value);
					await AsyncStorage.getItem("mobileLang").then((value) => mobileLang = value);
					//alert("lang is--->"+mobileLang);
					//alert("in storage playerid=>"+playerid+",savedplayeridinserver=>"+savedplayeridinserver);
					if (zuid ==null){
						//alert('not found');
						const deviceID = DeviceInfo.getUniqueID();
						const maker = DeviceInfo.getManufacturer();
						const os = DeviceInfo.getSystemName();
						const model = DeviceInfo.getModel();
						// set zuid when null
						zuid = await api.addAppUser(deviceID, maker, os , model, 'KR');
						//alert('after fetching->'+zuid);
						await AsyncStorage.setItem("zuid", JSON.stringify(zuid));
						
					}
					if (playerid !=null)
						if (savedplayeridinserver == null || savedplayeridinserver ==0){
							zpid = await api.addAppPlayerId(playerid, zuid);
							//console.log("zpid----"+zpid);
							if (zpid >0)
								await AsyncStorage.setItem("savedplayeridinserver", JSON.stringify(zpid));
							//alert('after fetching->'+playerid);
						}
					changeOil = await api.checkOilShouldChange(zuid , 'KR');
					insertMileage = await api.checkShouldInsertNewMileage('AR',zuid);
					this.setState({zuserid : zuid , shouldChangeOil:changeOil.shouldChangeOil,shouldInsertMileage:insertMileage.shouldInsetMileage});
					
					if (insertMileage.shouldInsetMileage){
						await Alert.alert('',"لقد مرت فتره منذ أن أدخلت أخر قيمه لعداد السياره");
						this.props.navigation.navigate("Maintenance_kr");
						return ;
					}
				
				}catch(error){
					Alert.alert("هەڵە پەيوەندى ببەستە");
					console.log(error);
			}
			this.setState({isLoading:false});
		}
		
		
		onOpened(openResult) {
			let routeScreen = openResult.notification.payload.additionalData.screenname;
			//console.log('Message: ', openResult.notification.payload.body);
			console.log('Data: ', openResult.notification.payload.additionalData);
			//console.log('isActive: ', openResult.notification.isAppInFocus);
			console.log('inside home openResult: ', openResult.notification.payload.additionalData.screenname);
			if (routeScreen =='PROMO'){
				this.props.navigation.navigate("EcommerceMaster_kr");
			}else if(routeScreen =='NORMAL_NOTIFICATION'){
				this.props.navigation.navigate("ShortNews_kr");
			}else if(routeScreen =='SPECIALPROMO'){
				this.props.navigation.navigate("Promotions_kr");
			}
		
		}
		componentWillUnmount() {
			//OneSignal.removeEventListener('received', this.onReceived);
			OneSignal.removeEventListener('opened', this.onOpened);
			OneSignal.removeEventListener('ids', this.onIds);
		
		}
		
		async onIds(device) {
			console.log('Device info: ', device);
			//alert('Device info: '+ device);
			this.setState({playerid:device.userId});
			await this.saveOneSignalPlayerId();
		}
	
		async  saveOneSignalPlayerId (){
			try{
				let currentPlayerId=null;
				await AsyncStorage.getItem("playerid").then((value) => currentPlayerId = value);
				if (currentPlayerId ==null)
					await AsyncStorage.setItem("playerid",this.state.playerid);
				else{
					if (currentPlayerId !=this.state.playerid)
						await AsyncStorage.setItem("playerid",this.state.playerid);
				}
			}catch (error){
				alert(error);
			}
		}
		
		 _methodToReloadOnOilPopUpClose = async ()=>{
			
			const changeOil = await api.checkOilShouldChange(this.state.zuserid , 'KR');
			 //alert ("called=>"+changeOil.shouldChangeOil);
			this.setState({shouldChangeOil:changeOil.shouldChangeOil});
			//alert("called");
		}
		checkOil(){
			var x =<View></View>;
			if (this.state.shouldChangeOil){
				
					return (<View style={{paddingRight:10,justifyContent:"flex-end" , marginTop:190 ,flex:1,marginRight:"60%"}}><Button	transparent 
						style={{width:"100%",height:"100%"}}
					onPress={() => this.props.navigation.navigate("OilPopUp_kr",{callBackMethod: this._methodToReloadOnOilPopUpClose})}>
								<Image source={require("../../img/oil-alarm.gif")}  
								style={{ 
									flex:1,
									width: "180%",
									height: "180%",
									resizeMode: 'contain'}}/>
							</Button></View>);
				
			}
			return (x);
		}
		_pressCall=()=>{
			const url='tel://6677'
			Linking.openURL(url)
		}	
		render() {
			
			if (this.state.isLoading){
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			}
			return (
				<ImageBackground style={styles.backgroundImage}
					source={require('../../img/landingpage/bg.png')} blurRadius={0} resizeMode = "cover">
					<View style={styles.MainContainer}>	
						<View style={{flex:2}}>
							<BeladiHeader_kr navigation={this.props.navigation}/>
						</View>
							<View style={{flexDirection : "column" , flex:7 }}>
								<ImageBackground style={styles.backgroundImage}
									source={require('../../img/landingpage/bg2.png')} blurRadius={0} resizeMode = "cover">
									
									
									<View style={{flex:16,justifyContent:"flex-end",alignItems:"center"}}>
									{this.checkOil()}
										<Text style={{fontSize:10,marginTop:10}}>
											کۆمپانیای بیلادی بۆ چاککردنوە و خزمەتگوزاری ئۆتۆمبێل
										</Text>
									</View>
									<View style={{flex:2}}/>
										
									
								</ImageBackground>
							</View>
							<View style={{flex:6 ,flexDirection:"row",  }}>
								<View style={{ flex:1,flexDirection:"column", justifyContent:"space-around"}}>
									
										<View style={{ flex:1,flexDirection:"column"}}>
											<Button transparent style={{width:"100%",height:"100%"}} onPress={() => this.props.navigation.navigate("ReservationPage_kr")}>
												<ImageBackground  style={styles.backgroundImageBTN} 
													resizeMode = "contain" source={require('../../img/landingpage/left1.png')} blurRadius={0}>
													<View style={{flex:1}}/>
													<View style={{ flex:4,flexDirection:"column",}}>
														
														<View style={{flex:1.5,alignItems:"center",}}>
															<Image source = {require('../../img/landingpage/workbook.png')} 
																style={styles.iconImg}
																resizeMode = "center">
															</Image>
														</View>
														<View style={{flex:1,alignItems:"center",}}>
															<Text style={styles.btnText}>دێارێكردنى كاتێ سەردانێ كردن</Text>
														</View>
														
													</View>
													
												</ImageBackground>
											</Button>
										</View>
									
									<View style={{ flex:1,flexDirection:"column"}}>
										<Button transparent style={{width:"100%",height:"100%"}} onPress={() => this.props.navigation.navigate("EcommerceMaster_kr")}>
											<ImageBackground  style={styles.backgroundImageBTN} 
											resizeMode = "contain" source={require('../../img/landingpage/middle.png')} blurRadius={0}>
												<View style={{flex:1}}/>
												<View style={{ flex:4,flexDirection:"column",}}>
													<View style={{flex:1.5,alignItems:"center",}}>
														<Image source = {require('../../img/landingpage/parts.png')} 
															style={styles.iconImg}
															resizeMode = "center">
														</Image>
													</View>
													<View style={{flex:1,alignItems:"center",}}>
														<Text style={styles.btnText}>پار چەى ێەدەگ</Text>
													</View>
												</View>
											</ImageBackground>
										</Button>
									</View>
									<View style={{ flex:1,flexDirection:"column"}}>
										<Button transparent style={{width:"100%",height:"100%"}} onPress={() => this.props.navigation.navigate("Centers_kr")}>
											<ImageBackground  style={styles.backgroundImageBTN} 
											resizeMode = "contain" source={require('../../img/landingpage/left2.png')} blurRadius={0}>
												<View style={{flex:1}}/>
												<View style={{ flex:4,flexDirection:"column",}}>
													<View style={{flex:1.5,alignItems:"center",}}>
														<Image source = {require('../../img/landingpage/location.png')} 
															style={styles.iconImg}
															resizeMode = "center">
														</Image>
													</View>
													<View style={{flex:1,alignItems:"center",}}>
														<Text style={styles.btnText}>ناونیشانه‌کانمان</Text>
													</View>
												</View>
											</ImageBackground>
										</Button>
									</View>
								</View>
								
								
								<View style={{ flex:1, marginTop:30}}>
									<Image source = {require('../../img/landingpage/shase.png')} style={{flex:1, resizeMode:"contain", width:undefined,height:undefined}}>
									</Image>
								</View >
								
								
								<View style={{flex:1}}>
									
									<View style={{ flex:1,flexDirection:"column", justifyContent:"space-around"}}>
										<View style={{ flex:1,flexDirection:"column"}}>
											<Button transparent style={{width:"100%",height:"100%"}} onPress={() => this.props.navigation.navigate("VerifyParts_kr")}>
												<ImageBackground  style={styles.backgroundImageBTN} 
												resizeMode = "contain" source={require('../../img/landingpage/right1.png')} blurRadius={0}>
													<View style={{flex:1}}/>
													<View style={{ flex:4,flexDirection:"column",}}>
														<View style={{flex:1.5,alignItems:"center",}}>
															<Image source = {require('../../img/landingpage/verify.png')} 
																style={styles.iconImg}
																resizeMode = "center">
															</Image>
														</View>
														<View style={{flex:1,alignItems:"center",}}>
															<Text style={styles.btnText}>پالَپشتێ پار چە</Text>
														</View>
													</View>
												</ImageBackground>
											</Button>
										</View>
										<View style={{ flex:1,flexDirection:"column"}}>
											<Button transparent style={{width:"100%",height:"100%"}} onPress={() => this.props.navigation.navigate("AboutUs_kr")}>
												<ImageBackground  style={styles.backgroundImageBTN} 
												resizeMode = "contain" source={require('../../img/landingpage/middle.png')} blurRadius={0}>
													<View style={{flex:1}}/>
													<View style={{ flex:4,flexDirection:"column",}}>
														<View style={{flex:1.5,alignItems:"center",}}>
															<Image source = {require('../../img/landingpage/aboutus.png')} 
																style={styles.iconImg}
																resizeMode = "center">
															</Image>
														</View>
														<View style={{flex:1,alignItems:"center",}}>
															<Text style={styles.btnText}>ده‌رباره‌ی کۆمپانیا</Text>
														</View>
													</View>
												</ImageBackground>
											</Button>
										</View>
										<View style={{ flex:1,flexDirection:"column"}}>
											<Button transparent style={{width:"100%",height:"100%"}} onPress={() => this.props.navigation.navigate("ContactUs_kr")}>
												<ImageBackground  style={styles.backgroundImageBTN} 
												resizeMode = "contain" source={require('../../img/landingpage/right2.png')} blurRadius={0}>
													<View style={{flex:1}}/>
													<View style={{ flex:4,flexDirection:"column",}}>
														<View style={{flex:1.5,alignItems:"center",}}>
															<Image source = {require('../../img/landingpage/letter.png')} 
																style={styles.iconImg}
																resizeMode = "center">
															</Image>
														</View>
														<View style={{flex:1,alignItems:"center",}}>
															<Text style={styles.btnText}>په‌یوه‌ندی کردن پیمان</Text>
														</View>
													</View>
												</ImageBackground>
											</Button>
										</View>
									</View>
								
								</View>
							</View>
							<View style={{flex:1,flexDirection:"row" , alignItems :"flex-end", backgroundColor:"#004777"}}>
								<Button block onPress={this._pressCall}
										style={{ flex:1,borderTopLeftRadius:10, borderTopRightRadius:10,backgroundColor:"#004777"}}>
									<Text style={{color:"#fff", fontFamily:"Futura Bk BT Book",fontSize:12, paddingTop: 5, paddingBottom :5 , paddingLeft:15, paddingRight:15}}>
										پێوندیمان پێ بکه‌ن ئیستا : 6677
									</Text>
									</Button>
							</View>
					</View>
				</ImageBackground>
			);
		}
	}
	//onPress={() => this.props.navigation.navigate("Parts", {callBackMethod: this._methodToReloadOnOilPopUpClose})}
	const styles = StyleSheet.create({
		MainContainer :{flex:1},
		btnText:{fontSize:8},
		backgroundImage: {flex: 1,width:undefined,height:undefined},
		backgroundImageBTN: {flex: 1,width:"100%",height:"100%"},
		iconImg : {flex:1,width: 65,height: 65,},
		logoview:{ flex: 1, alignItems:"flex-end", paddingTop:10},
		
		text: { fontSize: 14,fontFamily:"Futura Md BT Bold", color : "#FFF", marginBottom:10, marginTop:13,fontWeight: 'bold',
		alignItems:'flex-start', paddingLeft:45},
		
		mb15: { marginBottom: 12, backgroundColor: "#FF8C00" ,position: "relative"},
		
		/*Home : {flexDirection : "row", flex:1 , alignItems:'flex-start' , justifyContent:'flex-start'},*/
		
		HomeActionsLeft:{ flex:1, flexDirection:"column",paddingLeft:0,paddingRight:0, marginTop :10 , height:"100%" },
		
		ListItemStyle:{marginLeft:0,paddingTop:0,paddingBottom:0, paddingLeft:0,paddingRight:0, marginBottom:5 },
		
		ViewTextAction:{paddingLeft:0,paddingRight:0, flexDirection:"row", },
		/*linearGradient:{flex: 1,
						paddingLeft: 0,
						paddingRight: 15,
						borderRadius: 5,
						marginLeft:-30,
						 zIndex: -1 
						}*/
	});
	export default withNavigationFocus(HomeScreen_kr);