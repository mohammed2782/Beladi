import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
} from 'react-native';

import {PromoItem} from './PromoItem';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
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
  ListItem
} from "native-base";

	export  class Offers extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				promosList :null,
				isLoading : true,
			}
		}
		
		
		async componentDidMount(){
			//alert("this is json1 ");
			const promosListJSON = await api.fetchPromosList('en');
			this.setState({ promosList : promosListJSON , isLoading:false });
			
			console.log(this.state);
		}
			
		render() {
			if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			
			
			return (
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/Background.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
						<View style={{flexDirection : "row" ,marginTop:20, flex:1,
							paddingLeft:0}}>
							<View style={{flex:1, justifyContent : "flex-start", alignItems:"center"}}>
								<Button	transparent onPress={() => this.props.navigation.openDrawer()}>
									<Image source={require("../../img/inner/burgerred.png")}  style={{ 
										flex:1,
										width: "100%",
										height: "100%",
										resizeMode: 'contain'}}/>
								</Button>
							</View>
							<View style={{flex:3,marginTop:10,justifyContent : "flex-start", alignItems:"center"}}>
								<Text style = {{color:'#d1251a', fontSize:14, fontWeight:"600", fontFamily:'Futura Md BT Bold'}}>
									Offers
								</Text>
							</View>
							<View style={{flex:2 , justifyContent:"flex-end" }}>
								<Image source={require('../../img/inner/logo.png')}
									style={{
										flex:1,
										width: "100%",
										height: "100%",
										resizeMode: 'contain'
										}}
								/>
							</View>
								
						</View>
						
						
							<View style={{flex:8, marginTop:0 , marginLeft:10 , marginRight:10}}>
							{this.state.promosList && this.state.promosList.length >0 ?
								<FlatList 
									data={this.state.promosList}
									keyExtractor={item => item.promoid.toString()}
									renderItem={({item}) =>(
										<ListItem
											
										>
											<PromoItem promo={item} navigation={this.props.navigation} />
										</ListItem>
										)	
									}
								/>
							
							:
								<View>
									<Text>
										No Offers Now
									</Text>
								</View>
							}
							</View>
						
						
					</View>
				</ImageBackground>
					
				);
		}
	}
	
	const styles = StyleSheet.create(
		{
			backgroundImage: {flex: 1, width:undefined, height:undefined },
			
		}
	);

	
