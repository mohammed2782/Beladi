import React, { Component } from "react";
import { Image } from "react-native";
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
  Right
} from "native-base";
import {
FlatList,
StyleSheet,
View,
} from 'react-native';

const styles  = StyleSheet.create( {
	container: {
		backgroundColor: "#FFF"
	},
	text: {
		alignSelf: "center",
		marginBottom: 7
	},
	mb: {
		height:200,
		marginRight:5,
	},
	carTitle :{
		fontFamily : "Futura Md BT Bold",
		color : "black",
		fontWeight:"bold",
		fontSize : 15,
		flex:10,
	},
	carBriefDesc:{
		fontFamily :"Franklin Gothic Book Regular",
		fontSize : 10,
		color : "#65675e",
		marginTop : 10,
		paddingLeft:5,
		marginRight:5,
	},
	oldPriceText : {
		textDecorationLine: 'line-through', 
		textDecorationStyle: 'solid',
		fontFamily : "Franklin Gothic Book Regular",
		fontSize : 10,
		color: "#4c9d2f"
	},
	newPriceText :{ 
		textDecorationStyle: 'solid',
		fontFamily : "Franklin Gothic Book Regular",
		fontSize : 11,
		color: "#ec3612"
	},
	endAtTitle :{
		fontSize:12,
		color:"black",
		paddingTop:5,
		alignSelf:"flex-start",
		fontWeight:"600",
	},
	promoCode :{
		fontSize:13,
		color:"#ec3612",
		fontWeight:"600",
		paddingTop:10,
		alignSelf:"center",
	}
});

export class PartItem extends Component {
	
	getTitle (promo){
		const  s = promo.validUntil;
		//alert (s);
		return (<View><Text style={styles.endAtTitle}>Valid unitl {promo.validUntil}</Text>
				<Text style={styles.promoCode}>Promo Code {promo.promoCode}</Text></View>);
	}
  render() {
	  console.log(this.props.promo);
	  
    return (
	
        <Card style={styles.mb,{marginLeft:5,marginRight:5}}>
			<CardItem cardBody style={{}}>
					
					<Image
						style={{
							resizeMode: "contain",
							width: undefined,
							height: 150,
							flex: 1,
														
						}}
						source={{uri:this.props.part.partImgUrl}}
					/>
				
				
            </CardItem>
            <CardItem cardBody style={{borderBottomWidth:1,borderBottomColor: '#d1251a',marginLeft:15,marginRight:15}}>
			</CardItem>
			<CardItem style={{marginRight:0,paddingLeft:0,paddingRight:0}}>
				<Left>    
					<Body >
						<View><Text style={styles.endAtTitle}>{this.props.part.partName}</Text></View>
						<Text note style={styles.carBriefDesc}>{this.props.part.desc}</Text>
					</Body>
				</Left>
				
					
				
            </CardItem>
			
		</Card>
    );
  }
}


