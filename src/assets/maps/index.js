const mappings = {
  USD: require('./USD.png'),
  JPY: require('./JPY.png'),
  EUR: require('./EUR.png'),
  BGN: require('./BGN.png'),
  CZK: require('./CZK.png'),
  DKK: require('./DKK.png'),
  GBP: require('./GBP.png'),
  HUF: require('./HUF.png'),
  PLN: require('./PLN.png'),
  RON: require('./RON.png'),
  SEK: require('./SEK.png'),
  CHF: require('./CHF.png'),
  ISK: require('./ISK.png'),
  NOK: require('./NOK.png'),
  HRK: require('./HRK.png'),
  RUB: require('./RUB.png'),
  TRY: require('./TRY.png'),
  AUD: require('./AUD.png'),
  BRL: require('./BRL.png'),
  CAD: require('./CAD.png'),
  CNY: require('./CNY.png'),
  HKD: require('./HKD.png'),
  IDR: require('./IDR.png'),
  ILS: require('./ILS.png'),
  INR: require('./INR.png'),
  KRW: require('./KRW.png'),
  MXN: require('./MXN.png'),
  MYR: require('./MYR.png'),
  NZD: require('./NZD.png'),
  PHP: require('./PHP.png'),
  SGD: require('./SGD.png'),
  THB: require('./THB.png'),
  ZAR: require('./ZAR.png'),
};

export default (value) => {
  if (mappings[value] !== undefined) {
    return mappings[value];
  } else {
    return undefined;
  }
}
