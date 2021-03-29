const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    height: deviceHeight / 4,
    width: "70%",
    position: "relative",
	 resizeMode: "center",
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 15: deviceWidth / 14,
    top: Platform.OS === "android" ? deviceHeight / 20 : deviceHeight / 18,
   
   
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 17,
	color:"#1e3c70",
  },
  disabledText: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 17,
	color:"#D3D3D3",
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  langText:{
	color:"#004777" , fontSize:13, fontWeight: Platform.OS === "ios" ? "600" : "500",
  }
};
