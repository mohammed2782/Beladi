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
	},
	carTitle :{
		fontFamily : "Futura Md BT Bold",
		color : "black",
		fontWeight:"bold",
		fontSize : 16,
		flex:10,
		
		
	},
	carBriefDesc:{
		fontFamily :"Franklin Gothic Book Regular",
		fontSize : 14,
		color : "#65675e",
		marginTop : 15,
		paddingLeft:10
	}
});

const cardImage = require("../../img/saipacars/tiba2.jpg");
class CarItemList extends Component {
  render() {
	 
    return (
	
        <Card style={styles.mb}>
			<CardItem cardBody>
				<Image
					style={{
						resizeMode: "cover",
						width: null,
						height: 200,
						flex: 1
					}}
					source={{uri:this.props.car.thumbnailUrl}}
				/>
            </CardItem>
            
			<CardItem>
				<Left>    
					<Body>
						<View style={{flex:1 , flexDirection:"row-reverse",justifyContent:"flex-start"}}>
							<Image 
								style={{flex:1,
									width: "100%",
									height: "100%",
									
									resizeMode: 'contain'}} 
								source ={require('../../img/products/carmodelpoint.png')} />
								<View style={{flex:10, alignItems:"flex-end", }}>
							<Text style={styles.carTitle}>{this.props.car.carName}</Text>
							</View>
						</View >
						<Text note style={styles.carBriefDesc}>{this.props.car.carFullDesc}</Text>
					</Body>
				</Left>
				
					
				
            </CardItem>
			<View style={{flexDirection : "row" , justifyContent:"center" , alignItems:"center", flex:1}}>
				
				<Button
				block
				style={{backgroundColor:"#d1251a", flex:1, margin: 15,borderRadius: 10, marginTop: 0, padding:10 }}
				onPress={() => this.props.navigation.navigate ("SingleCarView_ar",{carid : this.props.car.carId})}>
							<Text style={{alignItems:"center" , justifyContent:"center",fontSize:15}}>المزيد من التفاصيل</Text>
				</Button>
				
				
			</View>
		</Card>
    );
  }
}

export default CarItemList;
