import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Platform
} from 'react-native';
import Swiper from 'react-native-swiper';
import CardOne from './CarsFeedComponents/CardOne';
import CardTwo from './CarsFeedComponents/CardTwo';
import ProgressBar from './ProgressBar';
import api from '../api/api.js';
import styles from './styles/CarsFeed';


export class CarsFeed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			carsList :null
		};

		
		this._onRefresh = this._onRefresh.bind(this);
	}

	componentWillMount() {
		this._retrieveMovies();
	}

	async _retrieveMovies(isRefreshed) {
		const carsListLoaded = await api.fetchCarList();
			
		this.setState({carsList:carsListLoaded ,isLoading:false} );
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}
	
	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveMovies('isRefreshed');
	}

	

	render() {
		const { carsList } = this.state;
		if (this.state.isLoading)
			return (<View style={styles.progressBar}><ProgressBar /></View>);
		
		return (
			<ScrollView
				style={styles.container}
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
				<Swiper
					autoplay
					autoplayTimeout={5}
					showsPagination={false}
					height={320}>
					{carsList.map(car => (
						<CardOne key={car.carId} car={car} navigation={this.props.navigation}/>
					))}
				</Swiper>
				<View>
					<View style={styles.listHeading}>
						<Text style={styles.listHeadingLeft}>Our products</Text>
						
					</View>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{carsList.map(car => (
							<CardTwo key={car.carId} car={car}  navigation={this.props.navigation}/>
						))}
					</ScrollView>
					
				</View>
			</ScrollView>
		);
	}
}
