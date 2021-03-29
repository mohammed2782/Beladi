import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
} from 'react-native';
import CarItemList from './CarItemList';
//import OtherTab from './OtherTab';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
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
  ListItem
} from "native-base";

	export  class CarsFeed_ar extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				carsList :this.props.cars,
				isLoading:true,
			}
		}
		
		
		async componentDidMount(){
			//alert("this is json1 ");
			const carsList = await api.fetchCarList('ar');
			this.setState( (prevState) => { return {carsList , isLoading:false,} } );
		}
			
		render() {
			if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
			return (
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/Background.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
						<View style={{flexDirection : "row-reverse" ,marginTop:20, flex:1,
							paddingLeft:0}}>
							<View style={{flex:1, justifyContent : "flex-start", alignItems:"flex-end"}}>
								<Button	transparent onPress={() => this.props.navigation.goBack()}>
								<Text style={{color:"#d1251a",fontSize:15,marginRight:0}}>رجوع</Text>
									<Icon active type="FontAwesome" name="arrow-circle-right" style={{color: '#d1251a',fontSize:22}} />
										
								</Button>
							</View>
							<View style={{flex:1,marginTop:10,justifyContent : "flex-start", alignItems:"center"}}>
								<Text style = {{color:'#d1251a', fontSize:15, fontWeight:"600", fontFamily:'Futura Md BT Bold'}}>
									المنتجات
								</Text>
							</View>
							<View style={{flex:1 , justifyContent:"flex-end" }}>
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
						<View style={{flex:7, marginTop:10 , marginLeft:20 , marginRight:20}}>
							<FlatList 
								data={this.state.carsList}
								keyExtractor={item => item.carName}
								renderItem={({item}) =>(
									<ListItem
										button
										navigation ={this.props.navigation}
										onPress={() => this.props.navigation.navigate("SingleCarView",{carid : item.carId})
											}
										>
										<CarItemList car={item} navigation={this.props.navigation} />
									</ListItem>
									)	
								}
							/>
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

	
