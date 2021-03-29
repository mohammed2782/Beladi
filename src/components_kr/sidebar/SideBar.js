import React, { Component } from "react";
import { Image, View ,  FlatList} from "react-native";
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
  Button,
  Body
} from "native-base";
import styles from "./style";
import AsyncStorage from '@react-native-community/async-storage';
//const drawerCover = require("../../../img/home3.jpg");
//const drawerCover = require("../../../img/menulogo.png");
const drawerCover = require("../../../img/logowhite.png");
const menuData = [
  {
	id: "1",
    name: "لاپه‌ره‌ی سه‌ره‌کی",
    route: "Home",
    checkRegistered:false,
   src : require("../../../img/sidebar/home.png")
  },
  {
	  id: "2",
    name: "تۆمارکردن",
	nameWhenChanged : "تۆمارکردن",
    route: "Register_kr",
	checkRegistered:false,
	src : require("../../../img/sidebar/reg.png")
  },
  {
	  id: "3",
    name: "پێوه‌ری کیلۆمه‌تر",
    route: "Maintenance_kr",
	checkRegistered:false,
	src :require("../../../img/sidebar/kilo.png")
  },
 /* {
	  id: "4",
    name: "عروض",
    route: "Offers_ar",
    checkRegistered:false,
  },
*/
  {
	  id: "5",
    name: "ئاگادارکردنه‌وه‌",
    route: "ShortNews_kr",
	checkRegistered:false,
	src :require("../../../img/sidebar/not.png")
  },
  {
	  id: "6",
    name: "ئۆفه‌ره‌ تایبه‌ته‌کان",
    route: "Promotions_kr",
	checkRegistered:true,
	src :require("../../../img/sidebar/offers.png")
  },
  
  {
	  id: "7",
    name: "چاککردنه‌وه‌ی به‌رده‌وام",
    route: "PerodicalMaintenance_kr",
	checkRegistered:true,
	src :require("../../../img/sidebar/perdmaint.png")
  },
  
  
];

class SideBar_kr extends Component {
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
	  console.log("this is side bar isRegistered===>"+this.state.isRegistered);
	 // this.props.screenProps.lang
	 
	 
    return (
	
	<View style={{flex:1,flexDirection:"column"}}>
		<View style={{flex:10}}>
			<Container style={{backgroundColor:"#f0f0f1"}}>
				<Content
				  bounces={true}
				  style={{ flex: 1, top: 1 }}
				>
				<View style={{backgroundColor:"#004777",flex:5, paddingTop:20,paddingLeft:20}}>
					<Image source={drawerCover} style={styles.drawerCover} />
				</View>
				<View style={{backgroundColor:"#f0f0f1",flex:4,paddingTop:10}}>
				 <FlatList
					contentContainerStyle = {{alignItems:"stretch",flex:1}}
					data={menuData}
					style= {{marginLeft:0 }}
					keyExtractor={item => item.id.toString()}
					renderItem={({item}) =>
						<ListItem
								button
								noBorder
								onPress={(this.state.isRegistered || !item.checkRegistered)?
								 () => this.props.navigation.navigate(item.route,{appCallBackFunction:this.registerUser, unRegCallBackFunction:this.unRegisterUser}):null}
								style = {{flex:1,flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-end",
								paddingBottom:0,marginLeft:0,paddingTop:0,paddingLeft:20,marginTop:12,paddingRight:0 }}
								>
								<View style={{flex:1, flexDirection:"row-reverse",justifyContent:"flex-end" }}>
									<View style={{flex:1,paddingLeft:10,paddingBottom:0,paddingTop:15,paddingRight:0}}>
										<Image
											source = {item.src}
											style ={{resizeMode:"contain",height:"90%",width:"90%",}}
										/>
									</View>
									<View style={{flex:7,alignItems:"flex-end"}}>
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
	  <View style={{backgroundColor:"#d6d9dd", flex:1, flexDirection:"row",justifyContent:"flex-start",alignItems:"center" }}>
					<View style={{flexDirection:"row-reverse", flex:1}}>
						<View style={{flex:1,flexDirection:"row", paddingLeft:20, alignItems:"center"}}>
							<Image source={require('../../../img/sidebar/planet.png')} style={{width: "60%",
										height: "60%",resizeMode:"contain"}}/>
						</View>
						<View style={{flexDirection:"row", justifyContent:"flex-start" , alignItems:"center", flex:5}}>
							
							<Button transparent onPress={()=>this.props.screenProps.lang("AR")} >
								<Text style={styles.langText}>عربي</Text>
							</Button>
							<Button transparent onPress={()=>this.props.screenProps.lang("EN")} >
								<Text style={styles.langText} >En</Text>
							</Button>
							
							<Button transparent onPress={()=>this.props.screenProps.lang("KR")} >
								<Text style={styles.langText} >كوردي</Text>
							</Button>
						</View>
					</View>
				</View>
	</View> 
    );
  }
}

export default SideBar_kr;
