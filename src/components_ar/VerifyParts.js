import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Vibration,
  Animated,
   Platform,
  PermissionsAndroid
} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Title,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  Header,
  Label,
  Input,
  ScrollableTab,
  Textarea,
  
} from "native-base";
import {RNCamera} from 'react-native-camera';
import {BeladiHeaderWhiteBack} from './BeladiHeaderWhiteBack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../api/api.js';
//import {BarcodeFinder} from './BarcodeFinder';
export class VerifyParts_ar extends Component <{}>  {
titleYpos = new Animated.Value(0);
    constructor(props) {
        super(props);
        this.state = {
            qrcode: '',
			verified :null,
			EmptyQrcode : false,
			isLoading : false,
			borderColor : "red",
			width : 250,
			height:220,
			borderWidth:2,
			found:false,
			scanLimit :false,
			isLoading : true,
			serverMsg : "",
        }
    }
	getSizeStyles() {
    return {
      width: this.state.width,
      height: this.state.height
    };
  }

    onBarCodeRead = (e) =>{ Vibration.vibrate(200);this.setState({qrcode: e.data,borderColor:"green",found:true}); 
	setTimeout(() => {this.setState({borderColor:"red"})}, 1000)};
	async _resetBack (){
		this.setState({borderColor:"red",found:false,verified:null,scanLimit:false, serverMsg:""});
	}
	animateBar = (direction = -1)=>{
	   Animated.timing(this.titleYpos,{toValue: direction*217, duration:1000})
	   .start(()=>{
		   if (direction ==-1) 
				direction =0;
			else
				direction =-1
		 this.animateBar (direction);});
	}
	
	async componentDidMount(){
		const { navigation } = this.props;
		navigation.addListener('willFocus', () =>this.setState({ focusedScreen: true }));
    
		navigation.addListener('willBlur', () =>this.setState({ focusedScreen: false }));
		if (Platform.OS === 'android') { 
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, { 
			title: this.props.permissionDialogTitle, 
			message: this.props.permissionDialogMessage, 
			}); 
			
			this.setState({ 
				isAuthorized: granted === PermissionsAndroid.RESULTS.GRANTED, 
				isAuthorizationChecked: true, 
			});
			
		}			
		this.animateBar();
		this.setState({isLoading:false});
	}
	
	async _checkPart(){	
	this.setState({isLoading:true });
		const qrcode = this.state.qrcode;
		var allGood = true;
		var EmptyQrcodeF = false;
		
		if (qrcode !=='' && qrcode !== undefined && qrcode !==null && qrcode != 'undefined'){
			;
		}else{
			allGood = false;
			EmptyQrcodeF = true;
		}
		
		this.setState({EmptyQrcode : EmptyQrcodeF });
		
		if (allGood){
			//alert("custid===>"+custId);
			this.setState({isLoading:true});
			try{
				const result = await api.checkPart(qrcode, "AR");
				
				if (result.errorMessage!==null && result.errorMessage!==undefined){
					//alert(result.errorMessage);
					this.setState({verified:false,serverMsg :result.msg});
				}else{
					this.setState({verified:result.original,scanLimit:result.scanLimit, serverMsg :result.msg});
				}
			}catch(error){
				console.log(error);
			}
		}
		this.setState({isLoading:false});
	}
	getVerified(){
		if (this.state.verified !=null){
			if (this.state.scanLimit!=null && this.state.scanLimit){
				return (<View style={{flex:2,flexDirection:"row",justifyContent:"center",marginTop:20}}>
							<View style={{flex:1,alignItems:"flex-end"}}>
								<Icon active type="FontAwesome" name="exclamation-triangle" style={{fontSize:27, color:"#CD7300"}} />
							</View>
							<View style={{flex:3,alignItems:"flex-start",}}>
								<Text style={[styles.verified,{paddingTop:5,fontSize : 15,color:"#CD7300"}]}>{this.state.serverMsg}</Text>
							</View>
						</View>);
			}else if (this.state.verified ==true){
				return (<View style={{flex:2,flexDirection:"row",justifyContent:"center",marginTop:20}}>
							<View style={{flex:2,alignItems:"flex-end"}}>
								<Image source={require("../../img/scanner/true.png")}  
								style={{flex:1,width:"40%",height:"40%",resizeMode: 'contain'}}/>
							</View>
							<View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
								<Text style={styles.verified}>{this.state.serverMsg}</Text>
							</View>
						</View>);
			}else{
				return (<View style={{flex:2,flexDirection:"row",justifyContent:"center",marginTop:20}}>
							<View style={{flex:1,alignItems:"flex-end"}}>
								<Image source={require("../../img/scanner/false.png")}  
								style={{flex:1,width:"40%",height:"40%",resizeMode: 'contain'}}/>
							</View>
							<View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
								<Text style={styles.notverified}>{this.state.serverMsg}</Text>
							</View>
						</View>);
			}
		}
	}
	
	
	_renderResult(){
		
		if (this.state.verified !=null){
			if (this.state.scanLimit!=null && this.state.scanLimit){
				return  (<View style={{flex:1,flexDirection:"column",justifyContent:"center",marginTop:20}}>
							<Image source={require("../../img/scanner/checkedb4.jpg")}  
								style={{flex:5,width:"100%",height:"100%",resizeMode: 'contain'}}/>
							<Button transparent onPress={()=> {this._resetBack();}}
						style={{backgroundColor:"#004777",borderWidth:0,shadowRadius:0,shadowOpacity:0, flex:1 ,margin: 50,marginTop:10,marginBottom:10, padding:10,borderRadius:10, }}>
						<Icon active type="FontAwesome" name="power-off" style={{color: 'white',fontSize:27}} />
						<Text style={{color: 'white',fontSize:15}}>أفتح الكاميرا</Text>
					</Button>
						</View>);
			
				
			}else if (this.state.verified ==true){
					return (<View style={{flex:1,flexDirection:"column",justifyContent:"center",marginTop:20}}>
							<Image source={require("../../img/scanner/ok.jpg")}  
								style={{flex:5,width:"100%",height:"100%",resizeMode: 'contain'}}/>
							<Button transparent onPress={()=> {this._resetBack();}}
						style={{backgroundColor:"#004777",borderWidth:0,shadowRadius:0,shadowOpacity:0, flex:1 ,margin: 50,marginTop:10,marginBottom:10, padding:10,borderRadius:10, }}>
						<Icon active type="FontAwesome" name="power-off" style={{color: 'white',fontSize:27}} />
						<Text style={{color: 'white',fontSize:15}}>أفتح الكاميرا</Text>
					</Button>
						</View>);
			
			}else{
				return (<View style={{flex:1,flexDirection:"column",justifyContent:"center",marginTop:20}}>
							<Image source={require("../../img/scanner/notok.jpg")}  
								style={{flex:5,width:"100%",height:"100%",resizeMode: 'contain'}}/>
							<Button transparent onPress={()=> {this._resetBack();}}
						style={{backgroundColor:"#004777",borderWidth:0,shadowRadius:0,shadowOpacity:0, flex:1 ,margin: 50,marginTop:10,marginBottom:10, padding:10,borderRadius:10, }}>
						<Icon active type="FontAwesome" name="power-off" style={{color: 'white',fontSize:27}} />
						<Text style={{color: 'white',fontSize:15}}>أفتح الكاميرا</Text>
					</Button>
						</View>);
			
			}
		}
		
		
		return (<View style={{flex:1}}>
					<Button block onPress={()=> {this._resetBack();}}
						style={{backgroundColor:"white", flex:1,marginTop:20 ,margin: 10, padding:20,borderRadius:10, }}>
						<Icon active type="FontAwesome" name="power-off" style={{color: '#004777',fontSize:27}} />
					</Button>
				</View>);
	}
	
	_getCamera(){
		const {focusedScreen } = this.state;
		if (focusedScreen){
			return (
			<RNCamera
				style={styles.preview}
				onBarCodeRead={this.onBarCodeRead}
				ref={ref => { this.camera = ref }} captureAudio={false}
				captureAudio ={false}
				>
				
				<View style={[styles.subcontainer]}>
				  
					<View style={[styles.finder, this.getSizeStyles()]}>
					  <View
						style={[
						  { borderColor: this.state.borderColor },
						  styles.topLeftEdge,
						  {
							borderLeftWidth: this.state.borderWidth,
							borderTopWidth: this.state.borderWidth
						  }
						]}
					  />
					  <View
						style={[
						  { borderColor: this.state.borderColor },
						  styles.topRightEdge,
						  {
							borderRightWidth: this.state.borderWidth,
							borderTopWidth: this.state.borderWidth
						  }
						]}
					  />
					  
					 <Animated.View style={[this.state.found?styles.greenLine:styles.redLine,{top:this.titleYpos}]}></Animated.View>
					  <View
						style={[
						  { borderColor: this.state.borderColor },
						  styles.bottomLeftEdge,
						  {
							borderLeftWidth: this.state.borderWidth,
							borderBottomWidth: this.state.borderWidth
						  }
						]}
					  />
					  <View
						style={[
						  { borderColor: this.state.borderColor },
						  styles.bottomRightEdge,
						  {
							borderRightWidth: this.state.borderWidth,
							borderBottomWidth: this.state.borderWidth
						  }
						]}
					  />
					</View>
					 
				  </View>	
				</RNCamera>
			)
		}else{
			return null
		}
	}
	
    render () {
		if (this.state.isLoading)
				return (<View><Image source={require('../../img/loading.gif')} style={{width: "100%",
										height: "100%",resizeMode: "cover"}}/></View>);
        return (
		
			<View style={styles.container}>
				
					<View style={{flex:4,backgroundColor:"#004777"}}>
						<View style={{flex:1}}>
							<BeladiHeaderWhiteBack navigation={this.props.navigation}/>
						</View>
						<View style={{flex:1,paddingTop:10,flexDirection:"row-reverse",alignItems:"center"}}>
							<View style={{flex:7,alignItems:"flex-start",}}>
								<Text style={{fontSize:14,color:"white"}}>أمسح الباركود أو الكيو أر كود هنا</Text>
							</View>
							<View style={{flex:0.3,}}>
							</View>
							<View style={{flex:1,alignItems:"flex-end",}}>
								<Image source={require("../../img/scanner/arrow.png")}  
								style={{flex:1,width:"50%",height:"50%",resizeMode: 'contain'}}/>
							</View>
							<View style={{flex:2,}}>
							</View>
						</View>
						<View style={{flex:5,flexDirection: 'row',}}>
							<View style={{flex:1}}/>
							<View style={{flex:6}}>
							{this.state.found?
								this._renderResult()
								:
								<View style={{flex: 1, overflow: 'hidden', position: 'relative'}}>
										{this._getCamera()}
										
									</View>
								}
							</View>
							<View style={{flex:1}}/>
						</View>
						<View style={{flex:1}}>
						</View>
					</View>
					
						<View style={{flex:2,backgroundColor:"white"}}>
							<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
								<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
									<View style={{flex:1,justifyContent:"space-between",alignItems:"center",marginTop:20}}>
										<View style={{flex:1,width:"50%",}}>
											
											  <Input value = {this.state.qrcode} editable={false} selectTextOnFocus={false} 
												style={[styles.textInputStyle,this.state.EmptyQrcode?styles.validationError:null]}
												placeholder="شفرة" />
											
										</View>
										<View style={{flex:1}}/>
										
											{this.getVerified()}
										
										<View style={{flex:1}}/>
										<View style={{flex:2}}>
											<Button block onPress={()=> {this._checkPart();}}
												style={{backgroundColor:"#004777", flex:1,marginTop:20 ,margin: 10, padding:20,borderRadius:10, }}>
												<Text style={{color:"white",fontSize:20}}>تحقق الأن</Text>
											</Button>
										</View>
									</View>
								</TouchableWithoutFeedback>
							</KeyboardAwareScrollView>
						</View>
						
			</View>
        )
    }

}

const styles = StyleSheet.create({

  subcontainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
	paddingBottom:0,
	
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
  redLine : { borderBottomColor: 'red',flex:1,borderBottomWidth: 2,width: '100%'},
  greenLine : { borderBottomColor: 'green',flex:1,borderBottomWidth: 2,width: '100%'},

  container: {
    flex: 1,
    flexDirection: 'column',
  },
  verified :{
	fontSize : 20,
	color : "green",
	paddingLeft:20
  },
  notverified :{
	fontSize : 17,
	color : "red",
	paddingLeft:20
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mb15:{marginTop:10},
  formRow : {flexDirection : "column" , justifyContent:"flex-start" , alignItems:"center", flex:1 },
  form:{flexDirection : "column" , justifyContent:"flex-start" },
  textInputStyle :{ height:35 ,backgroundColor :"#FFF",justifyContent:"center",textAlign:"center" ,alignItems:"center", borderWidth: 1, flex:1 , fontSize :12 , paddingTop:10 ,
		lineHeight:10 , borderRadius:7 , marginBottom : 10},
  validationError : {borderColor: '#d1251a' , borderWidth:1.5},
});