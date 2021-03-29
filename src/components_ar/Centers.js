import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
Text,
ImageBackground,
Image
} from 'react-native';
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
  TabHeading
} from "native-base";

import ServiceCenterTab from './FindUsTabs/ServiceCenterTab';
//import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import ShowRoomTab from './FindUsTabs/ShowRoomTab';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';


	export  class Centers_ar extends Component <{}> {
		constructor (props){
			super(props)
			this.state = { 
				currentTab: 1 ,
				isLoading : true,
			}
		}
		
	
				
		render() {							
			return (
				
										
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/bg.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
						<View style={{backgroundColor:"#004777",flex:1,paddingTop:10,alignItems:"center", paddingLeft:0}}>
							<View style={{flexDirection : "row-reverse", backgroundColor:"#004777",paddingBottom:10, flex:1,
								paddingLeft:0}}>
								
								<View style={{flex:3, justifyContent : "flex-start", alignItems:"flex-start"}}>
									<Button	transparent onPress={() => this.props.navigation.goBack()}>
										<Image source={require("../../img/back_ar.png")}  style={{ 
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
							<View style={{flexDirection : "row",paddingTop:10,marginTop:10 , justifyContent:"center" , alignItems:"center", flex:1,
									marginLeft:30, marginRight:30 , marginBottom :5}}>
								<Text style={{ fontSize:15, fontWeight:"bold" ,color:"white"}}>
									 مراكز الصيانه
								</Text>							
							</View>
						</View>
						<View style={{flex:5, marginTop:10 , marginLeft:20 , marginRight:20}}>
							
							<ServiceCenterTab navigation = {this.props.navigation}/>
								
						</View>
						
						
					</View>
				</ImageBackground>
			);
		}
	}
	

	
	const styles = StyleSheet.create(
		{
			backgroundImage: {flex: 1, width:undefined, height:undefined },
			form:{flexDirection : "column" , justifyContent:"flex-start" },
			formRow : {flexDirection : "row" , justifyContent:"flex-start" , alignItems:"center", flex:1 },
			textInputStyle :{ height:35 ,borderColor: 'gray',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :10 , paddingTop:10 ,
			lineHeight:10 , borderRadius:7 , marginBottom : 10},
			labelStyle : {fontFamily:"Franklin Gothic Book Regular" , fontSize:11 ,color:"#d1251a" , paddingRight : 10 , marginBottom:10},
			progressBar: {
				backgroundColor: '#0a0a0a',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center'
			},
			activeTab :{backgroundColor:"#fff",borderTopColor:"#D3D3D3", borderRightColor:"#D3D3D3" , borderBottomColor:"blue", 
				borderTopRightRadius:7,paddingLeft:0,paddingRight:0, borderTopLeftRadius:7, borderRightColor:"#d1251a",borderRightWidth:10, borderTopWidth:1,borderLeftWidth:1},
			inActiveTab : {backgroundColor:'white',paddingLeft:0,paddingRight:0,borderColor:"#D3D3D3",borderLeftWidth:1, borderTopLeftRadius:7, 
				borderTopRightRadius:7 , borderTopWidth:1, borderRightWidth:1}
		
	});

	
