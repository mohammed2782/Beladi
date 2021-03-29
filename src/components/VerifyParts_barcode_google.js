import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert
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
import BarcodeScanner,{ Exception, FocusMode, CameraFillMode, FlashMode, BarcodeType, pauseScanner, resumeScanner } from 'react-native-barcode-scanner-google';

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
					<View style={{flex:7,flexDirection: 'row',}}>
						
						<View style={{flex:1, paddingLeft:0,marginLeft:0}}>
							<View style={{flex:1, paddingLeft:0,marginLeft:0}}>
								<BarcodeScanner
									style={{flex: 1,height:"100%",width:"200%",alignItems:"center",alignSelf:"center"}}
									onBarcodeRead={({data, type}) => {
									  // handle your scanned barcodes here!
									  // as an example, we show an alert:
									  Alert.alert(`Barcode '${data}' of type '${type}' was scanned.`);
									}}
									focusMode={FocusMode.FIXED  /* could also be TAP or FIXED */}
									cameraFillMode={CameraFillMode.FIT}
									
								/>
							</View>
						</View>
						
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