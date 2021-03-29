import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	linearGradient: {
		top: 0,
		left: 0,
		right: 0,
		height: 240,
		position: 'absolute'
	},
	imageBackdrop: {
		// flex: 1,
		height: 240,
		backgroundColor: 'black'
	},
	cardContainer: {
		flex: 1,
		position: 'absolute',
		top: 140,
		right: 16,
		left: 5,
		flexDirection: 'row'
		
		
	},
	cardImage: {
		height: 180,
		width: 135,
		borderRadius: 3,
		resizeMode : "cover"
	},
	cardDetails: {
		paddingLeft: 10,
		flex: 1
	},
	cardTitle: {
		color: '#FF8C00',
		fontSize: 19,
		fontWeight: '500',
		paddingTop: 20
	},
	cardGenre: {
		flexDirection: 'row'
	},
	cardGenreItem: {
		fontSize: 11,
		marginRight: 5,
		color: 'white'
	},
	cardDescription: {
		color: '#f7f7f7',
		fontSize: 13,
		marginTop: 5
	},
	cardNumbers: {
		flexDirection: 'row',
		marginTop: 5
	},
	cardStar: {
		flexDirection: 'row'
	},
	cardStarRatings: {
		marginLeft: 5,
		fontSize: 12,
		color: 'white'
	},
	cardRunningHours: {
		marginLeft: 5,
		fontSize: 12
	},
	viewButton: {
		justifyContent: 'center',
		padding: 10,
		borderRadius: 3,
		backgroundColor: '#EA0000',
		width: 100,
		height: 30,
		marginTop: 10
	},
	viewButtonText: {
		color: 'white'
	}
});

export default styles;
