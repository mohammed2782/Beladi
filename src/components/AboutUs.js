import React, { Component } from "react";
import { FlatList,
StyleSheet,
View,
ImageBackground,
Image,Dimensions, ScrollView , ListView } from "react-native";
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
  Right,
  Body
} from "native-base";
import api from '../api/api.js';
import {BeladiHeaderWhiteBack} from './BeladiHeaderWhiteBack';

export class AboutUs extends Component {
	//fetchAboutUs
	constructor (props){
			super(props);
			//alert("this is const");
			this.state ={
				aboutUsList :null,
				isLoading : true,
				philoArray : [],
				objectivesArray : [],
				companyName : null,
				intro : null,
				philoSectionName : null,
				objectivesSectionName : null,
				
			}
		};
	async componentDidMount(){
			//alert("this is json1 ");
			const aboutUsJSON = await api.fetchAboutUs('EN');
			console.log(aboutUsJSON);
			this.setState({ aboutUsList : aboutUsJSON , isLoading:false });
			this.setState({companyName:aboutUsJSON.companyName});
			this.setState({objectivesSectionName : aboutUsJSON.sections[1].sectionName});
			this.setState({philoSectionName : aboutUsJSON.sections[0].sectionName});
			this.setState({intro:aboutUsJSON.intro});
			this.setState({ philoArray : aboutUsJSON.sections[0].points});
			this.setState({ objectivesArray : aboutUsJSON.sections[1].points});
			
			//console.log(this.state);
		}		
	renderRow(data,index) {
		console.log(data+"==="+index);
	  return (
		<View key={index} style={{flexDirection: 'row' , paddingLeft:10}}>
			<Text style={styles.bullet}>{'\u2022'}</Text>
			<Text style={styles.bulletText}>{data}</Text>		  
		</View>
	  );
	}
		
	render() {
		
		return (
		
		<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/Background.png')} blurRadius={0} resizeMode = "cover">
		<View style={{flex:1}}> 
			<View style={{flexDirection : "row" ,height:"10%",backgroundColor:"#004777",alignItems:"flex-start", paddingLeft:0}}>
						<View style={{flex:1, justifyContent : "center", alignItems:"center" ,paddingTop:5 }}>
							<Button	transparent onPress={() => this.props.navigation.goBack()}>
								<Image source={require("../../img/back_en.png")}  style={{ 
									flex:1,
									width: "100%",
									height: "100%",
									resizeMode: 'contain'}}/>
							</Button>
						</View>
						<View style={{flex:1,marginTop:10,paddingLeft:20,justifyContent : "flex-start", alignItems:"flex-start" ,}}>
						</View>
						<View style={{flex:2, alignSelf: "flex-end",marginRight:10, }}>
							<Image source={require('../../img/logowhite.png')}
								style={{
									flex:2,
									
									alignSelf: "flex-end",
									width: "70%",
									height: "70%",
									resizeMode: 'contain'
									}}
							/>
						</View>
							
					</View>
		<View style={{flex:9}}>
					
		<ScrollView contentContainerStyle={{flexGrow:9}}>
				<View style={{flex:1,paddingTop:10, paddingBottom:10, alignItems:"center",justifyContent:"center", alignSelf:"center" , flexDirection:"row"}}>
							<Image 
								style={{flex:1,
									width: "100%",
									height: "100%",
									resizeMode: 'contain'}} 
								source ={require('../../img/products/carmodelpoint.png')} />
							<Text style={styles.carTitle}>{this.state.companyName}</Text>
					</View>
				<View style={{flex:1}}>
					<Image 
						style={{
							}} 
							source ={require('../../img/aboutus/aboutus.png')} />
							
					<Text style = {[styles.bulletText , {padding:10 ,marginLeft:20,marginRight:20}]}>
						{this.state.intro}
					</Text>
				</View>	
				<View style={{flex:1,alignItems:"center",paddingTop:10,justifyContent:"center" ,marginLeft:35,marginRight:35}}>
					<View style={{flex:1}}>
						<Image style={{resizeMode: 'contain'}} source ={require('../../img/aboutus/car1aboutus.jpg')} />
					</View>
					<View style={{flex:1,paddingTop:10, alignItems:"center",justifyContent:"center", alignSelf:"center" , flexDirection:"row"}}>
							<Image 
								style={{flex:1,
									width: "100%",
									height: "100%",
									resizeMode: 'contain'}} 
								source ={require('../../img/products/carmodelpoint.png')} />
							<Text style={styles.carTitle}>{this.state.philoSectionName}</Text>
					</View>
					{this.state.philoArray.map((datum,index) => this.renderRow(datum,index))}
					
				</View>
				
				
				<View style={{flex:1,alignItems:"center",paddingTop:10, paddingBottom:20,justifyContent:"center" ,marginLeft:35,marginRight:35}}>
					
					<View style={{flex:1,paddingTop:10, alignItems:"center",justifyContent:"center", alignSelf:"center" , flexDirection:"row"}}>
							<Image 
								style={{flex:1,
									width: "100%",
									height: "100%",
									resizeMode: 'contain'}} 
								source ={require('../../img/products/carmodelpoint.png')} />
							<Text style={styles.carTitle}>{this.state.objectivesSectionName}</Text>
					</View>
					{this.state.objectivesArray.map((datum,index) => this.renderRow(datum,index))}
					
				</View>
				
				
		</ScrollView >
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
			},
			bulletText :{
				fontFamily : "Futura Md BT Bold",
				color : "grey",
				fontSize:12,
				flex: 1, paddingLeft: 5
			},
			bullet :{
				fontFamily : "Futura Md BT Bold",
				color : "grey",
				fontSize:12,
				
			},
			
		}
	);
