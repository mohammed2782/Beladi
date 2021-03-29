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
export const SocialMediaShare = ({that})=>{
	return (
		<View style={{  marginBottom:0}}>
			<Image source={require("../../img/footercontact.png")}  style={{ paddingTop:0, flex: 1,
				width:"100%" , height:"100%",
				resizeMode: 'contain'}}/>		
		</View>
)};