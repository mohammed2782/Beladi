import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
} from 'react-native';

import {PartItem} from './PartItem';
//import * as globalStyles from '../styles/global';
import api from '../api/api.js';
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

	export  class Parts_ar extends Component <{}> {
		constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				partsList :null,
				isLoading : true,
				
			}
		};
		
		
		
		async componentWillMount(){
			//alert("this is json1 ");
			const partsListJSON = await api.fetchPartsList('ar');
			this.setState({ partsList : partsListJSON , isLoading:false });
			
			//console.log(this.state);
		}
		
		
		_renderItem = ({ section, index }) => {
			
			const arrayLength = this.state.partsList.length;
			
			const numColumns = 2;
			//console.log(section);
			if (index % numColumns !== 0) return null;
			
			
			const items = [];
			//alert('after index=>'+index);
			for (let i = index; i < index + numColumns; i++) {
				
			  if (i < arrayLength){
				items.push(<PartItem key={this.state.partsList[i].partid} part={this.state.partsList[i]} />);
			  }
			}
			return (
			
				 <ListItem>
					 <View style={{flex:1,flexDirection:"row-reverse", justifyContent:"flex-start" ,}}>
					 {items}
					 </View>
				 </ListItem>
		
			);
			
		};
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
							<View style={{flex:1, justifyContent : "flex-start", alignItems:"flex-start"}}>
								<Button	transparent onPress={() => this.props.navigation.goBack()}>
									<View style={{alignItems:"flex-end"}}>
										<Text style={{color:"#d1251a",fontSize:15,marginRight:0,}}>رجوع</Text>
									</View>
									<Icon active type="FontAwesome" name="arrow-circle-right" style={{color: '#d1251a',fontSize:22}} />
								</Button>
							</View>
							<View style={{flex:1,marginTop:10,justifyContent : "flex-start", alignItems:"center"}}>
								<Text style = {{color:'#d1251a', fontSize:15, fontWeight:"600", fontFamily:'Futura Md BT Bold'}}>
									قطع الغيار
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
						<View style={{flex:8, marginTop:0 , marginLeft:0 , marginRight:0}}>
							
								<FlatList 
									contentContainerStyle={{}}
									data={this.state.partsList}
									keyExtractor={item => item.partid.toString()}
									renderItem={this._renderItem}
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

	
