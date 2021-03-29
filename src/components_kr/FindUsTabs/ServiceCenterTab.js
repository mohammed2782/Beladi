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
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from '@react-native-community/geolocation';
class ShowRoomTab extends Component {
	constructor (props){
		super(props);
		//alert("this is const");
		this.state ={
			showRoomsList : null,
			UserLocationOff : true,
			showMap : false,
			markersList:null,
			locationServices : false,
			loading : true,
		}
	}
	
	
	async componentDidMount(){
			this._findUserPosition();
			const showRooms = await api.fetchServiceCentersListBeladi('KR');
			//alert("this is json2 "+showRooms[0].locationDtls);
			this.setState( {showRoomsList : showRooms} );
			console.log(this.state);
			const markers = this.state.showRoomsList.map( (item) =>{
				return {
					latlng :{
						latitude:item.lat,
						longitude:item.longt
					},
					title :item.locationHeader,
					id : item.id
				};
			});
			this.setState({markersList:markers});
			
			this.setState({loading:false});
	}
	
	loadMap(){
		//if (this.state.locationServices && this.state.markersList!=null){
			
			this.props.navigation.navigate("viewmap" , {markers:this.state.markersList});
	  //}
		
	}
	_openLocationSettings = () => {
		let self = this;
		LocationServicesDialogBox.checkLocationServicesIsEnabled({
			message: "<h2>بكارهيَنياني ناونيشان؟</h2>ئه‌م ئپڵکێشنه‌ ده‌یه‌وێت چاک کردنی ئامێره‌که‌ت بگۆڕێت:<br/><br/> به‌کارهێنانی GPS و WIFI و توڕی مۆبایل بۆ ناونیشان<br/>",
			ok: "بةلَىَ",
			cancel: "نةخيَر"
		}).then(function(success) {
			self._findUserPosition();
			self.setState({
				locationServices: true
			});
		}).catch((error) => {
			console.log(error.message); // error.message => "disabled"
		});
	}
	
	_enableTheButton = () => {
		this.setState({
			buttonDisable: false,
			buttonTitle: 'Add my location',
			locationServices: true
		});
	}
	
	_findUserPosition = (e) => {
		Geolocation.getCurrentPosition(
		  (position) => {
			this._enableTheButton();
			this.setState({
			  locationServices: true
			});
		  },
		  (error) => {
			console.log('inside error', error);
			this.setState({
			  locationServices: false
			});
		  },
		  {enableHighAccuracy :false,timeout: 2000, maximumAge: 1000}
		);
	}
	
  render () {
	
	  if (this.state.loading )
				return (<View><Image source={require('../../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
		
	  if (this.state.showRoomsList!=null)
		console.log("fetching");//alert("this is after "+this.state.showRoomsList[0].locationDtls);
	return (
	
	<Content padder style={{ marginTop: 0 }}>
		<View style={{flex:1}}>
			<View style={{flexDirection :"row-reverse",flex:1,alignItems:"center",justifyContent:"center", paddingBottom:10, }}>
				<View style={{flex:1,alignItems:"center",justifyContent:"center", }}>
						<Image source = {require('../../../img/aftersales/svcnear_en.png')} 
						 style={{flex: 1,
							width: 150,
							height: 90,
							resizeMode: 'contain'}}>
						</Image>
					
				</View>
				<View style={{display:"flex",paddingLeft:10,flex:1,flexDirection:"column", justifyContent:"center",alignItems:"center",paddingTop:10}}>
					<Button
						style = {{backgroundColor:"#AD1F2D",borderRadius:7}}
						onPress={()=> {this.state.locationServices?this.loadMap():this._openLocationSettings();}}
						>
						
							<Text style={styles.text}>
								ناونيشانمان لةسةر نةخشة
							</Text>
						
						
					</Button>
				</View>
			</View>
		
			<View style={{display:"flex",flex:4,flexDirection:"column", justifyContent:"center"}}>
			<FlatList 
				data={this.state.showRoomsList}
				keyExtractor={item => item.id}
				renderItem={({item}) =>(
						
							<Card style={{ flex: 0 ,paddingLeft:0 , }}>
							  <CardItem style={{paddingLeft:0,paddingRight:10}}>
								<Body >
									<View style={{flexDirection :"row-reverse",alignItems:"center",}}>
										<View style={{justifyContent:"flex-start", paddingRight:30,paddingLeft:15}}>
										<Image source = {require('../../../img/aftersales/location.png')}
										 style ={{flex:1 , width: 35,
												height: 35,resizeMode: 'contain', }}>
										</Image>
										</View>
										<View style={{flex:3}}>
											<Text style={{fontSize:12, fontWeight:"bold"}}>
												{item.locationHeader}
											</Text>
											<Text note style={{fontSize:11}}>
												{item.locationDtls}
											</Text>
										</View>
									</View>
								</Body>
							  </CardItem>
							</Card>
						)
						
					}
				
					/>
			</View>
		</View>
      </Content>
	  
		
	)
	  
    /*return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        ></MapView>
      </View>
    )*/   
  }
}
const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  ListItemStyle:{marginLeft:0, backgroundColor :"#d1251a", paddingTop:0, paddingBottom:0, paddingLeft:0, paddingRight:0, marginBottom:5 },
  text: { fontSize:13, fontFamily:"Futura Md BT Bold", color : "#FFF", marginBottom:10, marginTop:10, fontWeight: 'bold', paddingLeft:20},
});

/* ShowRoomTab.defaultProps = {
		showRoomsList: [
			{
				 
				locationHeader: "BELADI SERVICE CENTER",
				locationDtls: 1,
				
			},
			{
				 
				locationHeader: "BELADI SERVICE CENTER",
				locationDtls: "52nd street near karrada court",
			},
			{
				 
				locationHeader: "BELADI SERVICE CENTER",
				locationDtls: "52nd street near karrada court",
			},
		]
	}; */
export default ShowRoomTab