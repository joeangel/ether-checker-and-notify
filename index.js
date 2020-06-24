#!/usr/bin/env node
const web3 = require('web3');
const config = require('./config');
const provider = new web3.providers.HttpProvider(config.networks[config.erc721_networkId].provider);
const Web3 = new web3(provider);

Web3.eth.getBalance(config.wallet_address)
.then((s) => {
  len = s.length;
  console.log(`${s.substr(0,s.length-18)||0}.${s.slice(-18)}`);
});
