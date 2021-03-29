import React, { Component } from 'react';
import { View, StyleSheet , Image , FlatList } from 'react-native';
import api from '../../api/api.js';
import {
  Container,
  Header,
  Title,Badge,
  Fab,
  Button,
  IconNB,
  Left,
  Right,
  Body,
  Icon,
  Content,
  ListItem,
  CardItem,
  Card,
  Text,
  List
} from "native-base";

class CarSpecificationsTab extends Component {
	constructor (props){
		super(props);
		this.state ={
			SpecsList : null,
		}
	}
	componentWillReceiveProps(){
			
		this.setState( {SpecsList : this.props.specs} );
		
	}
	
	
  render () {
	 
	return (
	
		<Content padder style={{ marginTop: 0 }}>
			<View>
				<View style={{display:"flex",flex:1,flexDirection:"column", justifyContent:"center"}}>
					<FlatList 
						data={this.state.SpecsList}
						keyExtractor={item => item.specName}
						renderItem={({item}) =>(
							
							<View style={{flexDirection :"row-reverse",justifyContent:"flex-start",paddingTop:5}}>
								<View>
									<Text note style={{fontSize:1,flex:1}}>
											{item.specName}
									</Text>
								</View>
								<View>
									<Text  style={{fontSize:12,paddingRight:10, fontWeight:"bold",flex:1}}>
										{item.specValue}
									</Text>
								</View>
							</View>
								
							)
						}
					/>
				</View>
			</View>
		</Content>
	)
	
  }
}
const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  ListItemStyle:{marginLeft:0, backgroundColor :"#d1251a", paddingTop:0, paddingBottom:0, paddingLeft:0, paddingRight:0, marginBottom:5 },
  text: { fontSize: 9, fontFamily:"Futura Md BT Bold", color : "#FFF", marginBottom:10, marginTop:10, fontWeight: 'bold', paddingLeft:20},
});


export default CarSpecificationsTab