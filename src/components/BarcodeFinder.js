
////	<BarcodeFinder width={250} height={180} borderColor="red" borderWidth={2} />
import React, { Component } from "react";
import { StyleSheet, View ,Animated } from "react-native";
import * as Animatable from 'react-native-animatable';

export class BarcodeFinder extends Component {
  titleYpos = new Animated.Value(0);
  
  constructor(props) {
    super(props);
  }

  getSizeStyles() {
    return {
      width: this.props.width,
      height: this.props.height
    };
  }
  animateBar = (direction = -1)=>{
	   Animated.timing(this.titleYpos,{toValue: direction*180, duration:500})
	   .start(()=>{
		   if (direction ==-1) 
				direction =0;
			else
				direction =-1
		 this.animateBar (direction);});
  }
  async componentDidMount(){
	this.animateBar();
  }
  render() {
    return (
      <View style={[styles.container]}>
	  
        <View style={[styles.finder, this.getSizeStyles()]}>
          <View
            style={[
              { borderColor: this.props.borderColor },
              styles.topLeftEdge,
              {
                borderLeftWidth: this.props.borderWidth,
                borderTopWidth: this.props.borderWidth
              }
            ]}
          />
          <View
            style={[
              { borderColor: this.props.borderColor },
              styles.topRightEdge,
              {
                borderRightWidth: this.props.borderWidth,
                borderTopWidth: this.props.borderWidth
              }
            ]}
          />
		  
		 <Animated.View style={[styles.redLine,{top:this.titleYpos}]}></Animated.View>
          <View
            style={[
              { borderColor: this.props.borderColor },
              styles.bottomLeftEdge,
              {
                borderLeftWidth: this.props.borderWidth,
                borderBottomWidth: this.props.borderWidth
              }
            ]}
          />
          <View
            style={[
              { borderColor: this.props.borderColor },
              styles.bottomRightEdge,
              {
                borderRightWidth: this.props.borderWidth,
                borderBottomWidth: this.props.borderWidth
              }
            ]}
          />
        </View>
		 
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  finder: {
    alignItems: "center",
    justifyContent: "center"
  },
  topLeftEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 20
  },
  topRightEdge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 20
  },
  bottomLeftEdge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 20
  },
  bottomRightEdge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 20
  },
  redLine : { borderBottomColor: 'red',flex:1,borderBottomWidth: 2,width: '100%'}
});
