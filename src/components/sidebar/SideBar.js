import React, { Component } from "react";
import { Image, View , FlatList} from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
  Button
} from "native-base";
import styles from "./style";
import AsyncStorage from '@react-native-community/async-storage';
//import LinearGradient from 'react-native-linear-gradient';
//const drawerCover = require("../../../img/home3.jpg");
const drawerCover = require("../../../img/logowhite.png");
const menuData = [
  {
	id: "1",
    name: "Home",
    route: "Home",
    checkRegistered:false,
	src : require("../../../img/sidebar/home.png")
   
  },
  {
	  id: "2",
    name: "Register",
	nameWhenChanged : "Registration info.",
    route: "Register",
	checkRegistered:false,
	src : require("../../../img/sidebar/reg.png")

  },
  {
	  id: "3",
    name: "Car Mileage",
    route: "Maintenance",
	checkRegistered:false,
	src :require("../../../img/sidebar/kilo.png")

  },
  /*{
	  id: "4",
    name: "Offers",
    route: "Offers",
    checkRegistered:false,
	src : require("../../../img/sidebar/offers.png")
  },*/

  {
	  id: "5",
    name: "Notifications",
    route: "ShortNews",
	checkRegistered:false,
	src :require("../../../img/sidebar/not.png")
  },
  {
	  id: "6",
    name: "Promotions",
    route: "Promotions",
	checkRegistered:true,
	src :require("../../../img/sidebar/offers.png")
  },
  
  {
	  id: "7",
    name: "Perodical Maintenance",
    route: "PerodicalMaintenance",
	checkRegistered:true,
	src :require("../../../img/sidebar/perdmaint.png")
		

  },
  
  
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
	  custId : null,
	  isRegistered :false,
	  datas:[],
	  isRegistered :this.props.screenProps.isRegistered,
	  appCallBackFunction : this.props.screenProps.AppCallBackFunction,
    };
  }
	
	registerUser = async()=>{
		//alert("changed in the sidebar level");
		this.setState({isRegistered:true});
	}
	
	unRegisterUser = async()=>{
		//alert("changed in the sidebar level");
		this.setState({isRegistered:false});
	}
	
	async componentDidMount (){
		await this.getCustomerId();
		
	}
	async getCustomerId (){
		const id = null;
		try{
			const id = await AsyncStorage.getItem("custId");
			if (id !=undefined && id !=null && id>0){
				isRegistered = true;
				this.setState({custId:id ,isRegistered:true,datas:menuData});
			}
		}catch (error){
			alert(error);
		}
		return id;
	}
  render() {
	 
    return (
	
	<View style={{flex:1,flexDirection:"column",}}>
		<View style={{flex:10,}}>
			<Container style={{backgroundColor:"#f0f0f1"}}>
				<Content
				  bounces={true}
				  style={{ flex: 1, top: 1}}
				>
				<View style={{backgroundColor:"#004777",flex:5, paddingTop:20,paddingLeft:20}}>
					<Image source={drawerCover} style={styles.drawerCover} />
				</View>
				<View style={{backgroundColor:"#f0f0f1",flex:4,paddingTop:10}}>
					<FlatList
						data={menuData}
						style= {{marginLeft:0, }}
						keyExtractor={item => item.id.toString()}
						renderItem={({item}) =>
							
							<ListItem
								button
								noBorder
								onPress={(this.state.isRegistered || !item.checkRegistered)?
								 () => this.props.navigation.navigate(item.route,{appCallBackFunction:this.registerUser, unRegCallBackFunction:this.unRegisterUser}):null}
								style = {{flex:1,flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-end",
								paddingBottom:0,marginLeft:0,paddingTop:0,paddingRight:20,marginTop:12 }}
								>
								<View style={{flex:1, flexDirection:"row",justifyContent:"flex-end" }}>
									<View style={{flex:1,paddingLeft:10,paddingBottom:0,paddingTop:15,paddingRight:5}}>
										<Image
											source = {item.src}
											style ={{resizeMode:"contain",height:"90%",width:"90%",}}
										/>
									</View>
									<View style={{flex:7,alignItems:"flex-start"}}>
										<View
											style={{ paddingTop:14,paddingBottom:5,paddingLeft:5,}}>
											<Text style={[styles.text, (this.state.isRegistered || !item.checkRegistered)?null:styles.disabledText]}>
												{(this.state.isRegistered && (item.name=='Register'))?item.nameWhenChanged:item.name}
												{console.log("this.state.isRegistered inside the loop==>"+(this.state.isRegistered))}
											</Text>
										</View>
											 
										
									</View>
								</View>
								<Image
											source = {require ('../../../img/sidebar/line.png')}
											style ={{resizeMode:"cover",height:1,width:"100%",}}
										/>
							</ListItem>
						}
					/>
				</View>
			</Content>
		</Container>
	  </View>
	  <View style={{backgroundColor:"#d6d9dd",flex:1, flexDirection:"row",justifyContent:"flex-start",alignItems:"center" }}>
					<View style={{flexDirection:"row", flex:1}}>
						<View style={{flex:1,flexDirection:"row", paddingLeft:20, alignItems:"center"}}>
							<Image source={require('../../../img/sidebar/planet.png')} style={{width: "60%",
										height: "60%",resizeMode:"contain"}}/>
						</View>
						<View style={{flexDirection:"row", justifyContent:"flex-start" , alignItems:"center", flex:5}}>
							
							<Button transparent onPress={()=>this.props.screenProps.lang("AR")} >
								<Text style={styles.langText}>AR</Text>
							</Button>
							<Button transparent onPress={()=>this.props.screenProps.lang("EN")} >
								<Text style={styles.langText} >En</Text>
							</Button>
							
							<Button transparent onPress={()=>this.props.screenProps.lang("KR")} >
								<Text style={styles.langText} >KR</Text>
							</Button>
						</View>
					</View>
		</View>
	</View> 
    );
  }
}

export default SideBar;
