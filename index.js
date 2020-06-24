#!/usr/bin/env node
const web3 = require('web3');
const config = require('./config');
const provider = new web3.providers.HttpProvider(config.networks[config.erc721_networkId].provider);
const Web3 = new web3(provider);

let ether_balance;
let show_log = (str) => {
  const now = new Date();
  console.log(`${new Date().toJSON()} ${str}`);
};
let check = async (_wallet_address) => {
  const res = await Web3.eth.getBalance(_wallet_address);
  const len = res.length;
  let s = `${res.substr(0, res.length-18) || 0}.${res.slice(-18)}`;
  return s;
};
let main = async (_wallet_address) => {
  show_log('Check balance..');
  const last_ether_balance = await check(_wallet_address);
  if (last_ether_balance === ether_balance) return;
  if (typeof ether_balance === 'undefined') show_log(`Init! Balance: ${last_ether_balance}ETH`);
  else show_log(`changed! Balance: ${last_ether_balance}ETH`);
  ether_balance = last_ether_balance;
};

// runner
main(config.wallet_address);
setInterval(main, config.time_interval*1000, config.wallet_address);
