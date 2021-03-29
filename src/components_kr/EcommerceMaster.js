import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image
} from 'react-native';

//import OtherTab from './OtherTab';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
import AsyncStorage from '@react-native-community/async-storage';
import util from '../util.js';
import {SocialMediaShare} from './SocialMediaShare';
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
  ActionSheet,
  Root,
  Card,
  Thumbnail,
  CardItem,
  Badge
} from "native-base";
//import SearchableDropdown from 'react-native-searchable-dropdown';

	export  class EcommerceMaster_kr extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				itemsList :this.props.cars,
				isLoading:true,
				brand :"نێشانەى بازرگانى",
				system : "الصنف",
				year : "Year",
				model:"الموديل",
				brandFilter : null,
				yearFilter : null,
				systemFilter : null,
				modelFilter:null,
				isCartEmpty : true,
				cart : null,
				itemsInCart :0,
				cartColorCode : "#D7D7D7",
				modelDisabled:true,
			}
		}
		_lookupModelFiler (choice){
			if (choice == 'CNCL'){
				this.setState({modelDisabled:true});
			}else{
				this.setState({modelFilter:null});
				const brandFilter = this.state.brandFilter;
				var modelFilterF = null;
				for (i=0; i < brandFilter.length; i++){
					if (choice == brandFilter[i].code){
						modelFilterF = [...brandFilter[i].innerFilter.singleFilter];//clone the array ES6
						break;
					}
				}
				modelFilterF.push({"text":"Cancel","code":"CNCL"});
				if (modelFilterF.length>0)
					this.setState({modelDisabled:false});
				else
					this.setState({modelDisabled:true});
				this.setState({modelFilter:modelFilterF,model:"Model", modelChoice:null});
				
			}
		}
		_emptyAllCart = async () =>{
			try{
				this.setState({cart:null, itemsInCart:0, isCartEmpty:true, cartColorCode :"#D7D7D7",});
				await AsyncStorage.removeItem("cartList");
			}catch(error){
				console.log(error);
			}
		}
		_deleteFromCart = async(id)=>{ 
				var newCart = this.state.cart;
				var totItems = 0;
				for (i = 0 ; i<newCart.length; i++){
					if (newCart[i].id === id){
						newCart.splice (i,1);
						break;
					}
				}
				console.log("called");
				for (i = 0; i<newCart.length;i++){
					totItems +=newCart[i].count;
				}
				if (totItems>0)
					this.setState({cart:newCart, itemsInCart:totItems, isCartEmpty:false, cartColorCode :"#5cb85c",});
				else
					this.setState({cart:newCart, itemsInCart:totItems, isCartEmpty:true, cartColorCode :"#D7D7D7",});
				
				await AsyncStorage.setItem("cartList", JSON.stringify(newCart));
				return newCart;
			}
		
		async _decrementItemFromCart (id){
		}
		
		async _incrementItemInCart (id){
		}
		async _addToCart(itemid, price, name){
			// cart is an array of the following foramt [{id:1, count:2},{id:5,count:1}, {...}]
//alert(itemid);
			try{
				var cart =[];
				cart = JSON.parse(await AsyncStorage.getItem("cartList"));
				//alert(cart);
				var count = 0;
				let index = 0;
				var found = false;
				if (cart !==null && cart !==undefined && cart.length>0){
					index = cart.length;
					for (i = 0; i<cart.length;i++){
						if (itemid ==cart[i].id){
							index = i;
							found = true;
							break;
						}
					}
					if (found)
						count = cart[index].count;
				}else{
					cart = [];
				}
				count +=1;
				cart[index] = {"id":itemid, "price":price, "name":name, "count":count};
				console.log(cart);
				var totItems =0;
				for (i = 0; i<cart.length;i++){
					totItems +=cart[i].count;
				}
				this.setState({"cart":cart, itemsInCart:totItems, isCartEmpty:false, cartColorCode :"#5cb85c",});
				await AsyncStorage.setItem("cartList", JSON.stringify(cart));
			}catch(error){
				alert (error);
				console.log(error);
			}
		}
		
		async _doSearch(){
		
			const year = this.state.yearChoice;
			const brand = this.state.brandChoice;
			const system = this.state.systemChoice;
			const model  = this.state.modelChoice;
			this.setState({isLoading:true});
		
			try{
				// fetchEcommereceList (lang, brand, model, system, year)
				const itemsList = await api.fetchEcommereceList('KR', brand, model , system, year);
				
				if (itemsList.errorMessage!==null && itemsList.errorMessage!==undefined)
					alert(itemsList.errorMessage);
				else{
					this.setState( (prevState) => { return {itemsList} } );
				}
			}catch(error){
				console.log(error);
			}
			this.setState({isLoading:false});
		}
		
		async componentDidMount(){
			//alert("this is json1 ");
			const itemsList = await api.fetchEcommereceList('KR','','','','');
			const filters = await api.fetchEcommerceFiltersList('KR');
			this.setState( (prevState) => { return {itemsList ,filters, isLoading:false,} } );
			//console.log(this.state.filters);
			var brandFilter = this.state.filters[0].singleFilter;
			brandFilter.push({"text":"إلغاء","code":"CNCL"});
			this.setState({brandFilter:brandFilter});
			
			var yearFilter = this.state.filters[2].singleFilter;
			yearFilter.push({"text":"إلغاء","code":"CNCL"});
			this.setState({yearFilter:yearFilter});
			
			var systemFilter = this.state.filters[1].singleFilter;
			systemFilter.push({"text":"إلغاء","code":"CNCL"});
			this.setState({systemFilter:systemFilter});
			
			var totItems =0;
			var cartInStore = await this._getCartInStore();
			if (cartInStore !==null && cartInStore !==undefined && cartInStore.length>0){
					for (i = 0; i<cartInStore.length;i++){
						totItems +=cartInStore[i].count;
					}
			}
			if (totItems >0 )
				this.setState({cart:cartInStore, itemsInCart:totItems, isCartEmpty:false, cartColorCode :"#5cb85c",});
		}	
		
		// Get total purchased items in cart
		async  _getCartInStore(){
			var cart =[];
			try{
				cart = JSON.parse(await AsyncStorage.getItem("cartList"));
			}catch(error){
				console.log(error);
			}
			return cart;
		}
			
		render() {
			if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			return (
			<Root>
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/bg.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
						<View style={{flex:3, backgroundColor :"#004777", paddingLeft:0,borderBottomLeftRadius:30}}>
							<View style={{flexDirection : "row-reverse",paddingTop:10, flex:1}}>
								<View style={{flex:1, justifyContent : "flex-start", alignItems:"flex-start",}}>
									<Button	transparent style={{justifyContent : "flex-start"}} onPress={() => this.props.navigation.goBack()}>
										<Image source={require("../../img/back_ar.png")}  style={{ 
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
							<View style={{flexDirection:"row-reverse",flex:1.5, alignItems:"center"}}>
								<View style={{flex:2}}>
									<Text style={{color:"white", fontSize:12, paddingRight:20}}>قطع غيار</Text>
								</View>
								
								<View  style={{flex:1,paddingLeft:30}}>
									<Button transparent onPress={this.state.itemsInCart?
											() => this.props.navigation.navigate("EcommerceCart_kr",
																				 {cart:this.state.cart,
																				  DeleteFromCartCallBackMethod: this._deleteFromCart,
																				  emptyAllCart : this._emptyAllCart}):null}>
										<Badge   style={{backgroundColor:this.state.cartColorCode, position: 'absolute',height:22,width:22,borderRadius:10,
											paddingLeft:0,paddingRight:0,paddingBottom:5}}>
											<Text style={{fontSize:8,paddingLeft:0,paddingRight:0,marginBottom:10 }}>{this.state.itemsInCart}</Text>
										</Badge>
										<Icon style={{color:this.state.cartColorCode,fontSize:35,marginBottom:5}} type="FontAwesome" active name="cart-arrow-down" />
										
									</Button>
								</View>
									
							</View>
							<View style={{flexDirection:"row-reverse", alignItems:"flex-end",flex:1}}>
								<View style={styles.ViewBTN}>
									<Button transparent style ={{alignSelf:"center"}}
										onPress={() =>	
											ActionSheet.show({
													options: this.state.brandFilter,
													cancelButtonIndex: this.state.brandFilter.length-1,
													destructiveButtonIndex: this.state.brandFilter.length-1,
													title: "أختر النوع"
												},
												buttonIndex => {
													if (this.state.brandFilter[buttonIndex].code =='CNCL'){
														this.setState({brand:"نێشانەى بازرگانى", brandChoice:null});
														this.setState({model:"الموديل", modelChoice:null});
													}else{
														this.setState({ brandChoice: this.state.brandFilter[buttonIndex].code , brand : this.state.brandFilter[buttonIndex].text });
													}
													this._lookupModelFiler(this.state.brandFilter[buttonIndex].code);
												}
											)
										}
									>
										
										<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
										<Text style={{color:"white",fontSize:9, paddingLeft:0,paddingRight:0}}>{this.state.brand}</Text>
									</Button>
								</View>
								<View style={{justifyContent :"center",borderTopWidth:1,borderTopColor:"white",alignItems:"center",
								justifyContent :"center",borderLeftWidth:0.5,borderLeftColor:"#f0f0f1",
								flex:1}}>
									<Button transparent disabled={this.state.modelDisabled}  
												style ={[this.state.modelDisabled?styles.disabled:null,{alignSelf:"center"}]}
													onPress={() =>	
															ActionSheet.show({
																options: this.state.modelFilter,
																cancelButtonIndex: this.state.modelFilter.length-1,
																destructiveButtonIndex: this.state.modelFilter.length-1,
																title: "أختر الموديل"
															},
															buttonIndex => {
																if (this.state.modelFilter[buttonIndex].code =='CNCL'){
																	this.setState({model:"الموديل", modelChoice:null});
																}else{
																	this.setState({ modelChoice: this.state.modelFilter[buttonIndex].code , model : this.state.modelFilter[buttonIndex].text });
																}
															}
														)
													}
												>
												<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
												<Text style={{color:"white",fontSize:10, paddingLeft:0,paddingRight:0,marginRight:0,marginLeft:5}}>{this.state.model}</Text>
													
												</Button>
								</View>
								<View style={[styles.ViewBTN,{flex:2}]}>
								<Button transparent iconRight style ={{alignSelf:"center"}}
										onPress={() =>	ActionSheet.show({
														options: this.state.systemFilter,
														cancelButtonIndex: this.state.systemFilter.length-1,
														destructiveButtonIndex: this.state.systemFilter.length-1,
														title: "أختر الصنف"
													},
													buttonIndex => {
														if (this.state.systemFilter[buttonIndex].code =='CNCL'){
															this.setState({system:"الصنف", systemChoice:null});
														}else{
															this.setState({ systemChoice: this.state.systemFilter[buttonIndex].code , 
																system : this.state.systemFilter[buttonIndex].text });
														}
													}
												)
											}
									>
										
										<Icon style={{color:"white",fontSize:13,marginLeft:5,marginRight:5}} type="FontAwesome" active name="angle-down" />
										<Text style={{color:"white",fontSize:9, paddingLeft:0,paddingRight:0}}>{this.state.system}</Text>
									</Button>
									
								</View>
								<View  style={{flex:0.7,justifyContent:"flex-end", alignItems:"flex-end"}}>
									<Button  info iconLeft transparent onPress={()=>this._doSearch()} style={{borderColor:"white"}}>
										<Icon style={{color:"white",}} active name="search" />
									</Button>
								</View>
							</View>
						</View>
						
						<View style={{flex:11, marginTop:10 , marginLeft:10 , marginRight:10}}>
							<FlatList 
								data={this.state.itemsList}
								style={{flex:1}}
								keyExtractor={item => item.itemId}
								renderItem={({item}) =>(
										<Card style={{paddingTop:4,paddingBottom:4,marginTop:0, marginBottom:10,flex:1}}>
											<ListItem style={{flex:1,flexGrow:1,  paddingRight:0,marginLeft:0,paddingLeft:0,backgroundColor:"red", marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0,borderBottomWidth:0}}>
												<View style={{flex:1,flexDirection:"row-reverse",paddingTop:0,paddingBottom:0}}>
													<CardItem style={{paddingLeft:5, paddingRight:5 ,paddingBottom:5 ,paddingTop:5}}>
														<Left>    
															<Body>
																<View style={{flex:1 , flexDirection:"row-reverse"}}>
																	<View style={{flex:1,marginTop:10}}>
																		<Thumbnail square large  source={{uri : item.itemImg}} />
																	</View>
																	<View style={{flex:3}}>
																		<View style={{flex:10,flexDirection:"row-reverse"}}>
																			<View style={{flex:3,paddingLeft:10}}>
																				<View style={{flex:1,}}>
																					<Text note style={{fontSize:12,color:"black"}}>{item.itemName}</Text>
																				</View>
																				<View style={{flex:6}}>
																					<Text note style={{fontSize:10}}>{item.itemDesc}</Text>
																				</View>
																			</View>
																		</View>
																		<View style={{flex:1,flexDirection:"row-reverse",marginTop:10,marginBottom:0,justifyContent:"center"}}>
																			<View style={{flex:1}}/>
																			<Button iconLeft onPress={()=>this._addToCart(item.itemId,item.itemPrice,item.itemName)} style={{height:35,flex:12,marginTop:5,paddingTop:0,paddingBottom:0, backgroundColor:"#AD1F2D",
																			alignItems:"center",justifyContent:"center", borderRadius:5,}}>
																				<Text style={{color:"white",fontSize:11,marginLeft:0,paddingLeft:0,paddingRight:0}}>أضف للسله</Text>
																				<Icon style={{color:"white",fontSize:17,marginLeft:5,marginRight:0}} type="FontAwesome" active name="cart-arrow-down" />
																				
																			</Button>
																			<View style={{flex:1}}/>
																			<View style={{flex:12,paddingLeft:10,marginBottom:0}}> 
																				<Text style={styles.oldPriceText}>
																					السعر القديم {util.formatNumber(item.itemOldPrice)}
																				</Text>
																				<Text style={styles.newPriceText}>
																					الأن {util.formatNumber(item.itemPrice)}
																				</Text>
																				
																			</View>
																		</View>
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
					</View>
				</ImageBackground>
				</Root>
				);
		}
	}
	
	const styles = StyleSheet.create(
		{
			backgroundImage: {flex: 1, width:"100%", height:"100%" },
			ViewBTN : {flex:1.5,justifyContent :"center",borderTopWidth:1,borderTopColor:"white",alignItems:"center",justifyContent :"center",borderLeftWidth:0.5,borderLeftColor:"#f0f0f1"},
			oldPriceText : {
				textDecorationLine: 'line-through', 
				textDecorationStyle: 'solid',
				fontFamily : "Franklin Gothic Book Regular",
				fontSize : 11,
				color: "#4c9d2f"
			},
			newPriceText :{ 
				textDecorationStyle: 'solid',
				fontFamily : "Franklin Gothic Book Regular",
				fontSize : 12,
				color: "#ec3612"
	},
		}
	);

	
