import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	
	backgroundImage: {flex: 1, width:undefined, height:undefined },
	carTitle :{
		fontFamily : "Futura Md BT Bold",
		color : "black",
		fontWeight:"bold",
		fontSize : 16,
		
	},
	textStyle: {
		color: 'white',
		paddingTop: 10,
		fontSize: 13,
		fontWeight: 'bold'
	},
	underlineStyle: {
		backgroundColor: '#EA0000'
	},
	tabBar: {
		backgroundColor: '#131313'
	},
	contentContainer: {
		flex: 1,
		flexDirection:"row-reverse",
		
	},
	progressBar: {
		backgroundColor: '#0a0a0a',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		
	},
	swiper: {
		// position: 'absolute',
		// flex: 1
	},
	linearGradient: {
		top: 0,
		left: 0,
		right: 0,
		height: 248,
		position: 'absolute'
	},
	imageBackdrop: {
		// flex: 1,
		height: 230,
		backgroundColor: 'black'
	},
	cardContainer: {
		flex: 1,
		position: 'absolute',
		top: 180,
		right: 10,
		left: 10,
		flexDirection: 'row'
	},
	cardImage: {
		height: 170,
		width: 150,
		borderRadius: 3
	},
	cardDetails: {
		paddingLeft: 10,
		flex: 1,
		paddingTop: 50
	},
	cardTitle: {
		color: '#FF8C00',
		fontSize: 22,
		fontWeight: '500',
		paddingTop: 30
	},
	cardTagline: {
		color: 'white',
		fontSize: 15
	},
	cardGenre: {
		flexDirection: 'row'
	},
	cardGenreItem: {
		textAlign: 'left',
		fontSize: 11,
		marginRight: 5,
		color: 'white'
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
	activeTab :{backgroundColor:"#fff",borderTopColor:"#D3D3D3", borderLeftColor:"#D3D3D3" , borderBottomColor:"blue", 
				borderTopRightRadius:7,paddingLeft:0,paddingRight:0, borderTopLeftRadius:7, borderRightColor:"#d1251a",borderRightWidth:10, borderTopWidth:1,borderLeftWidth:1},
	inActiveTab : {backgroundColor:'white',paddingLeft:0,paddingRight:0,borderColor:"#D3D3D3",borderLeftWidth:1, borderTopLeftRadius:7, 
				borderTopRightRadius:7 , borderTopWidth:1, borderRightWidth:1}
	
});

export default styles;
