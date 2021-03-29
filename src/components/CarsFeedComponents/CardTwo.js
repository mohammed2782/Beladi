import React, { PropTypes } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import styles from './styles/CardTwo';

const CardTwo = ({ car, navigation }) => (
	<TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("SingleCarView",{carid : car.carId})}>
		<View style={styles.cardContainer}>
			<Image source={{ uri: car.thumbnailUrl}} style={styles.cardImage} />
			<View style={styles.cardTitleContainer}>
				<Text style={styles.cardTitle} numberOfLines={2}>
					{car.carName}
				</Text>
			</View>
		</View>
	</TouchableOpacity>
);



export default CardTwo;
