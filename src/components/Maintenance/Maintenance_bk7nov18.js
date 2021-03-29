import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
AsyncStorage,
ScrollView,
KeyboardAvoidingView,
TouchableWithoutFeedback,
Keyboard
} from 'react-native';

import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import * as globalStyles from '../../styles/global';
import api from '../../api/api.js';
import { Grid, Row ,Col} from "react-native-easy-grid";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Left,
  Body,
  Right,
  List,
  ListItem,
  Form,
  Label,
  Input
} from "native-base";

	export class Maintenance extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				custId : null,
				lastMileage :0,
				zuid : null,
				//callBackMethod : this.props.navigation.getParam("callBackMethod"),
				validMileage : true,
			}
		}
		
		
		async componentDidMount(){
			try{
				//alert('checking');
				const zuidInPhone = await AsyncStorage.getItem("zuid");
				//alert("in storage=>"+zuidInPhone);
				const lastMileageVal = await api.getLastMileage('EN',zuidInPhone);
				this.setState({lastMileage : lastMileageVal});
				this.setState({zuid : zuidInPhone});
				//alert("in lastMileageVal=>"+lastMileageVal);
				this.setState({custId:id});
			}catch(error){
				console.log(error);
			}
		}
		
		async _saveNewMileage(){
			num = /^[0-9]+$/
			if (this.state.newMileage !=='' && this.state.newMileage !== undefined && this.state.newMileage !==null && num.test(this.state.newMileage) ){
				const zuid = this.state.zuid;
				const newMileage = this.state.newMileage;
				
				const result = await api.saveNewMileageAndGetRecomendations(zuid, newMileage, this.state.lastMileage );
				//this.state.callBackMethod ();
				this.props.navigation.navigate("AdviceTable");
			}else{
				this.setState ({validMileage:false});
			}
			
			//this.setState({isLoading:false});
		}
		
		showCheckForm(){
			
			return (
			<Form style={styles.form}>
				<View style={styles.formRow}>
								
					<Input keyboardType={'numeric'}
						name = "newMileage"
						onChangeText={newMileage =>this.setState({newMileage:newMileage})}
						style={[styles.textInputStyle ,!this.state.validMileage?styles.error:null]}
						maxLength = {7}
					/>
				</View>
					<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
						<Button block onPress={()=> {this._saveNewMileage();}}
							style={{backgroundColor:"#d1251a", flex:1, margin: 15, marginTop: 10, padding:10 }}>
							<Text style={{color:"white"}}>Enter Last Mileage</Text>
							</Button>
					</View>
				</Form>
			);
		}
		
		render() {
			return (
			<KeyboardAwareView animated={true}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../../img/landingpageblur.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" ,flex:1, justifyContent:"flex-start" ,}}>
						
						<View style={{flex:1 ,flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-end",marginTop:10, }}>
							<View style={{flex:12 , justifyContent:"flex-end" }}>
							</View>
							<View style={{flex:3 , justifyContent:"flex-end" }}>
							
								<Button	transparent style={{}} onPress={() => this.props.navigation.goBack()}>
										<Image source={require("../../../img/exit.png")}  style={{ 
											flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'}}/>
									</Button>
							</View>
						</View>
						
						<View style={{flex:4,marginTop:0 , marginLeft:20 , marginRight:20 ,paddingLeft:5,paddingRight:5, backgroundColor:"white",
										elevation:4,
									shadowOffset: { width: 5, height: 5 },
									shadowColor: "grey",
									shadowOpacity: 0.5,
									shadowRadius: 10,}}>
							<View style={{flex:1,flexDirection:"row"}}>
								<View style={{flex:3}}>
									
										<Image source={require("../../../img/rpm.png")}  style={{ 
											flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'}}/>
									
								</View>
								<View style={{flex:2,marginTop:10,flexDirection:"column", alignItems:"center"}}>
										
											<Image source={require("../../../img/popuplogo.png")}  style={{ 
												flex:1,
												width: "100%",
												height: "100%",
												resizeMode: 'center'}}/>
										
										<View style={{flex:1 , justifyContent:"center"}}>
											<Text style={{alignSelf:"center" ,fontSize:9 , color:"#d1251a" }}>
												Last mileage
											</Text>
											<Text style={{alignSelf:"center",fontSize:9 , color:"#d1251a" }}>
												{this.state.lastMileage}
											</Text>
										</View>
										
									
								</View>
								<View style={{flex:3 }}>
									<Image source={require('../../../img/meter.png')}
										style={{
											flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'
											}}
									/>
								</View>
							</View>
							
							<View style={{flex:1}}>
								{this.showCheckForm()}
							</View>
							
						</View>
						<View style={{flex:1}}>
						</View>
					</View>
				</ImageBackground>
				</TouchableWithoutFeedback>
				</KeyboardAwareView >
				);
		}
	}
	
	
	const styles = StyleSheet.create(
	{
		scrollView:{
    flex:1,
   
  },
		backgroundImage: {flex: 1, width:undefined, height:undefined },
		form:{flexDirection : "column" , justifyContent:"center" ,alignItems:"center" ,marginTop:20, },
		formRow : {flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1 , marginBottom:20 },
		textInputStyle :{ height:35 ,borderColor: 'gray',width:"20%",backgroundColor :"#FFF", borderWidth: 1, flex:1, alignSelf:'center' ,
						fontSize :10 , paddingTop:10 , marginLeft:50,marginRight:50,
						lineHeight:10 , borderRadius:7 , marginBottom : 10, marginTop:10},
		error : {borderColor: '#d1251a'},
		labelStyle : {fontFamily:"Franklin Gothic Book Regular" , fontSize:11 ,color:"#d1251a" , paddingRight : 10 , marginBottom:10},
		progressBar: {
		backgroundColor: '#0a0a0a',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
		},
		 container: {
    flex:1,
    paddingTop:65,
    
  },
		
	}
);

	
