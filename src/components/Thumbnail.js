import React from 'react';
import { StyleSheet, ImageBackground , View } from 'react-native';
import Title from './Title';
import {PropTypes} from 'prop-types';

	const Thumbnail = ({ url, titleText, accentColor, style}) => {
		const imageStyle = {
			backgroundColor: `${accentColor}77` // adds some transparency to the color
		};
		const TitleComponent = <Title style={styles.title}>{titleText}</Title>;
		return (
			<View style={[styles.container, { borderColor: accentColor }, style]}>
				{url.length>0 ? (
					<ImageBackground
						style={[styles.image]}
						source={{ uri: url }}
					>
						{TitleComponent}
					</ImageBackground>
				):(
					<View
					style={[styles.image, imageStyle]}
					>
					{TitleComponent}
					</View>
				)
				}
			</View>
		);
	};
	
	Thumbnail.propTypes = {
		style: View.propTypes.style,
		url: PropTypes.string.isRequired,
		titleText: PropTypes.string,
		accentColor: PropTypes.string.isRequired
	};
	
	const styles = StyleSheet.create({
		container: {
			borderBottomWidth: 3,
			borderStyle: 'solid'
		},
		image: {
			height: 100,
			justifyContent: 'flex-end'
		},
		title: {
			padding: 5
		}
	});


export default Thumbnail;