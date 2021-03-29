import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
FlatList,
StyleSheet,
View,
ImageBackground,
Image,
ScrollView,
KeyboardAvoidingView 
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import api from '../../api/api.js';
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
  Form,
  Label,
  Input
} from "native-base";

export  class AdviceTable extends   Component <{}>{
	constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				adviceList :null,
				isLoading : true,
				rangeId : this.props.navigation.state.params.rangeId,
				startRange : this.props.navigation.state.params.startRange,
				endRange :this.props.navigation.state.params.endRange,
			}
	}
		async componentDidMount(){
			alert(this.state.rangeId);
			const adviceListJSON = await api.fetchAdviceList(this.state.rangeId, 'EN');
			this.setState({ adviceList : adviceListJSON , isLoading:false });
			
			console.log(this.state);
	}
    renderRow(data) {
		/*<Image
						style={{
							resizeMode: "contain",
							width: 50,
							height: 50,
							flex: 1,
														
						}}
						source={{uri:data.imgurl}}
					/>*/
		return (
			<View style={{ flexDirection: 'row' ,borderBottomWidth:0.5, borderRadius:3,borderColor: 'grey',}}>
				<View style={{flex:1, padding:10, borderRightWidth:0.5,borderColor: 'grey' }} >
					
					<Text style={styles.title}>
						{data.title}
					</Text>
				</View>
				<View style={{ padding:10, flexDirection:'row', flex: 3, flexWrap: 'wrap'}}>
					<Text style={styles.briefDesc}>
						{data.msg}
					</Text>
				</View>
				
			</View>
		);
		
    }

    render() {
        if (this.state.isLoading)
				return (<View><Image source={require('../../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
        return (
			<ImageBackground style={styles.backgroundImage}
					 source={require('../../../img/Background.png')} blurRadius={0} resizeMode = "cover">
				<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
					<View style={{flexDirection : "row" , backgroundColor:"#004777",paddingTop:10,height:"12%",alignItems:"flex-start", paddingLeft:0}}>
						<View style={{flex:1, justifyContent : "flex-start", alignItems:"flex-start" , }}>
							<Button	transparent onPress={() => this.props.navigation.goBack()}>
								<Image source={require("../../../img/back_en.png")}  style={{ 
									flex:1,
									width: "100%",
									height: "100%",
									resizeMode: 'contain'}}/>
							</Button>
						</View>
						<View style={{flex:1,marginTop:10,paddingLeft:20,justifyContent : "flex-start", alignItems:"flex-start" ,}}>
						</View>
						<View style={{flex:1, alignSelf: "flex-end",marginLeft:10, }}>
							<Image source={require('../../../img/logowhite.png')}
								style={{
									flex:2,
									
									alignSelf: "flex-end",
									width: "100%",
									height: "100%",
									resizeMode: 'contain'
									}}
							/>
						</View>
							
					</View>
					<View style={{ justifyContent : "flex-start", alignItems:"flex-start" ,marginLeft:20 , marginTop:20}}>
						<Text style = {{color:'#004777', fontSize:13, fontWeight:"500", fontFamily:'Futura Md BT Bold'}}>
								 Recommendations {this.state.startRange} - {this.state.endRange} km
							</Text>
					</View>
					<ScrollView style={{ marginBottom:0, backgroundColor:"white" , marginLeft:20 , marginRight:20 , marginTop:20}}>
						<FlatList 
							data={this.state.adviceList}
							contentContainerStyle={{alignSelf: "stretch" , justifyContent:"flex-start"}}
							style ={{ borderWidth:1 , borderRadius:7,borderColor: 'grey', }}
							keyExtractor={item => item.msgid.toString()}
							renderItem={({item}) =>(
								this.renderRow(item)
								)	
							}
						/>
					</ScrollView>
				</View>
				</ImageBackground>
        );
    }
}
const styles = StyleSheet.create(
		{
			backgroundImage: {flex: 1, width:undefined, height:undefined },
			briefDesc:{
				fontFamily :"Franklin Gothic Book Regular",
				fontSize : 12,
				color : "#65675e",
				marginTop : 10,
				paddingLeft:5,
				marginRight:5,
				flexWrap: "wrap",
				flex:1,
			},
			title:{
				fontFamily :"Franklin Gothic Book Regular",
				fontSize : 13,
				color : "#65675e",
				marginTop : 10,
				paddingLeft:5,
				marginRight:5,
				flexWrap: "wrap",
				fontWeight:"500",
				flex:1,
			},
			
		}
	);