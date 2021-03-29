import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	StyleSheet,
} from 'react-native';

import api from '../api/api.js';
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
  ScrollableTab
} from "native-base";
import ProgressBar from './ProgressBar';
//import LinearGradient from 'react-native-linear-gradient';
import TabOne from "./SingleCarTabs/tabOne";
import TabTwo from "./SingleCarTabs/tabTwo";
import TabThree from "./SingleCarTabs/tabThree";
import Swiper from 'react-native-swiper';


export class PartCheck extends  Component <{}> {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : false,
			status : 0
		};
	}
	
	async _checkWithServer(){
		const sn = this.state.sn;
		this.setState({isLoading:true});
		const result = await api.checkPart(sn);
		this.setState({status:result.rs});
		alert(this.state.status);
		this.setState({isLoading:false});
	}
	
	render() {
		if (this.state.isLoading)
			return (<View style={styles.progressBar}><ProgressBar /></View>);
		
		let checkMsg = <View></View>;
		if (this.state.status ==1)checkMsg = <View style={{flex:1,borderColor:'green',borderBottomWidth:2 , alignItems:'center', marginTop:20, marginBottom:20}}>
				<Text style={{color:'green',alignItems:'center'}}>Original</Text></View>;
		if (this.state.status == 2)checkMsg = <View style={{flex:1, alignItems:'center', marginTop:20, marginBottom:20,
		 borderColor:'red', borderBottomWidth:2}}><Text style={{color:'red'}}>Not Original</Text></View>;
		return(
			<Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Stacked Label</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          {checkMsg}
		  <Form>
            <Item stackedLabel style={{height:90}}>
              <Label >Part serial number</Label>
              <Input name="TextInputValueHolder" 
			  defaultValue={this.state.sn}
			  onChangeText={TextInputValueHolder =>this.setState({sn:TextInputValueHolder})}/>
            </Item>
          </Form>
          <Button block onPress={()=> {this._checkWithServer();}}
		  style={{backgroundColor:"#FF8C00", margin: 15, marginTop: 50 }}>
            <Text style={{color:"white"}}>Check</Text>
          </Button>
	
        </Content>
      </Container>
		);
	}
}
/*
{
"partSerialNo" :"helllo"
}
*/
const styles = StyleSheet.create(
	{
		container:{backgroundColor: 'white',},
		progressBar: {
			backgroundColor: '#0a0a0a',
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		content:{
			
		}
	}
);