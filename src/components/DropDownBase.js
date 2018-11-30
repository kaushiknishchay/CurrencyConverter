import React, { PureComponent } from 'react';
import { Image, Text, View } from 'react-native';
import Maps from '../assets/maps';


export const Map = ({ value }) => {

  if (Maps(value) !== undefined) {
    return (
      <Image
        source={Maps(value)}
        style={{
          width: 35,
          height: 28,
          // backgroundColor: 'red'
        }}
        resizeMode="contain"
      />
    );
  } else {
    return null;
  }
};

class DropDownBase extends PureComponent {
  render() {
    const { value } = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Map value={value} />
        <Text style={{ fontSize: 18, }}>{value}</Text>
      </View>
    );
  }
}

DropDownBase.propTypes = {};

export default DropDownBase;
