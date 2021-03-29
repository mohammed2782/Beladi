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
  Right,
  ListItem
} from "native-base";
import {
FlatList,
StyleSheet,
View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const styles  = StyleSheet.create( {
	container: {
		
	},
	text: {
		alignSelf: "center",
		marginBottom: 7
	},
	mb: {
		marginBottom: 10,
		flex:1,
		paddingRight:15,
		paddingLeft:10
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
		fontSize : 11,
		color : "#65675e",
		marginTop : 15,
		paddingLeft:10
	}
});

const cardImage = require("../../img/saipacars/tiba2.jpg");
class SaleItem extends Component {
  render() {
	 
    return (
		<View>
		<Left>
            <Thumbnail square size={55} source={{uri : this.props.item.itemImg}} />
        </Left>
        <Body>
			<Text>
                {this.props.item.itemName}
            </Text>
            <Text numberOfLines={1} note>
                {this.props.item.itemDesc}
            </Text>
        </Body>
        <Right>
                  <Button transparent>
                    <Text>View</Text>
                  </Button>
                </Right>   
			
		</View>
    );
  }
}

export default SaleItem;
