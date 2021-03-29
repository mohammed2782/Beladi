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
//import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {BeladiHeaderWhiteBack} from './BeladiHeaderWhiteBack';
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
  Textarea
} from "native-base";
import ProgressBar from './ProgressBar';

//import LinearGradient from 'react-native-linear-gradient';
import TabOne from "./SingleCarTabs/tabOne";
import TabTwo from "./SingleCarTabs/tabTwo";
import TabThree from "./SingleCarTabs/tabThree";
import Swiper from 'react-native-swiper';

export class ContactUs_ar extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : false,
			status : 0,
			zuid : null,
			nameEmpty:false,
			hpEmpty:false,
			msgEmpty:false,
			custEmailError : false,
		};
	}
	async componentDidMount(){
		try{
			
			//alert('checking');
			const zuidInPhone = await AsyncStorage.getItem("zuid");
			this.setState({zuid : zuidInPhone});
		}catch(error){
			console.log(error);
		}
	}
	async validateEmail(email) {
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
		return re.test(String (email).toLowerCase());
	}
	async _contactSend(){
		const custName = this.state.custName;
		const custHP1 = this.state.custHP1;
		const custEmail = this.state.custEmail;
		const msg = this.state.msg;
		var allGood = true;
		var nameEmptyF = false; var hpEmptyF = false; var msgEmptyF = false;var custEmailError= false;
		
		if (custName !=='' && custName !== undefined && custName !==null && custName != 'undefined'){
			;
		}else{
			allGood = false;
			nameEmptyF = true;
		}
		if (custHP1 !=='' && custHP1 !== undefined && custHP1 !==null && custHP1 !=='undefined' ){
			if (custHP1.length != 11){
				Alert.alert("","رقم الهاتف يجب أن يكون 11 رقم");
				allGood = false;
				hpEmptyF = true;
			}
		}else{
			allGood = false;
			hpEmptyF = true;
		}
		if (msg !=='' && msg !== undefined && msg !==null && msg !== 'undefined'){
			;
		}else{
			allGood = false;
			msgEmptyF = true;
		}
		if (custEmail !=='' && custEmail !== undefined && custEmail !==null && custEmail !== 'undefined'){
			if (!await this.validateEmail(custEmail)){
				allGood = false;
				custEmailError = true;
			}
		}
		this.setState({msgEmpty : msgEmptyF , nameEmpty:nameEmptyF , hpEmpty:hpEmptyF, custEmailError:custEmailError });
		
		if (allGood){
			this.setState({isLoading:true});
			const result = await api.sendContactUsMsg(this.state.zuid, custName, custHP1, custEmail, msg, 'AR'  );
			//this.setState({status:result.rs});
			//alert(result);
			if (result.errorMessage!==null && result.errorMessage!==undefined)
				Alert.alert(result.errorMessage);
			else{
				Alert.alert('','لقد تم إستلام أستفسارك, سوف نتصل بك قريبا.\nشكرا لكم');
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
		<ImageBackground style={styles.backgroundImage} source={require('../../img/contactusbg.png')} blurRadius={0} resizeMode = "cover">
		<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
		<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
					
						<View style={{flex:2, backgroundColor:"#004777"}}> 
							<View style={{flex:1}}>
								<BeladiHeaderWhiteBack navigation={this.props.navigation}/>
							</View>
							<View style={{flex:1,flexDirection : "column" , justifyContent:"flex-end" , alignItems:"flex-end", flex:1,
								marginLeft:10, marginRight:30 , marginBottom :5}}>
								
								<View style={{flex:1,}}>
									<Text style={{fontSize:14,paddingTop:5, fontWeight:"bold" ,color:"white"}}>
										أتصل بنا
									</Text>	
								</View>
							</View>
						</View>
						<View style={{flex:6 , marginLeft:30,paddingTop:20, marginRight:30}}>
						
							
							
								<Form style={styles.form}>
									<View style={styles.formRow} >
										<Input 
											name = "customerName" placeholder="الأسم"
											onChangeText={customerName =>this.setState({custName:customerName})}
											style={[styles.textInputStyle,this.state.nameEmpty?styles.error:null]}
										/>
										
									</View>
									<View style={styles.formRow}>
										<Input 
											keyboardType={'numeric'}
											name = "custHP1" placeholder="رقم الهاتف"
											onChangeText={custHP1 =>this.setState({custHP1:custHP1})}
											style={[styles.textInputStyle,this.state.hpEmpty?styles.error:null]}
											
										/>
									</View>
									<View style={styles.formRow}>
										<Input 
											name = "custEmail" placeholder="البريد الألكتروني"
											onChangeText={custEmail =>this.setState({custEmail:custEmail})}
											style={[styles.textInputStyle,this.state.custEmailError?styles.error:null]}
										/>
									</View>
									<View style={styles.formRow}>
										<Label style={styles.labelStyle}>
											طلبك:  
										</Label>
									</View>
									<View style={styles.formRow}>
										<Input multiline={true} numberOfLine={5} name = "msg" 
											onChangeText={msg =>this.setState({msg:msg})}
											style={[styles.multiLineInputStyle,this.state.msgEmpty?styles.error:null]}
											bordered  /> 
									</View>
									
									<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
										<Button block onPress={()=> {this._contactSend();}}
											style={{backgroundColor:"#004777", flex:1, margin: 15, marginTop: 10, padding:10 }}>
											<Text style={{color:"white"}}>أرسل</Text>
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
		formRow : {flexDirection : "row-reverse" , justifyContent:"flex-start" , alignItems:"center", flex:1 },
		textInputStyle :{ height:40 ,borderColor: 'gray',textAlign :'right',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :13 , paddingTop:10 ,
		lineHeight:10 , borderRadius:7 , marginBottom : 10},
		error : {borderColor: '#d1251a' , borderWidth:1.5},
		labelStyle : {fontFamily:"Franklin Gothic Book Regular" , fontSize:14 ,color:"#004777" , paddingRight : 5,paddingLeft:10  , marginBottom:10},
		progressBar: {
		backgroundColor: '#0a0a0a',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		},
		multiLineInputStyle : {height:150,textAlign :'right' ,borderColor: 'gray',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :13 , paddingTop:10 ,
		lineHeight:10 , borderRadius:7 , marginBottom : 10 , textAlignVertical: "top"}
	
		
	}
);