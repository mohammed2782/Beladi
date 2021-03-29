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
Keyboard,
Alert
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//import * as globalStyles from '../../styles/global';
import api from '../../api/api.js';
import { Grid, Row ,Col} from "react-native-easy-grid";
import FitImage from 'react-native-fit-image';
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
  Input,
  
} from "native-base";

	 class Maintenance_ar extends Component  {
		_isMounted = false;
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				custId : null,
				isLoading : true,
				lastMileage :0,
				lastOilChange:0,
				zuid : null,
				//callBackMethod : this.props.navigation.getParam("callBackMethod"),
				validMileage : true,
			}
		}
		async componentDidUpdate(prevProps) {
			
			if (prevProps.isFocused !== this.props.isFocused) {
				console.log('here we go ====>'+this.props.isFocused);
				if(this.props.isFocused)
					await this._fetchData();			
			}
		}
		
		componentWillUnmount() {
			//alert("unmount");
			this._isMounted = false;
		}
		async _fetchData() {
			this._isMounted = true;
			try{
				
					this.setState({isLoading:true});
					const zuidInPhone = await AsyncStorage.getItem("zuid");
					//alert("in storage=>"+zuidInPhone);
					const lastMileageVal = await api.getLastMileage('EN',zuidInPhone);
					const lastOilChangeVal = await api.getLastOilChangedMileage('EN',zuidInPhone);
					//alert("did mount");
					if (this._isMounted){
						this.setState({lastMileage : lastMileageVal});
						this.setState({lastOilChange : lastOilChangeVal});
						this.setState({zuid : zuidInPhone});
						//alert("in lastMileageVal=>"+lastMileageVal);
						//this.setState({isLoading:false});
					}
				
			}catch(error){
				console.log(error);
			}
			this.setState({isLoading:false});
		}
		
		async componentDidMount(){
				await this._fetchData();
		}
		
		async _resetAll(){
			Alert.alert(
			  'إعادة تهيئة ',
			  'هل تريد إعادة تهيئة العداد',
			  [
				{text: 'إلغاء', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'نعم', onPress: () => this._resetOptionHandle()},
			  ],
			  { cancelable: false }
			);
		}
		
		async _resetOptionHandle(){
			this.setState({isLoading:true});
			try{
				this.setState({isLoading:true});
				const zuidInPhone = await AsyncStorage.getItem("zuid");
				//alert("in storage=>"+zuidInPhone);
				await api.resetOilAndKilometer(zuidInPhone);
				this.setState({lastMileage : 0});
				this.setState({lastOilChange:0});
			}catch(error){
				console.log(error);
			}
			
			this.setState({isLoading:false});
		}
		
		
		async _saveNewMileage(){
			this.setState({isLoading:true});
			num = /^[0-9]+$/
			//alert('new mileage-->'+this.state.newMileage)
			if (this.state.newMileage !=='' && this.state.newMileage !== undefined && this.state.newMileage !==null && num.test(this.state.newMileage) ){
				const zuid = this.state.zuid;
				const newMileage = this.state.newMileage;
				
				const result = await api.saveNewMileageAndGetRecomendations(zuid, newMileage, this.state.lastMileage );
				//this.state.callBackMethod ();
				//this.props.navigation.navigate("AdviceTable");
				//this.setState({lastMileage:newMileage});
				if(result !== undefined && result !='undefined'){
					Alert.alert('',"تم حفظ العداد الجديد");
					//this.setState({lastMileage:newMileage});
					//this.setState({newMileage:''});
					this.props.navigation.navigate("Home");
				}
			}else{
				this.setState ({validMileage:false});
				this.setState({isLoading:false});
			}
			
			//
		}
		
		showCheckForm(){
			
			return (
			<Form style={styles.form}>
				<View style={styles.formRow}>
								
					<Input keyboardType={'numeric'}
						name = "newMileagein"
						onChangeText={newMileagein =>this.setState({newMileage:newMileagein})}
						style={[styles.textInputStyle ,!this.state.validMileage?styles.error:null]}
						maxLength = {7}
					/>
				</View>
					<View style={{flexDirection : "row" , justifyContent:"center",borderRadius:10 , alignItems:"center", flex:1}}>
						<Button block onPress={()=> {this._saveNewMileage();}}
							style={{backgroundColor:"#004777", flex:1, margin: 10, marginTop: 5, padding:10 }}>
							<Text style={{color:"white", fontSize:11}}>أدخل العداد الحالي</Text>
							</Button>
					</View>
				</Form>
			);
		}
		
		render() {
			if (this.state.isLoading)
				return (<View><Image source={require('../../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			return(
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../../img/kilobg.png')} blurRadius={0} resizeMode = "cover">
					<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}   contentContainerStyle={{flexGrow: 1}} >
						<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
							<View style={{flexDirection:"column" ,flex:1, justifyContent:"flex-start",}}>
								<View style={{flexDirection : "row-reverse" ,flex:0.5,marginTop:20,alignItems:"flex-start", paddingLeft:0,}}>
									<View style={{flex:4, justifyContent : "flex-start", alignItems:"center"}}>
										<Button	transparent style={{}} onPress={() => this.props.navigation.openDrawer()}>
											<Image source={require("../../../img/BurgerMenuArWhite.png")}  style={{ 
												flex:1,
												width: "70%",
												height: "70%",
												resizeMode: 'contain'}}/>
										</Button>
									</View>
									<View style={{flex:3,marginTop:10,paddingLeft:20,justifyContent : "flex-start", alignItems:"flex-start" ,}}>
										<Text style = {{color:'#d1251a', fontSize:14, fontWeight:"600", fontFamily:'Futura Md BT Bold'}}>
										</Text>
									</View>
									<View style={{flex:2, alignSelf: "flex-end",marginLeft:10, }}>
									</View>
								</View>
								<View style={{flex:3,marginTop:0 , marginLeft:20 , marginRight:20 ,paddingLeft:5,paddingRight:5,
										borderRadius:10, backgroundColor:"#D3D3D3",}}>
									
									<View style={{flex:4,marginTop:10,zIndex:1,  alignItems:"flex-start",justifyContent : "flex-start"}}>
											
											<Image source={require("../../../img/kilo.png")}  style={{ 
													flex:10, width:"100%", height:"100%" }} resizeMode = "contain"/>
											<View style={{flex:0.5,flexDirection:"row",justifyContent:"flex-start",}}>
												<View style={{flex:1, justifyContent:"flex-start",}}>
													
													<Text style={{alignSelf:"center",fontSize:11 , color:"#071e38" }}>
														أخر تغيير للزيت
													</Text>
												</View>
												<View style={{flex:1 , justifyContent:"flex-start"}}>
													<Text style={{alignSelf:"center",fontSize:11 , color:"#071e38" }}>
														العداد الحالي
													</Text>
												</View>
											</View>
											<View style={{flex:2,marginTop:-5,flexDirection:"row",backgroundColor:"#071e38",borderRadius:5,marginLeft:20,marginRight:20}}>
												<View style={{flex:1,flexDirection:"row", justifyContent:"center",}}>
													<Image source={require("../../../img/small_oil.png")}  
														style={{flex: 1, width:"80%", height:"80%" }} resizeMode = "center"/>
													<Text style={{flex:1,alignSelf:"center",fontSize:11 , color:"white" }}>
														{this.state.lastOilChange}
													</Text>
												</View>
												<View style={{flex:1 ,flexDirection:"row", justifyContent:"center"}}>
													<View style={{flex:1}}/>
													<Image source={require("../../../img/small_kilo.png")}  
														style={{flex: 1, width:"90%", height:"90%" }} resizeMode = "center"/>
													<Text style={{flex:1,alignSelf:"center",fontSize:11 , color:"white" }}>
														{this.state.lastMileage}
													</Text>
												</View>
											</View>
											<View style={{flex:3}}/>
									</View>
									
									<View style={{flex:0.5,justifyContent:"flex-end",zIndex:-1, justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
											<Button iconLeft onPress={()=> {this._resetAll();}} transparent style={{flex:1,height:20,borderColor: 'gray'}} textStyle={{color:'red'}}>
												<Icon active name="refresh" style={{color: 'gray',fontSize:18}} />
												<Text style={{color: 'gray',fontSize:11}}>إعادة تهيئة العداد</Text>
											</Button>
									</View>
									
									<View style={{flex:0.5,backgroundColor:"yellow",justifyContent:"flex-end",zIndex:3,backgroundColor:"#D3D3D3"}}>
										{this.showCheckForm()}
									</View>
								</View>
								<View style={{flex:1.5}}>
								</View>
								
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAwareScrollView>
				</ImageBackground>
			);
		}
	}
	
	
	const styles = StyleSheet.create(
	{
		scrollView:{
    flex:1,
   
  },
		backgroundImage: {flex: 1, width:undefined, height:undefined },
		form:{flexDirection : "column" , justifyContent:"center" ,alignItems:"center" ,marginTop:0, },
		formRow : {flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1 , marginBottom:5 },
		textInputStyle :{ height:35 ,borderColor: 'gray',width:"20%",backgroundColor :"#FFF", borderWidth: 1, flex:1, alignSelf:'center' ,
						fontSize :10 , paddingTop:5 , marginLeft:50,marginRight:50,
						lineHeight:10 , borderRadius:7 , marginBottom : 5, marginTop:5},
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

	export default withNavigationFocus(Maintenance_ar);
