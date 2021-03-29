import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
ScrollView,
KeyboardAvoidingView,
TouchableWithoutFeedback,
Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
//import * as globalStyles from '../../styles/global';
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

	export class OilPopUp_kr extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				custId : null,
				zuid : null,
				callBackMethod : this.props.navigation.getParam("callBackMethod")
			}
		}
		
		async componentWillMount(){
			
		}
		
		async componentDidMount(){
			try{
				
				//alert('checking');
				const zuidInPhone = await AsyncStorage.getItem("zuid");
				this.setState({zuid : zuidInPhone});
				try{
					const lastMileageVal = await api.getLastOilChangedMileage('KR',zuidInPhone);
					this.setState({lastMileage : lastMileageVal});
					}catch(error){
						console.log(error);
					}
			}catch(error){
				console.log(error);
			}
		}
		
		async _saveOilChange(){
			const zuid = this.state.zuid;
			const newMileage = this.state.newMileage;
			
				const result = await api.saveOilChangeMileage(zuid, newMileage , 'KR' );
				console.log(result);
				if (result.errorMessage!==null && result.errorMessage!==undefined)
					alert(result.errorMessage);
				else{
					this.props.navigation.navigate("Home");
					this.state.callBackMethod ();
				}
		}
		
		showCheckForm(){
			
			return (
			<Form style={styles.form}>
				<View style={styles.formRow}>
								
					<Input 
						name = "newMileage"
						keyboardType={'numeric'}
						placeholder = ""
						placeholderTextColor = "#D3D3D3"
						onChangeText={newMileage =>this.setState({newMileage:newMileage})}
						style={styles.textInputStyle}
						maxLength = {7}
					/>
				</View>
					<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
						<Button block onPress={()=> {this._saveOilChange();}}
							style={{backgroundColor:"#004777", flex:1, margin: 15, marginTop: 10, padding:10 }}>
							<Text style={{color:"white"}}>زياد دەكات</Text>
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
						
						<View style={{flex:3,marginTop:0 , marginLeft:20 , marginRight:20 ,paddingLeft:5,paddingRight:5, backgroundColor:"white",
										elevation:4,
									shadowOffset: { width: 5, height: 5 },
									shadowColor: "grey",
									shadowOpacity: 0.5,
									shadowRadius: 10,}}>
							<View style={{flex:1,flexDirection:"row"}}>
								<View style={{flex:2,marginTop:10,flexDirection:"column", alignItems:"center"}}>
										
											<Image source={require("../../../img/logoen.png")}  style={{ 
												flex:2,
												width: "100%",
												height: "100%",
												resizeMode: 'center'}}/>
								</View>
								
							</View>
							<View style={{flex:1 , justifyContent:"center"}}>
											<Text style={{alignSelf:"center" ,fontSize:13 , color:"#004777" }}>
												کۆتاجاری گورینه‌ وه‌ی ڕۆن: {this.state.lastMileage}
											</Text>
										</View>
							<View style={{flex:3}}>
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
		textInputStyle :{ height:40 ,borderColor: 'gray',width:"20%",backgroundColor :"#FFF", borderWidth: 1, flex:1, alignSelf:'center' ,textAlign: 'center',
		fontSize :11 , paddingTop:10 , marginLeft:50,marginRight:50,
		lineHeight:10 , borderRadius:7 , marginBottom : 10, marginTop:10},
		labelStyle : {fontFamily:"Franklin Gothic Book Regular" , fontSize:13 ,color:"#d1251a" , paddingRight : 10 , marginBottom:10},
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

	
