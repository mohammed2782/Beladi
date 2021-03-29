import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList, StyleSheet, View, ImageBackground, Image,  TouchableWithoutFeedback,Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import OtherTab from './OtherTab';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
import util from '../util.js';
import {SocialMediaShare} from './SocialMediaShare';
import { Grid, Row ,Col} from "react-native-easy-grid";
import { KeyboardAwareView  } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  Container, Header, Title, Content, Button, Icon, Text, Form, Left, Body, Right, List, ListItem, ActionSheet, Root, Card,
  Thumbnail, CardItem, Badge, Item, Input
} from "native-base";


	export  class EcommerceCart extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				deleteFromCartCallBackMethod : this.props.navigation.getParam("DeleteFromCartCallBackMethod"),
				emptyAllCart : this.props.navigation.getParam("emptyAllCart"),
				cart : this.props.navigation.getParam("cart"),
				cartTotal:0,
				nameEmpty:false,
				hpEmpty:false,
				custEmailError : false,
				custId : null,
			}
		}
		
		async componentDidMount(){
			var tot = this._calcTotals();
			this.setState({cartTotal:tot});	
		}
		
		_removeItem = async (id)=>{
			var newCart = this.state.cart;
			for (i=0; i<newCart.length; i++){
				if (newCart[i].id === id){
						newCart.splice (i,1);
						break;
					}
			}
			this.setState ({cart:newCart});
			var tot = this._calcTotals();
			this.setState({cartTotal:tot});
			await this.state.deleteFromCartCallBackMethod(id);
		}
		_calcTotals(){
			var tot =0;
			for (i=0;i<this.state.cart.length; i++){
				 tot += this.state.cart[i].price * this.state.cart[i].count;
			}
			return tot;
		}
		
		async _buyItems(){
			let zuid=0;
			const custName  = this.state.custName;
			const custHP    = this.state.custHP;
			const custEmail = this.state.custEmail;
			const custNotes = this.state.msg;
			const cart 		= this.state.cart;
			var allGood 	= true;
			var nameEmptyF 	= false; var hpEmptyF = false; var vinEmptyF = false; var custEmailError= false;
			if (custName !=='' && custName !== undefined && custName !==null && custName != 'undefined'){
				;
			}else{
				allGood = false;
				nameEmptyF = true;
			}
			if (custHP !=='' && custHP !== undefined && custHP !==null && custHP !=='undefined' ){
				if (custHP.length != 11){
					Alert.alert("","Phone Number must be 11 digits");
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
			
			this.setState({nameEmpty:nameEmptyF , hpEmpty:hpEmptyF, custEmailError:custEmailError });
			console.log(cart);
			if (allGood){
				//alert("custid===>"+custId);
				this.setState({isLoading:true});
				try{
					const result = await api.purchaseItems(zuid, custName, custHP, custEmail, custNotes, cart , 'EN');
					if (result.errorMessage!==null && result.errorMessage!==undefined)
						alert(result.errorMessage);
					else{
						await Alert.alert("Purchase","Your purchase is completed, we will contact you for furthur details.");
						console.log("cart length is ==>"+cart.length);
						this.state.emptyAllCart();
						this.props.navigation.goBack();
					}
				}catch(error){
					console.log(error);
				}
			}
			this.setState({isLoading:false});
			
		}
		async validateEmail(email) {
			var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
			return re.test(String (email).toLowerCase());
		}
		async storeCustInfoInDevice (custName, custHp, custEmail){
			console.log("inside async storage");
			try{
				console.log("async before custId");
				if (custHp !==undefined)
					await AsyncStorage.setItem("custHp",custHp);
				if (custName !==undefined)
					await AsyncStorage.setItem("custName",custName);
				if (custEmail !==undefined)
					await AsyncStorage.setItem("custEmail",custEmail);
				console.log("async before fnished");
			}catch(error){
				console.log(error);
			}
		}
		render() {
			if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			return (
			<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
									<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/bg.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
						<View style={{flex:1, backgroundColor :"#004777", paddingLeft:0}}>
							<View style={{flexDirection : "row",paddingTop:10, flex:1}}>
								<View style={{flex:1, justifyContent : "flex-start", alignItems:"flex-start",}}>
									<Button	transparent style={{justifyContent : "flex-start"}} onPress={() => this.props.navigation.goBack()}>
										<Image source={require("../../img/xwhite.png")}  style={{ 
											flex:1,
											width: null,
											height: "100%",
											resizeMode: 'contain'}}/>
									</Button>
								</View>
								<View style={{flex:2,}}/>
								<View style={{flex:2 , justifyContent:"flex-start",alignItems:"flex-start",paddingRight:20 }}>
									<Image source={require('../../img/logowhite.png')}
										style={{
											flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'
											}}
									/>
								</View>
							</View>
						</View>
						
						<View style={{flex:8, marginTop:5 , marginLeft:35, marginRight:35}}>
							<View style={{flexDirection:"row",backgroundColor:"#7797ad",borderTopLeftRadius:7,borderTopRightRadius:7,justifyContent:"center", alignItems:"center"}}>
								<View style={{flex:1,justifyContent:"center",alignItems:"center",paddingTop:5,paddingBottom:5}}>
									<Text style={{fontSize:11,fontWeight: 'bold',color:"#b7b7b7"}}>Item Name</Text>
								</View>
								<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
									<Text style={{fontSize:11,fontWeight: 'bold',color:"#b7b7b7"}}>Subtotal</Text>
								</View>
							</View>
							<View>
								<FlatList 
									data={this.state.cart}
									style={{}}
									keyExtractor={item => item.id}
									renderItem={({item}) =>(
											<Card style={{paddingTop:0,paddingBottom:0,marginTop:0, marginBottom:1,borderRightWidth:0,borderLeftWidth:0,flex:1,borderRadius:0}}>
												<ListItem style={{flex:1,flexGrow:1,  paddingRight:0,marginLeft:0,paddingLeft:0,borderRadius:0, marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0,borderBottomWidth:0}}>
													<View style={{flex:1,flexDirection:"row",paddingTop:0,paddingBottom:0}}>
														<CardItem style={{paddingLeft:0, paddingRight:0 ,paddingBottom:0 ,paddingTop:0}}>
															<Left>    
																<Body>
																	<View style={{flex:1 , flexDirection:"row"}}>
																		<View style={{flex:2}}>
																			<View style={{flex:10,flexDirection:"row"}}>
																				<View style={{flex:3,paddingLeft:10}}>
																					<View style={{flex:1,}}>
																						<Text note style={{fontSize:13,fontWeight: 'bold',color:"#4b4b4b"}}>{item.name}</Text>
																					</View>
																					<View style={{flex:4,marginTop:5,flexDirection:"row",alignItems:"center",}}>
																						<Text note style={{fontSize:10,fontWeight: 'bold',color:"#b7b7b7"}}>Qty:{'  '} 
																						<Text note style={{fontSize:10,fontWeight: 'bold',color:"#ad1f2c",marginLeft:5}}>{item.count}</Text></Text>
																						<View>
																							<Button	block style={{justifyContent : "flex-start",paddingTop:0,height:20, paddingBottom:0,backgroundColor:"#ad1f2c",borderRadius:7}} 
																								onPress={() => this._removeItem(item.id)}>
																								<Text note style={{fontSize:9,fontWeight: 'bold',color:"white",marginLeft:5}}>Remove</Text>
																							</Button>
																						</View>
																					</View>
																				</View>
																			</View>
																			<View style={{flex:1,flexDirection:"row",marginTop:10,marginBottom:0,justifyContent:"center"}}>
																				<View style={{flex:1}}/>
																				
																				<View style={{flex:1}}/>
																				<View style={{flex:12,paddingLeft:10,marginBottom:0}}> 
																					
																				</View>
																			</View>
																		</View>
																		<View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
																			<Text style={{fontSize:13,fontWeight: 'bold',color:"#4b4b4b"}}>
																				{util.formatNumber((item.price*item.count))}
																			</Text>
																		</View>
																	</View>
																</Body>
															</Left>
														</CardItem>
													</View>
												</ListItem>
											</Card>	
										)	
									}
								/>
							</View>
							<View style={{borderBottomLeftRadius:7,borderBottomRightRadius:7,flexDirection:"row",
							justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>
								
								<Text style={{color:"black", fontSize:14, fontWeight:"bold"}}>Total{'  '}</Text>
								<Text style={{color:"#009d4f", fontSize:20, fontWeight:"bold"}}>{util.formatNumber(this.state.cartTotal)}</Text>
							</View>
							
							<View style={{backgroundColor:"white",marginTop:10,borderRadius:7,}}>
								
									<Form style={styles.form}>
										<Item style={[this.state.nameEmpty?styles.validationError:null]}>
											<Icon active name="person" style={{fontSize:12}}/>
											<Input
												name = "customerName" 
												placeholder="Name"
												value = {this.state.custName}
												onChangeText={customerName =>this.setState({custName:customerName})}
												style={styles.textInputStyle}
											/>
										</Item>
										<Item style={[this.state.hpEmpty?styles.validationError:null]}>
											<Icon active type="FontAwesome" style={{fontSize:12}} name="phone" />
											<Input
												keyboardType={'numeric'}
												name = "custHP"
												placeholder="Phone number"
												value = {this.state.custHP}
												onChangeText={custHP =>this.setState({custHP:custHP})}									
												style={styles.textInputStyle}
											/>
										</Item>
										<Item style={[this.state.custEmailError?styles.validationError:null]}>
											<Icon active type="FontAwesome" style={{fontSize:12}} name="envelope" />
											<Input
												name = "custEmail"
												placeholder="Email"
												value = {this.state.custEmail}
												onChangeText={custEmail =>this.setState({custEmail:custEmail})}
												style={styles.textInputStyle}
											/>
										</Item>
									</Form>
								
							</View>
							<View style={{marginTop:10,flex:1,borderRadius:7,backgroundColor :"#FFF",}}>
								
								<Input multiline={true} numberOfLine={5} name = "msg"  placeholder="Notes"
									onChangeText={msg =>this.setState({msg:msg})}
									style={[styles.multiLineInputStyle,this.state.msgEmpty?styles.error:null]}
									bordered  /> 
								
							</View>
							<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
											<Button block onPress={()=> {this._buyItems();}}
												style={{backgroundColor:"#009d4f", flex:1, margin: 15, marginTop: 10, padding:10 }}>
												<Text style={{color:"white"}}>ok</Text>
											</Button>
							</View>
						</View>
					</View>
				</ImageBackground>
			</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
		);
		}
	}
	
	const styles = StyleSheet.create(
		{
			form:{flexDirection : "column" , justifyContent:"flex-start" },
			backgroundImage: {flex: 1, width:"100%", height:"100%" },
			ViewBTN : {flex:1.5,justifyContent :"center",borderTopWidth:1,borderTopColor:"white",alignItems:"center",
			justifyContent :"center",borderRightWidth:0.5,borderRightColor:"#f0f0f1"},
			formRow : {flexDirection : "row" , justifyContent:"flex-start" , alignItems:"center", flex:1,backgroundColor:"white" },
			oldPriceText : {
				textDecorationLine: 'line-through', 
				textDecorationStyle: 'solid',
				fontFamily : "Franklin Gothic Book Regular",
				fontSize : 11,
				color: "#4c9d2f"
			},
			textInputStyle :{  borderColor: 'gray',backgroundColor :"#FFF",  flex:1 , fontSize :12 , paddingTop:5 ,},
			newPriceText :{ 
				textDecorationStyle: 'solid',
				fontFamily : "Franklin Gothic Book Regular",
				fontSize : 12,
				color: "#ec3612"
			},
			multiLineInputStyle : {height:150 ,  flex:1 , fontSize :10 , lineHeight:10 ,  marginBottom : 10 , textAlignVertical: "top"},
			validationError : {borderColor: '#d1251a' , borderBottomWidth:1},
		}
	);

	
