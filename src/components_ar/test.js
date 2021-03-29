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
import ProgressBar from './ProgressBar';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
//import DefaultTabBar from './scrollableTabView/DefaultTabBar';

import styles from './CarsStyles/SingleCarView';
import Casts from './SingleCarTabs/Casts';
import Info from './SingleCarTabs/Info';

export class SingleCarView extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			castsTabHeight: null,
			heightAnim: null,
			infoTabHeight: 200,
			isLoading: false,
			isRefreshing: false,
			showSimilarMovies: true,
			trailersTabHeight: null,
			tab: 0,
			youtubeVideos: []
		};

		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
	}

	componentWillMount() {
		this._retrieveDetails();
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
		const { details } = this.props.navigation.state.params;
		
		const { navigation } = this.props.navigation.state.params;
		const itemId = this.props.navigation.state.params.data.carName;
		alert(itemId);
		const info = details;
		let height;
		if (this.state.tab === 0) height = this.state.infoTabHeight;
		if (this.state.tab === 1) height = this.state.castsTabHeight;
		if (this.state.tab === 2) height = this.state.trailersTabHeight;

		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
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
						
						<View key={0}>
									<Image source={require('../../img/saipahome4.jpg')} style={styles.imageBackdrop} />
									<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />
						</View>	
						<View key={1}>
									<Image source={require('../../img/saipahome2.jpg')} style={styles.imageBackdrop} />
									<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />
						</View>	
							
						
							
					</Swiper>
					<View style={styles.cardContainer}>
						
						<View style={styles.cardDetails}>
							<Text style={styles.cardTitle}>"title"</Text>
							<Text style={styles.cardTagline}>"tag line"</Text>
							<View style={styles.cardGenre}>
								<Text>
								"Hello"
								</Text>
							</View>
						</View>
					</View>
					
						
					
				</View>
				<ScrollableTabView
							tabBarActiveTextColor="#FF8C00"
							tabBarUnderlineStyle={{backgroundColor:"#FF8C00"}}
							tabBarInactiveTextColor  = "#5e5e5e"
							onChangeTab={this._onChangeTab}
							renderTabBar ={()=><DefaultTabBar/>}
						>
							<Text tabLabel='Tab #1'>My</Text>
    <Text tabLabel='Tab #2'>favorite</Text>
    <Text tabLabel='Tab #3'>project</Text>
						</ScrollableTabView>
			</ScrollView>
		);
	}
}

SingleCarView.navigatorStyle = {
	navBarTransparent: true,
	drawUnderNavBar: true,
	navBarTranslucent: true,
	statusBarHidden: true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};




