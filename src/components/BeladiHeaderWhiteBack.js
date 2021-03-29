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

} from 'react-native';
import {
  Container,
  Header,
  Title,
  Fab,
  Button,
  IconNB,
  Left,
  Right,
  Body,
  Icon,
  Content
} from "native-base";
import { Grid, Row ,Col} from "react-native-easy-grid";
export const BeladiHeaderWhiteBack =({navigation})=>{
	return (
		<View style={{flexDirection : "row" , justifyContent:"space-between", flex:1,
							paddingLeft:10 , marginTop : 20}}>
			<View style={{flex:2}}>
			<Button	transparent onPress={() => navigation.goBack()}>
				<Image source={require("../../img/back_en.png")}  style={{ paddingTop:0,
					width: 30,
					height: 30,
					resizeMode: 'contain'}}/>
			</Button>
			
			</View>
			<View style={{flex:2,marginLeft:10, flexDirection : "column" }}>
							<Image source={require('../../img/logowhite.png')}
								style={{
									
									
									alignSelf: "flex-start",
									width: "80%",
									height: "80%",
									resizeMode: 'contain'
									}}
							/>
			</View>
		</View>
		
)}
const styles = StyleSheet.create({
		MainContainer :{
			flex:1,
		
			
		},
		backgroundImage: {
			flex: 1,
			width:undefined,
			height:undefined
		},
		logoview:{
			//backgroundColor: 'rgba(176,196,222,0.4)',
			//backgroundColor: 'rgba(47,79,79,0.5)',
			flex: 1,
			alignItems:"flex-end",
			paddingTop:10,
			
		},
		text: {
			textAlign: 'center',
			color: 'white',
			fontSize: 20
		},
		 mb15: {
			marginBottom: 20,
			backgroundColor: "#FF8C00" ,
			
		},
	});