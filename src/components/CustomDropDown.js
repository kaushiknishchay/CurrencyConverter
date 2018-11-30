import React from 'react';
import DropDownBase from './DropDownBase';
import Dropdown from 'react-native-material-dropdown/src/components/dropdown/index';


const CustomDropDown = (props) => {
  return (
    <Dropdown
      renderBase={(baseProps) => <DropDownBase {...baseProps} />}
      rippleInsets={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      renderAccessory={() => null}
      containerStyle={{
        flex: 1,
        borderRadius: 3,
        padding: 4,
        backgroundColor: '#fff',
        height: 50,
      }}
      valueExtractor={(item) => item.symbol}
      labelExtractor={(item) => item.name}
      {...props}
    />
  );
};

export default CustomDropDown;
