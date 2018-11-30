/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { AsyncStorage, FlatList, Platform, SafeAreaView, StatusBar, Text, TextInput } from 'react-native';
import exChange from './src/services/api';
import styled from 'styled-components';
import currencies from './src/constants/currencies';
import CustomDropDown from './src/components/CustomDropDown';
import ListItem from './src/components/ListItem';


const AppBar = styled.View`
  min-height: 50px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #2058A5;
  padding: 20px 10px;
  margin: ${Platform.OS === 'ios' ? '-10px -10px' : '0px -10px'};
`;

const StatusBarBg = styled.View`
  background-color: #2058A5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 0px;
`;

const AppBarText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  font-family: Helvetica;
`;

const Base = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #e6edef;
  padding: 0px 10px 10px;
  position: relative;
`;

const InputBox = styled(TextInput)`
  flex: 2;
  min-height: 50px;
  padding: 10px;
  font-size: 18px;
  border-radius: 3px;
  border-width: 1px;
  border-color: #e4edf0;
  border-style: solid;
  background-color: #fff;
  margin-right: 10px;
`;


const ListHeader = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  background-color: #f9f9f9;
  border-bottom-color: #ddd;
  border-style: solid;
  margin: 0px 0 0;
`;

const ListHeaderText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

type Props = {};

type State = {
  conversions: any,
  fromValue: number | string,
  toValue: number | string,
  baseCurrency: string,
  convertedCurrency: string,
  loading: boolean,
}

export default class App extends Component<Props, State> {
  state = {
    conversions: '',
    fromValue: '',
    loading: true,
    toValue: '',
    baseCurrency: 'INR',
    convertedCurrency: 'USD',
  };

  getTimeDifference = (timestamp: number) => {
    if (typeof  timestamp === 'number') {
      return (Date.now() - timestamp)
    } else {
      return 360001;
    }
  };

  componentDidMount = async () => {
    const { baseCurrency } = this.state;

    const cachedConversions = JSON.parse(await AsyncStorage.getItem('conversions') || '{}');

    if (this.getTimeDifference(cachedConversions.timestamp) > 3600) {
      const api = new exChange();
      api
        .setBaseCurrency(baseCurrency)
        .latest()
        .then(a => {
          const response = {
            ...a.data,
            timestamp: Date.now(),
          };

          this.setState({
            loading: false,
            conversions: response,
          });

          AsyncStorage.setItem('conversions', JSON.stringify(response));
        })
        .catch(e => {
          // console.log(e);
        });
    } else {
      this.setState({
        loading: false,
        conversions: cachedConversions,
      });
    }
  };

  handleCurrencyChange = (mode) => {
    return (val) => {
      this.setState({
        [mode]: val
      }, () => {
        const { baseCurrency, convertedCurrency, fromValue, toValue } = this.state;

        const isBaseCurrencyChanged = mode === 'baseCurrency';

        if (!isBaseCurrencyChanged) {
          const conversions = this.getConversionsOnNewBase(baseCurrency);
          this.setState({
            toValue: conversions['rates'][convertedCurrency] * fromValue
          });

        } else {

          const conversions = this.getConversionsOnNewBase(baseCurrency);
          const currencyFactor = conversions['rates'][!isBaseCurrencyChanged ? baseCurrency : convertedCurrency];
          const pValue = (fromValue || '');

          const currencyValue = currencyFactor * pValue;

          this.setState({
            toValue: currencyValue,
          });
        }
      })
    }
  };

  computeCurrencyValues = (toCalculateFromTo: boolean = false) => {
    const { convertedCurrency, baseCurrency, fromValue, toValue } = this.state;

    const conversions = this.getConversionsOnNewBase(!toCalculateFromTo ? baseCurrency : convertedCurrency);
    if (conversions !== null) {
      const multiplier = parseFloat(toCalculateFromTo ? toValue : fromValue);
      if (!isNaN(multiplier) && 'number' === typeof multiplier) {
        return Object.keys(conversions.rates).reduce((total, curr) => {
          total.push({
            symbol: curr,
            value: conversions.rates[curr] * multiplier,
          });
          return total;
        }, []);
      }
      return null;
    }
    return null;
  };

  getConversionsOnNewBase = (newBase: string) => {
    const { conversions } = this.state;
    try {
      const reverseRate = 1 / conversions.rates[newBase];
      const convertedRates = Object.keys(conversions.rates).reduce((total, curr) => {
        total[curr] = conversions.rates[curr] * reverseRate;
        return total;
      }, {});

      return {
        ...conversions,
        base: newBase,
        rates: convertedRates,
      }
    } catch (e) {
      return null;
    }
  };

  handleAmountChange = (attr: string) => {
    return (val: number) => {
      const { convertedCurrency, baseCurrency } = this.state;

      const isFromValue = attr === 'fromValue';

      const conversions = this.getConversionsOnNewBase(isFromValue ? baseCurrency : convertedCurrency);
      const currencyFactor = conversions['rates'][!isFromValue ? baseCurrency : convertedCurrency];
      const pValue = (val || '');

      const currencyValue = currencyFactor * pValue;

      if (isFromValue) {
        this.setState({
          [attr]: isNaN(pValue) ? '' : pValue,
          toValue: isNaN(currencyValue) ? '' : currencyValue,
        });
      } else {
        this.setState({
          [attr]: isNaN(pValue) ? '' : pValue,
          fromValue: isNaN(currencyValue) ? '' : currencyValue,
        });
      }
    }
  };

  render() {
    const { fromValue, toValue, baseCurrency, convertedCurrency, loading } = this.state;

    if (loading) {
      return (
        <Base
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading…</Text>
        </Base>
      );
    }

    const otherConversions = this.computeCurrencyValues();


    return (
      <React.Fragment>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e6edef' }}>
          <StatusBarBg>
            <StatusBar
              backgroundColor="#2058A5"
              barStyle="light-content"
            />
          </StatusBarBg>
          <Base>
            <AppBar
              style={{
                shadowBlur: 3,
                shadowColor: '#aaa',
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: {
                  width: 2,
                  height: 4,
                },
                zIndex: 2,
                borderBottomWidth: 2,
                borderBottomColor: '#18437d',
              }}
            >
              <AppBarText>Currency Converter</AppBarText>
            </AppBar>
            <Row>
              <InputBox
                maxLength={15}
                placeholder="Enter amount"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                onChangeText={this.handleAmountChange('fromValue')}
                value={`${fromValue}`}
              />
              <CustomDropDown
                label={'From'}
                data={currencies}
                value={baseCurrency}
                onChangeText={this.handleCurrencyChange('baseCurrency')}
              />
            </Row>
            <Row>
              <InputBox
                maxLength={15}
                placeholder="Value"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                onChangeText={this.handleAmountChange('toValue')}
                value={`${toValue}`}
              />
              <CustomDropDown
                label={'Value'}
                data={currencies}
                value={convertedCurrency}
                onChangeText={this.handleCurrencyChange('convertedCurrency')}
              />
            </Row>

            {
              otherConversions !== null &&
              <FlatList
                style={{
                  marginTop: 20,
                }}
                stickyHeaderIndices={[0]}
                data={otherConversions}
                keyExtractor={(item) => item.symbol}
                ListHeaderComponent={() => (
                  <ListHeader>
                    <ListHeaderText>
                      {parseFloat(fromValue).toFixed(2)} {baseCurrency} in other currencies
                    </ListHeaderText>
                  </ListHeader>
                )}
                renderItem={({ item }) => {
                  return (<ListItem item={item} />);
                }}
              />
            }
          </Base>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}
