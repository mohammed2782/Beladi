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
		marginBottom: 10,
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
		fontSize : 12,
		color : "#65675e",
		marginTop : 15,
		paddingLeft:10
	},
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
	endAtTitle :{
		fontSize:10,
		color:"grey",
		paddingTop:30,
		marginTop:10,
		alignSelf:"center",
	},
	promoCode :{
		fontSize:13,
		color:"#ec3612",
		fontWeight:"600",
		paddingTop:10,
		alignSelf:"center",
	}
});

export class PromoItem extends Component {
	
	getTitle (promo){
		const  s = promo.validUntil;
		//alert (s);
		return (<View><Text style={styles.endAtTitle}>Valid unitl {promo.validUntil}</Text>
				<Text style={styles.promoCode}>Promo Code {promo.promoCode}</Text></View>);
	}
  render() {
	  console.log(this.props.promo);
	  var title = this.props.promo.carName;
	  if (this.props.promo.partName != null)
		  title += ' - '+this.props.promo.partName;
	  
    return (
	
        <Card style={styles.mb,{marginLeft:0,marginRight:0,flex:1}}>
			<CardItem style={{paddingLeft:5}}>
				<Left>
					<Body >
					<View style={{flex:1 , flexDirection:"row"}}>
							<Image 
								style={{flex:1,
									width: "100%",
									height: "100%",
									resizeMode: 'contain'}} 
								source ={require('../../img/products/carmodelpoint.png')} />
								<Text style={styles.carTitle}>{title}</Text>
					</View>
					<View style={{flex:1 , flexDirection : 'column', paddingLeft:10}}>
						<Text style={styles.oldPriceText}>
							Original Price {this.props.promo.currency} {this.props.promo.oldPrice.toLocaleString('en')}
						</Text>
						<Text style={styles.newPriceText}>
							Now {this.props.promo.currency} {this.props.promo.newPrice.toLocaleString('en')}
						</Text>
						
					</View>
					
					</Body>
				</Left>
			</CardItem>
				<CardItem cardBody style={{borderBottomWidth:0.5,borderBottomColor: 'grey',borderTopWidth:0.5,borderTopColor: 'grey',}}>
					
					<Image
						style={{
							resizeMode: "contain",
							width: null,
							height: 220,
							flex: 1,
							
							
						}}
						source={{uri:this.props.promo.imgURL}}
					/>
				
				
            </CardItem>
            
			<CardItem>
				<Left>    
					<Body>
						{this.getTitle(this.props.promo)}
						
						<Text note style={styles.carBriefDesc}>{this.props.promo.desc}</Text>
					</Body>
				</Left>
				
					
				
            </CardItem>
			<View style={{position: 'absolute',
				top: 280,
				backgroundColor:"transparent",
				left : 0,
				right:0,
				width: "100%",
				height: 70,
				
				justifyContent: 'center',
				alignItems: 'center',
				}}>
				<Image
					style={{
						resizeMode: "contain",
						flex: 1,
						width:"50%",
						
					}}
					source={require('../../img/products/special_offer.png')}
				/>
			</View>
			
				
				<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
					<Button block onPress={() => 
						this.props.navigation.navigate("GetPromotionInfo",{promoId : this.props.promo.promoid, promoCode:this.props.promo.promoCode})}
						style={{backgroundColor:"#d1251a", flex:1, margin: 15,borderRadius: 10, marginTop: 0, padding:10 }}>
						<Text style={{color:"white"}}>Get Promotion</Text>
					</Button>
				</View>
			
		</Card>
    );
  }
}


