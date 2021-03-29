import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
} from 'react-native';


//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
import {BeladiHeaderWhiteMenu} from './BeladiHeaderWhiteMenu';
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
  ListItem
} from "native-base";

	export  class ShortNews_ar extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				newsList :null,
				isLoading : true,
				
			}
		};
		
		
		
		async componentWillMount(){
			//alert("this is json1 ");
			const newsListJSON = await api.fetchNewsList('ar');
			this.setState({ newsList : newsListJSON , isLoading:false });
			
			//console.log(this.state);
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
							<View style={{flex:1,flexDirection : "column" , justifyContent:"flex-end" , alignItems:"flex-start", flex:1,
								marginLeft:10, marginRight:30 , marginBottom :5}}>
								
								<View style={{flex:1,alignSelf:"flex-end"}}>
									<Text style={{fontSize:14,paddingTop:5, fontWeight:"bold" ,color:"white"}}>
										إشعارات
									</Text>	
								</View>
							</View>
						</View>
						<View style={{flex:8, marginTop:0 , marginLeft:0 , marginRight:0}}>
							{this.state.newsList && this.state.newsList.length >0 ?
								<FlatList 
									contentContainerStyle={{}}
									data={this.state.newsList}
									keyExtractor={item => item.newsid.toString()}
									renderItem={({item}) =>(
									
									<ListItem style={{flex:1,alignItems:"center",paddingTop:10,justifyContent:"center" ,
										 marginLeft:10,marginRight:10}}>
										<View style={{flex:1,flexDirection:"column" ,alignItems:"flex-start" ,}}>
											<View style={{flex:1,paddingTop:10, alignItems:"flex-start",justifyContent:"flex-start", alignSelf:"center" , flexDirection:"row-reverse"}}>
												
												<Image 
													style={{flex:1,
														width: "100%",
														height: "100%",
														resizeMode: 'contain'}} 
													source ={require('../../img/products/carmodelpoint.png')} />
												<Text style={styles.carTitle}>{item.title}</Text>
											</View>
											<View style={{flex:1,flexDirection:"column", justifyContent:"flex-start" ,alignItems:"flex-start"}}>
												<Text style={styles.bulletText}>
												{item.desc}
												</Text>
											 </View>
										</View>
									</ListItem>
									)
								}
								/>
							:
								<View style={{flex:1,justifyContent:"flex-start",paddingTop:30,alignItems:"center"}}>
									<Text style={{fontSize:18, fontWeight:"bold", color:"#004777"}}>
										لا توجد أخبار الأن
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
			carTitle :{
				fontFamily : "Futura Md BT Bold",
				color : "black",
				fontWeight:"bold",
				fontSize : 15,
				flex:10,
				flex:10,
			},
			bulletText :{
				fontFamily : "Futura Md BT Bold",
				color : "grey",
				fontSize:12,
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

	
