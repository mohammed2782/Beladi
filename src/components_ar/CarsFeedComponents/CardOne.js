import React, { PropTypes } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'
import styles from './styles/CardOne';




const CardOne = ({ car , navigation}) => (
	<View>
		<FastImage source={{ uri: ''+car.posterImage+'' }} style={styles.imageBackdrop} />
		<LinearGradient colors={['rgba(0, 0, 0, 0.5)', 'rgba(0,0,0, 0.7)', 'rgba(0,0,0, 0.8)']} style={styles.linearGradient} />
		<View style={styles.cardContainer}>
			<Image source={{ uri: car.thumbnailUrl }} style={styles.cardImage} />
			<View style={styles.cardDetails}>
				<Text style={styles.cardTitle} numberOfLines={2}>
					{car.carName}
				</Text>
				
				<Text style={styles.cardDescription} numberOfLines={3}>
					{car.briefDesc}
				</Text>
				<TouchableOpacity activeOpacity={0.9} 
					onPress={() => navigation.navigate("SingleCarView",{carid : car.carId})}>
					<View style={styles.viewButton}>
						<Text style={styles.viewButtonText}>Details</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	</View>
);

export default CardOne;
