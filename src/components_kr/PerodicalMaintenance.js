import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
AsyncStorage
} from 'react-native';


//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
import globalvalidation from './globalvalidation.js';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Thumbnail,
  Left,
  Body,
  Right,
  ListItem,
} from "native-base";

	export  class PerodicalMaintenance_kr extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				rangesList :null,
				isLoading : true,
				appUnregisterCallBackFunction : this.props.navigation.state.params.unRegCallBackFunction,
				
			}
		};
		
		
		
		async componentWillMount(){
			const isThere = await globalvalidation.checkAvailableVinIdForRegisteredCustomer();
			if (!isThere){
				await Alert.alert("","سڕینه‌وه‌ی تۆمار");
				this.state.appUnregisterCallBackFunction();
				this.props.navigation.navigate("Home");
				return ;
			}
			const zuidInPhone = await AsyncStorage.getItem("zuid");
			this.setState({zuid : zuidInPhone});
			const rangesListJSON = await api.fetchPerodicalRangesListBeladi('kr', zuidInPhone);
			this.setState({ rangesList : rangesListJSON , isLoading:false });
			
			//console.log(this.state);
		}			
		render() {
			
			if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			
			return (
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/contactusbg.png')} blurRadius={0} resizeMode = "cover">
						<View style={{flexDirection:"column" , flex:1,flex:1, backgroundColor:"#004777" , justifyContent:"flex-start"}}>
							<View style={{flexDirection : "row-reverse" ,marginTop:20, flex:1,paddingLeft:0}}>
								<View style={{flex:1}}/>
								<View style={{flex:1, justifyContent : "flex-start", alignItems:"center"}}>
									<Button	transparent onPress={() => this.props.navigation.openDrawer()}>
										<Image source={require("../../img/BurgerMenuArWhite.png")}  style={{ 
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
							<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1,
									marginLeft:30, marginRight:30 , marginBottom :5}}>
								<Text style={{ fontSize:15, fontWeight:"bold" ,color:"white"}}>
									 چاککردنه‌وه‌ی به‌رده‌وام
								</Text>							
							</View>
						</View>
							<View style={{flex:8, marginTop:10 , marginLeft:0 , marginRight:0}}>
							
								<FlatList 
									contentContainerStyle={{}}
									data={this.state.rangesList}
									keyExtractor={item => item.rangeId.toString()}
									renderItem={({item}) =>(
									
									<Card style={styles.mb,{marginLeft:0,marginRight:0}}>
										<CardItem cardBody style={{borderBottomWidth:0.5,borderBottomColor: 'grey',
										 }}>
										
											<View style={{flex:1, alignItems:"center",backgroundColor:"#FAFAFA",justifyContent:"center", alignSelf:"center" , flexDirection:"row-reverse"}}>
												<View style={{flex: 1, backgroundColor:"#FAFAFA", margin:0,padding:0 }}>
												<Thumbnail square large source={{uri:item.imgUrl}} style={{backgroundColor:"white",flex:1,display: "flex"}} />
												</View>
												<View style={{ flex: 3, alignItems: "flex-start"  , margin:0,padding:0 }}>
													<Button 
													block
														 onPress={() => 
														this.props.navigation.navigate("AdviceTable_kr",{rangeId : item.rangeId, startRange:item.startRange, endRange:item.endRange})}
														style={{backgroundColor:"#FAFAFA",justifyContent:"center",alignItems: "center", flex:1, margin:0}}>
														
						
														
														<Text style={styles.carTitle}>له‌ {item.startRange} تاكو {item.endRange} كيلومتر</Text>
													
													</Button>
												
												</View>
											</View>
										</CardItem>
									</Card>
									)
								}
								/>
							
					
							</View>
				</ImageBackground>
					
				);
		}
	}
	
	
		const styles = StyleSheet.create(
		{
			backgroundImage: {flex: 1, width:undefined, height:undefined },
			carTitle :{
				fontFamily : "Futura Md BT Bold",
				color : "black",
				fontSize : 13,		
				paddingLeft:0,
				
			},
			bulletText :{
				fontFamily : "Futura Md BT Bold",
				color : "grey",
				fontSize:9,
				flex: 1, paddingLeft: 15,
				marginBottom:10,
				marginTop:10,
			},
			bullet :{
				fontFamily : "Futura Md BT Bold",
				color : "grey",
				fontSize:12,
				
			},
			
		}

	);

	
