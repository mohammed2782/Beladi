import React, { Component } from 'react';
import { View, StyleSheet , Image , FlatList ,Text,Platform } from 'react-native';
import MapView,{Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

export  class viewmap extends Component <{}> {
	constructor (props){
		super(props);
		this.state ={
			lati:0,
			longt: 0,
			UserLocationOff : true,
			
			islocationloaded : false,
			loading:true,
			markers : this.props.navigation.state.params.markers,
		}
	}
	
	componentDidMount() {
		//alert("in component will mount");
		navigator.geolocation.getCurrentPosition(
			(position) => {
				//console.log("wokeeey");
				//console.log(position);
				this.setState({
					lati: position.coords.latitude,
					longt: position.coords.longitude,
					error: null,
					UserLocationOff : false,
					loading:false,
					islocationloaded : true,
				});
				
			},
			(error) => {
				//console.log(error);
				//alert("soe the error code is ===>"+error.code);
				if (error.code==2){
					this.setState({UserLocationOff : true});
					this._openLocationSettings();
				}
				if (error.code===3){
					//alert("inside did mount of view map error code 3->");
					this._findUserPosition();
				}
				this.setState({loading:false, islocationloaded : false});
				
			},
			{enableHighAccuracy :false, timeout: 10000, maximumAge: 5000 }
		);
		console.log(this.state);
		
		
   }
   
	_openLocationSettings = () => {
		let self = this;
		LocationServicesDialogBox.checkLocationServicesIsEnabled({
			message: "<h2>أستخدم تحديد المواقع؟</h2>هذا التطبيق يحتاج الي تغيير إعدادات الجهاز:<br/><br/>هل ترغب بالسماح بإستخدام خدمة GPS لتحديد موقعك؟<br/>",
			ok: "نعم",
			cancel: "لا"
		}).then(function(success) {
			console.log("enabled the location");
			self._findUserPosition();
			self.setState({
			  UserLocationOff: true
			});
		}).catch((error) => {
			console.log(error.message); // error.message => "disabled"
		});
	}
  
    _findUserPosition = (e) => {
		//alert("calling find user posiotion");
		navigator.geolocation.getCurrentPosition(
			(position) => {
				
				this.setState({
					lati: position.coords.latitude,
					longt: position.coords.longitude,
					UserLocationOff : false,
					islocationloaded : true,
				});
			},
			(error) => {
				console.log('inside error', error);
				this.setState({
					UserLocationOff: true,
					islocationloaded : false,
				});
			},
			{enableHighAccuracy :false, timeout: 10000, maximumAge: 5000 }
		);
	}
   
	render (){
		if (this.state.loading )
				return (<View><Image source={require('../../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
		console.log(this.state.islocationloaded);
		return (
		  <View style={styles.container}>
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				showsUserLocation={true}
				region={{
					latitude:this.state.lati,
					longitude:this.state.longt,
					latitudeDelta: 0.05,
					longitudeDelta: 0.0121
				}}>
  
				  {!!this.state.lati && !!this.state.longt && 
				  <MapView.Marker
					 coordinate={{"latitude":this.state.lati,"longitude":this.state.longt}}
					 title={"Your Location"}
				   />}
				   
				   {this.state.markers.map(marker => (
						<Marker
						  key ={marker.id}
						  coordinate={marker.latlng}
						  title={marker.title}
						  image={require('../../../img/aftersales/location.png')}
						/>
					  ))}
		
			</MapView>
		  </View>
    
		)
	}
}
const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
});
