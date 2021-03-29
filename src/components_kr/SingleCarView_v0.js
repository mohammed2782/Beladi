import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View
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
import LinearGradient from 'react-native-linear-gradient';
import TabOne from "./SingleCarTabs/tabOne";
import TabTwo from "./SingleCarTabs/tabTwo";
import TabThree from "./SingleCarTabs/tabThree";
import styles from './CarsStyles/SingleCarView';
import Swiper from 'react-native-swiper';


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
			car:null
		};

		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
	}
	
	
	async componentDidMount() {
		const carid = this.props.navigation.getParam("carid","NO-ID");
		const cardtls = await api.fetchCarDetails(carid,'EN');
		//alert("this is json2 "+cardtls.carManufactureCode);
		this.setState({car : cardtls , isLoading:false});
		this.setState({ isLoading:false});
		//alert(this.props.navigation.getParam("carid","NO-ID"));
		
	}

	componentWillReceiveProps(nextProps) {
		alert(nextProps);
		//if (nextProps) this.setState({ isLoading: false });
	}

	_retrieveDetails(isRefreshed) {
		
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
		if (this.state.isLoading){
			return (<View style={styles.progressBar}><ProgressBar /></View>);
		}
		const car = this.state.car;
		//alert("this is json2 "+car.carManufactureCode);
		return (
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
						showsPagination={false}
						height={248}
						loop
						index={5}>
						{
							
							car.images.map((item, index) => (
								<View key={index}>
									<Image source={{ uri:item }} style={styles.imageBackdrop} />
									<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />
								</View>
							))
							
						}
					</Swiper>
					<View style={styles.cardContainer}>
						<Image source={{ uri: car.thumbnailUrl }} style={styles.cardImage} />
						<View style={styles.cardDetails}>
							<Text style={styles.cardTitle}>{car.carName}</Text>
							
						</View>
					</View>
					
					<View style={styles.contentContainer}>	
					<Tabs tabBarBackgroundColor={'#ffffff'} tabBarUnderlineStyle={{borderBottomWidth:2,borderColor:"#FF8C00"}} renderTabBar={() => <ScrollableTab />}>
						<Tab heading="Overview" tabStyle= {{backgroundColor:"#fff"}} textStyle={{color: '#555'}}  activeTabStyle={{backgroundColor:"#fff"}} activeTextStyle={{color:"#FF8C00"}}>
							<TabOne data={car.briefDesc} />
						</Tab>
						<Tab heading="Specifications" tabStyle= {{backgroundColor:"#fff"}} textStyle={{color: '#555'}} activeTabStyle={{backgroundColor:"#fff"}}  activeTextStyle={{color:"#FF8C00"}}>
							<TabTwo />
						</Tab>
						<Tab heading="Features" tabStyle= {{backgroundColor:"#fff"}} textStyle={{color: '#555'}}  activeTabStyle={{backgroundColor:"#fff"}}  activeTextStyle={{color:"#FF8C00"}}>
							<TabThree />
						</Tab>
					  
					</Tabs>
					</View>
				</View>
			</ScrollView>
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
