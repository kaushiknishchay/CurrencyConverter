import React from 'react';
import styled from 'styled-components';
import { Map } from './DropDownBase';
import _ from 'lodash';
import currencies from '../constants/currencies';


const ItemBase = styled.View`
  padding: 20px 10px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const CurrencyName = styled.Text`
  font-size: 15px;
  flex: 2;
  margin-left: 20px;
`;

const CurrencyValue = styled.Text`
  font-size: 18px;
  margin-left: 10px;
`;

const ListItem = ({ item }) => {
  const currency = _.find(currencies, { symbol: item.symbol });
  console.log('currency', currency, item);
  return (
    <ItemBase>
      <Map value={item.symbol} />
      <CurrencyName>
        {currency.name || '-'}
      </CurrencyName>
      <CurrencyValue>
        {item.value.toFixed(2)}
      </CurrencyValue>
    </ItemBase>
  );
};

export default ListItem;
