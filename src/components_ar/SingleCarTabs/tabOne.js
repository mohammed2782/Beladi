import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body } from "native-base";

export default class TabOne extends Component {
  render() {
    return (
      <Content padder>
        <Card>
          <CardItem>
            <Body>
              <Text>Overview.</Text>
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{this.props.data}</Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}
