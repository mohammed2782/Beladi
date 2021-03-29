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
	Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import api from '../api/api.js';
import {BeladiHeaderWhiteBack} from './BeladiHeaderWhiteBack';
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
  ScrollableTab
} from "native-base";
import ProgressBar from './ProgressBar';

export class GetPromotionInfo extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : false,
			status : 0,
			nameEmpty:false,
			hpEmpty:false,
			custEmailError : false,
			promoId : this.props.navigation.state.params.promoId,
		};
	}
	async componentDidMount (){
		await this.loadCustomerPromoInfo();
		
	}
	async validateEmail(email) {
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
		return re.test(String (email).toLowerCase());
	}
	
	async _setCustomerInfoForPromotion(){
		try{
			const custName = this.state.custName;
			const custHP1 = this.state.custHP1;
			const custEmail = this.state.custEmail;
			
			var allGood = true;
			var nameEmptyF = false; var hpEmptyF = false; var custEmailError= false;
			
			
			
			if (custName !=='' && custName !== undefined && custName !==null && custName != 'undefined'){
				;
			}else{
				allGood = false;
				nameEmptyF = true;
			}
			if (custHP1 !=='' && custHP1 !== undefined && custHP1 !==null && custHP1 !=='undefined' ){
				if (custHP1.length != 11){
				Alert.alert("","Phone number should be 11 digit");
				allGood = false;
				hpEmptyF = true;
			}
			}else{
				allGood = false;
				hpEmptyF = true;
			}
			if (custEmail !=='' && custEmail !== undefined && custEmail !==null && custEmail !== 'undefined'){
				if (!await this.validateEmail(custEmail)){
					allGood = false;
					custEmailError = true;
				}
			}
			this.setState({ nameEmpty:nameEmptyF , hpEmpty:hpEmptyF ,custEmailError:custEmailError});
			
			if (allGood){
				await this.storeCustomerInfoInDevice (custName, custHP1, custEmail);
				this.setState({isLoading:true});
				const result = await api.registerForPromotion(this.state.promoId, custName, custHP1, custEmail );
				//this.setState({status:result.rs});
				//alert(result);
				if (result.errorMessage!==null && result.errorMessage!==undefined){
					//alert(result.errorMessage);
					//alert("error");
				}else{
					//alert(result.custId);
					//store in AsyncStorage
					//await this.storePromoInfoInDevice(result.promoId);
					//alert("pass");
					alert('We recieved your request, we will contact you soon.\nThank you');
				}
				this.setState({isLoading:false});
			}
		}catch(error){
			console.log(error);
		}
	}
	
	
	async loadCustomerPromoInfo (){
		const id = null;
		try{
			let custNamePromo = await AsyncStorage.getItem("custName");
			let custHPpromo = await AsyncStorage.getItem("custHp1");
			let custEmailPromo = await AsyncStorage.getItem("custEmail");
			if (custHPpromo !=='' && custHPpromo !== undefined && custHPpromo !==null && custHPpromo !== 'undefined'){
				;
			}else{
				custNamePromo = await AsyncStorage.getItem("custNamePromo");
			}
			
			if (custHPpromo !=='' && custHPpromo !== undefined && custHPpromo !==null && custHPpromo !== 'undefined'){
			;
			}else{
				custNamePromo = await AsyncStorage.getItem("custNamePromo");
			}
			
			if (custEmailPromo !=='' && custEmailPromo !== undefined && custEmailPromo !==null && custEmailPromo !== 'undefined'){
			;
			}else{
				custEmailPromo = await AsyncStorage.getItem("custNamePromo");
			}
			
			this.setState({custName:custNamePromo, custHP1 : custHPpromo, custEmail : custEmailPromo});
			
		}catch (error){
			alert(error);
		}
		return id;
	}
	async storeCustomerInfoInDevice (custName , custHp, custEmail){
		try{
			await AsyncStorage.setItem("custNamePromo",custName);
			await AsyncStorage.setItem("custHpPromo",custHp);
			await AsyncStorage.setItem("custEmailPromo",custEmail);
		}catch(error){
			alert(error);
		}
	}
	
	render() {
		//alert(this.state.promoId);
		if (this.state.isLoading){
			return (<View style={styles.progressBar}><ProgressBar /></View>);
		}
		return(
			<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/contactusbg.png')} blurRadius={0} resizeMode = "cover">
				<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
					<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
					<View style={{flex:2, backgroundColor:"#004777"}}> 
							<View style={{flex:1}}>
								<BeladiHeaderWhiteBack navigation={this.props.navigation}/>
							</View>
							<View style={{flex:1,flexDirection : "column" , justifyContent:"flex-end" , alignItems:"flex-start", flex:1,
								marginLeft:10, marginRight:30 , marginBottom :5}}>
								
								<View style={{flex:1}}>
								<Text style={{fontSize:14,paddingTop:5, fontWeight:"bold" ,color:"white"}}>
									Get promotion
								</Text>	
								</View>
							</View>
					</View>
					<View style={{flexDirection : "row" , justifyContent:"flex-start" , alignItems:"center", flex:1,
							marginLeft:30, marginRight:30 , marginBottom :20,marginTop:20}}>
						<Text style={{fontFamily:"Franklin Gothic Book Regular" , fontSize:13, fontWeight:"bold" ,color:"black"}}>
							Code: {this.props.navigation.state.params.promoCode}
						</Text>
								
					</View>
					<View style={{flex:2}}/>
					<View style={{flex:3 , marginLeft:30, marginRight:30,}}>
						<Form style={styles.form}>
									<View style={styles.formRow} >
										<Input 
											name = "customerName" placeholder="Your Name"
											onChangeText={customerName =>this.setState({custName:customerName})}
											style={[styles.textInputStyle,this.state.nameEmpty?styles.error:null]}
										/>
										
									</View>
									<View style={styles.formRow}>
										<Input 
											keyboardType={'numeric'}
											name = "custHP1" placeholder="Phone number"
											onChangeText={custHP1 =>this.setState({custHP1:custHP1})}
											style={[styles.textInputStyle,this.state.hpEmpty?styles.error:null]}
											
										/>
									</View>
									<View style={styles.formRow}>
										<Input 
											name = "custEmail" placeholder="Email"
											onChangeText={custEmail =>this.setState({custEmail:custEmail})}
											style={[styles.textInputStyle,this.state.custEmailError?styles.error:null]}
										/>
									</View>
									
									
									<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
										<Button block onPress={()=> {this._setCustomerInfoForPromotion();}}
											style={{backgroundColor:"#004777", flex:1, margin: 15, marginTop: 10, padding:10 }}>
											<Text style={{color:"white"}}>Get Promotion</Text>
										</Button>
									</View>
										
								</Form>
								
						
					
					</View>
					
				</View>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			
			</ImageBackground>
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
		textInputStyle :{ height:35 ,borderColor: 'gray',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :12 , paddingTop:10 ,
		lineHeight:10 , borderRadius:7 , marginBottom : 10},
		labelStyle : {fontFamily:"Franklin Gothic Book Regular" , fontSize:13 ,color:"#d1251a" , paddingRight : 10 , marginBottom:10},
		validationError : {borderColor: '#d1251a' , borderWidth:1.5},
		progressBar: {
		backgroundColor: '#0a0a0a',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		},
		error : {borderColor: '#d1251a' , borderWidth:1.5},
	
		
	}
);