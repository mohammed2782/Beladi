import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	ImageBackground
} from 'react-native';
import api from '../api/api.js';
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  ScrollableTab
} from "native-base";
import ProgressBar from './ProgressBar';
//import LinearGradient from 'react-native-linear-gradient';
import TabOne from "./SingleCarTabs/tabOne";
import TabTwo from "./SingleCarTabs/tabTwo";
import TabThree from "./SingleCarTabs/tabThree";
import styles from './CarsStyles/SingleCarView';
import Swiper from 'react-native-swiper';
import CarSpecificationsTab from './SingleCarTabs/CarSpecificationsTab';
import CarFeaturesTab from './SingleCarTabs/CarFeaturesTab';

export class SingleCarView extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			castsTabHeight: null,
			heightAnim: null,
			infoTabHeight: 200,
			isLoading: true,
			isRefreshing: false,
			showSimilarMovies: true,
			trailersTabHeight: null,
			tab: 0,
			youtubeVideos: [],
			car:null,
			carid:this.props.navigation.getParam("carid","NO-ID"),
		};

		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
	}
	
	
	async componentDidMount() {
		//const carid = this.props.navigation.getParam("carid","NO-ID");
		const cardtls = await api.fetchCarDetails(this.state.carid,'EN');
		//alert("this is json2 "+cardtls.carManufactureCode);
		this.setState({car : cardtls , isLoading:false});
		this.setState({ isLoading:false});
		//alert(this.props.navigation.getParam("carid","NO-ID"));
		
	}

	componentWillReceiveProps(nextProps) {
		//alert(nextProps);
		//if (nextProps) this.setState({ isLoading: false });
	}

	async _retrieveDetails(isRefreshed) {
		const cardtls = await api.fetchCarDetails(this.state.carid,'EN');
		this.setState({car : cardtls , isLoading:false});
		this.setState({ isLoading:false});
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}
	
	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveDetails('isRefreshed');
	}

	
	_onChangeTab({ i, ref }) {
		this.setState({ tab: i });
	}

	
	
	_getTabHeight(tabName, height) {
		if (tabName === 'casts') this.setState({ castsTabHeight: height });
		if (tabName === 'trailers') this.setState({ trailersTabHeight: height });
	}

	render() {
		 if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
		const car = this.state.car;
		//alert("this is json2 "+car.carManufactureCode);
		return (
				<ImageBackground style={styles.backgroundImage}
					 source={require('../../img/Background.png')} blurRadius={0} resizeMode = "cover">
					<View style={{flexDirection:"column" , flex:1 , justifyContent:"flex-start"}}>
						<View style={{flexDirection : "row" ,marginTop:20,marginRight:20,marginLeft:20,
						display: 'flex',flex:1,paddingLeft:0, justifyContent : "space-between"}}>
							<View style={{flex:2,flexDirection:'column', alignItems:"flex-start" , justifyContent:"flex-start"}}>
								<View style={{flex:3,flexDirection:"row",justifyContent:"flex-start"}}>
									<View style={{flex:2,marginRight: 'auto'}}>
										<Button	transparent onPress={() => this.props.navigation.goBack()} >
											<Image source={require("../../img/inner/backen.png")}  style={{ 
										
											width: '100%',
											height: '100%', 
											paddingLeft:0,
											alignSelf:"center",
											resizeMode: 'contain'
											}}/>
										</Button>
									</View>
									<View style={{flex:1}} />
								</View>
								<View style={{flex:2,flexDirection:"row",justifyContent:"flex-start"}}>
									<Image 
										style={{flex:1,
											width: "100%",
											height: "100%",
											resizeMode: 'contain'}} 
										source ={require('../../img/products/carmodelpoint.png')} />
										<Text style={styles.carTitle}>{car.carName}</Text>
								</View>
							</View>	
							<View style={{flex:3}}>
								<Image source={require('../../img/inner/logo.png')}
									style={{
										marginLeft: 'auto',
										width: "40%",
										height: "100%",
										resizeMode: 'contain'
										}}
								/>
							</View>
						</View>
						<View style={{flex:7, marginTop:10 , marginLeft:20 , marginRight:20}}>
		
							<ScrollView
								style={styles.container}
								scrollEventThrottle={100}
								refreshControl={
									<RefreshControl
										refreshing={this.state.isRefreshing}
										onRefresh={this._onRefresh}
										colors={['#EA0000']}
										tintColor="white"
										title="loading..."
										titleColor="white"
										progressBackgroundColor="white"
									/>
								}>
								<View>
									<Swiper
										style={styles.swiper}
										autoplay
										
										autoplayTimeout={4}
										showsPagination={true}
										
										height={248}
										activeDotColor ="#d1251a"
										
										loop
										index={5}>
										{
											car.images.map((item, index) => (
												<View key={index}>
													<Image source={{ uri:item }} style={styles.imageBackdrop} />
												</View>
											))
										}
									</Swiper> 
									
					
									<View style={styles.contentContainer}>	
										<Tabs 
											tabBarBackgroundColor={'#ffffff'} 
											tabBarUnderlineStyle ={{backgroundColor:"transparent"}}
											style={{borderWidth:0}}
											initialPage={this.state.currentTab} onChangeTab={({ i }) => this.setState({ currentTab: i })}>
											<Tab 
												heading = "Specifications"
												tabStyle= {styles.inActiveTab} 
												textStyle={{color: '#D3D3D3' , fontSize:13}} 
												activeTabStyle={styles.activeTab}  
												activeTextStyle={{color:"black", fontSize:13}}
											>
												<CarSpecificationsTab specs={car.specs} navigation = {this.props.navigation}/>
											</Tab>
											<Tab 
												heading="Features"
												tabStyle= {styles.inActiveTab} 
												textStyle={{color: '#D3D3D3' , fontSize:13}} 
												activeTabStyle={styles.activeTab}  
												activeTextStyle={{color:"black", fontSize:13}}
											
											>
												<CarFeaturesTab features={car.features} navigation = {this.props.navigation}/>
											</Tab>
										</Tabs>
									</View>
								</View>
							</ScrollView>
						</View>
					</View>
				</ImageBackground>
		);
	}
}


/*

SingleCarView.defaultProps = {
		car: 
				{
					briefDesc: "Tiba2 or 5-door Tiba is SAIPA’s most popular product especially among the youth. Competitive MPG and performance and relatively high acceleration power made this car very popular among young generation.\n\nTiba2 is a capable rival to domestic 5-door makes and with its beautiful design and appearance and also improving on shortcomings of 5-doors in the market, like improving the space both inside the car and the trunk, becomes an appealing choice for customers.",
					carId: 1,
					carManufactureCode: "SAIPA",
					carMaufactureName: "Saipa",
					carName: "TAIBA 2",
					features: {
						AIRBAG: "AIR BAG"
					},
					images: [
						"localhost:8080/zscoimg/carimages/1-3.jpg",
					],
					thumnailUrl: "localhost:8080/zscoimg/carimages/1-3.jpg"
				}
			
	};

*/
