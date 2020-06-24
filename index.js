#!/usr/bin/env node
const web3 = require('web3');
const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const provider = new web3.providers.HttpProvider(config.networks[config.erc721_networkId].provider);
const Web3 = new web3(provider);

let ether_balance;
let show_log = (str) => {
  const now = new Date();
  console.log(`${new Date().toJSON()} ${str}`);
};
let notify = (str) => {
  const now = new Date();
  const text = `${new Date().toJSON()} ${str}`;
  console.log(`Send to Telegram: \x1b[34m${text}\x1b[0m`);
  let telegram_send = (config, text);
};
let telegram_send = (config, text) => {
  const {chat_id, token} = config.telegram;
  const polling = false;
  const bot = new TelegramBot(token, {polling});
  try {
    bot.sendMessage(chat_id, text);
  } catch(e) {
    console.log("telegram_send error", e);
  }
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
  ether_balance = last_ether_balance;
  let text;
  if (typeof ether_balance === 'undefined') {
    text = `Init! Balance: ${last_ether_balance}ETH`;
    show_log(text);
    notify(text);
    return;
  }
  text = `changed! Balance: ${last_ether_balance}ETH`;
  show_log(text);
  notify(text);
};

// runner
main(config.wallet_address);
setInterval(main, config.time_interval*1000, config.wallet_address);
