import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
} from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
import {I18nManager} from 'react-native';
I18nManager.allowRTL(false);
import api from './src/api/api.js';
import OneSignal from 'react-native-onesignal';
import {createAppContainer } from "react-navigation";
import RootNav from './navigator.js';
import RootNavAR from './navigator_ar.js';
import RootNavKR from './navigator_kr.js';

import DeviceInfo from 'react-native-device-info';
const ContainerRootNav = createAppContainer (RootNav);
const ContainerRootNavAr = createAppContainer (RootNavAR);
const ContainerRootNavKr = createAppContainer (RootNavKR);

export default class App extends Component<Props> {
	playerid =0;
	constructor (props){
		super(props);
		OneSignal.init("7ade2603-aed9-48d8-9d03-978e15282620");

		
		//saveOnSignlePlayerId
		//this.saveOnSignlePlayerId = this.saveOnSignlePlayerId.bind(this)
		this.state ={
			
			loadedInfo:false,
			isRegistered:false,
		};
		
	}
	changeLang = async(lang)=>{
		let zuid = 0;
		await AsyncStorage.getItem("zuid").then((value) => zuid = value);
		await AsyncStorage.getItem("mobileLang").then((value) => mobileLang = value);
		//alert("lang is--->"+mobileLang);
		await AsyncStorage.setItem("mobileLang", lang);
		await api.saveLangPreference(zuid, lang);
		this.setState({mobileLang:lang});
	}
	
	
	async componentDidMount() {
		const deviceLocale = 'en';//DeviceInfo.getDeviceLocale().toLowerCase();
		await AsyncStorage.getItem("mobileLang").then((value) => mobileLang = value);
		//alert("mobile lang in device is "+mobileLang);
		if (mobileLang != undefined && mobileLang !=null){
			if (mobileLang=="AR"){
				this.setState({mobileLang:"AR"});
				console.log("ar");
			}else if (mobileLang=="EN"){
				this.setState({mobileLang:"EN"});
				console.log("en");
			}else {
				this.setState({mobileLang:"KR"});
			}
		}else{
			if (deviceLocale.startsWith("ar")){
				this.setState({mobileLang:"AR"});
				console.log("ar");
			}else{
				this.setState({mobileLang:"EN"});
				console.log("en");
			}
		}
		
		await this.getCustomerId();
		//save the mobile lang in device
		await AsyncStorage.setItem("mobileLang", this.state.mobileLang);
		
		OneSignal.addEventListener('received', this.onReceived);
		
		OneSignal.addEventListener('ids', this.onIds.bind(this));
		//OneSignal.configure();
	}
	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		//OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('ids', this.onIds);
		
	}

	onReceived(notification) {
		//console.log("Notification received: ", notification);
	}

	async getCustomerId (){
		const id = null;
		try{
			const id = await AsyncStorage.getItem("custId");
			if (id !=undefined && id !=null && id>0){
				isRegistered = true;
				this.setState({custId:id ,isRegistered:true});
			}
			this.setState({loadedInfo:true});
		}catch (error){
			alert(error);
		}
		return id;
	}

	async onIds(device) {
		console.log('Device info: ', device);
		//alert('Device info: '+ device);
		this.setState({playerid:device.userId});
		await this.saveOneSignalPlayerId();
	}
	
	async  saveOneSignalPlayerId (){
		
		try{
			await AsyncStorage.setItem("playerid",this.state.playerid);
		}catch (error){
			alert(error);
		}
		
	}
  render() {
	 
	  //const deviceCountry = DeviceInfo.getDeviceCountry();
	if (this.state.playerid != undefined){
		console.log("playerid in state==>"+this.state.playerid);
		//await this.saveOneSignalPlayerId();
	}
	
	if(this.state.loadedInfo){
		 if (this.state.mobileLang =="EN")
			return (<ContainerRootNav screenProps={{AppCallBackFunction:this.registerUser, lang:this.changeLang, isRegistered:this.state.isRegistered}}/>  
			);
		else if (this.state.mobileLang =="AR")
			return (<ContainerRootNavAr screenProps={{AppCallBackFunction:this.registerUser,lang:this.changeLang,isRegistered:this.state.isRegistered}}/> 
			);
		else if (this.state.mobileLang =="KR")
			return (<ContainerRootNavKr screenProps={{AppCallBackFunction:this.registerUser,lang:this.changeLang,isRegistered:this.state.isRegistered}}/> 
			);
			
	}else{
		
		return (<View></View>);
			
	}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header :{
	backgroundColor: 'white',
	alignItems:"center",
	
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);