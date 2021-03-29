import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
 Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PromoItem} from './PromoItem';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
import globalvalidation from './globalvalidation.js';
import {BeladiHeaderWhiteMenu} from './BeladiHeaderWhiteMenu';
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
 
} from "native-base";

	export  class Promotions_kr extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				promosList :null,
				isLoading : true,
				appUnregisterCallBackFunction : this.props.navigation.state.params.unRegCallBackFunction,
			}
		}
		
		
		async componentDidMount(){
			const isThere = await globalvalidation.checkAvailableVinIdForRegisteredCustomer();
			if (!isThere){
				await Alert.alert( '',"سڕینه‌وه‌ی تۆمار");
				this.state.appUnregisterCallBackFunction();
				this.props.navigation.navigate("Home");
				return ;
			}
			let zuid = 0;
			await AsyncStorage.getItem("zuid").then((value) => zuid = value);
			const promosListJSON = await api.fetchSpecialPromosList(zuid,'KR');
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
						<View style={{flex:2, backgroundColor:"#004777"}}> 
							<View style={{flex:1}}>
								<BeladiHeaderWhiteMenu navigation={this.props.navigation}/>
							</View>
							<View style={{flex:1,flexDirection:"row-reverse", justifyContent:"flex-end" , alignItems:"flex-start", flex:1,
								marginLeft:10, marginRight:30 , marginBottom :5}}>
								
								<View style={{flex:1, flexDirection:"row-reverse"}}>
									<Text style={{fontSize:14,paddingTop:5, fontWeight:"bold" ,color:"white"}}>
										ئۆفه‌ره‌ تایبه‌ته‌کان
									</Text>	
								</View>
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
										ئۆفه‌ر له‌به‌ر ده‌ست نیه‌ ئێستا
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

	
