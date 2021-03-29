import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet
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
  Textarea
} from "native-base";
import Camera from 'react-native-camera';

export class VerifyParts extends Component <{}>  {

    constructor(props) {
        super(props);
        this.state = {
            qrcode: '',
			
        }
    }

    onBarCodeRead = (e) => this.setState({qrcode: e.data});

    render () {
        return (
            <View style={styles.container}>
				<View style={{flex:3,backgroundColor:"#004777"}}>
					<View style={{flex:1}}>
					</View>
					<View style={{flex:5,flexDirection: 'row',}}>
						<View style={{flex:1}}/>
						<View style={{flex:6}}>
							<Camera
								style={styles.preview}
								onBarCodeRead={this.onBarCodeRead}
								ref={cam => this.camera = cam}
								aspect={Camera.constants.Aspect.fill}
								>
									<Text style={{
										backgroundColor: 'white'
									}}>{this.state.qrcode}</Text>
							</Camera>
						</View>
						<View style={{flex:1}}/>
					</View>
					<View style={{flex:1}}>
					</View>
				</View>
				<View style={{flex:2,backgroundColor:"white"}}>
					<Form style={styles.form}>
						<View style={styles.formRow} >
							<Input 
								name = "customerName" 
								value = {this.state.qrcode}
								onChangeText={customerName =>this.setState({custName:customerName})}
								style={styles.textInputStyle}
							/>
							
						</View>
					</Form>
				</View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  formRow : {flexDirection : "column" , justifyContent:"flex-start" , alignItems:"center", flex:1 },
  form:{flexDirection : "column" , justifyContent:"flex-start" },
  textInputStyle :{ height:40 ,borderColor: 'gray',backgroundColor :"#FFF", borderWidth: 1, flex:1 , fontSize :12 , paddingTop:10 ,
		lineHeight:10 , borderRadius:7 , marginBottom : 10},
});