require('dotenv').config('.env');
var { Web3 } = require('web3');
fs = require('fs');

const walletAddress = "0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e";

async function getGnoBalance() {
    const gnoAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"dutchAuction","type":"address"},{"name":"owners","type":"address[]"},{"name":"tokens","type":"uint256[]"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    const web3 = await new Web3(process.env.ETHEREUM_RPC);
    const gno = await new web3.eth.Contract(gnoAbi, "0x6810e776880c02933d47db1b9fc05908e5386b96");
    const  gnoBalance = await gno.methods.balanceOf(walletAddress).call();
    const balance = await Math.round((Number(gnoBalance) / 10e17) * 1000) / 1000;
    return balance;
}

async function getGnoPrice() {
    const options = await {method: 'GET', headers: {accept: 'application/json'}};
    const response = await fetch(('https://api.coingecko.com/api/v3/simple/price?ids=gnosis&vs_currencies=usd&x_cg_demo_api_key='+process.env.COINGECKO_DEMO_API_KEY), options);
    const json = await response.json();
    const output = json.gnosis.usd;
    return output;
}

async function getGnoValue() {
    balance = await getGnoBalance();
    price = await getGnoPrice();
    var value = await Math.round(((Number(balance)) * price) * 100) / 100;
    return value
}

// getGnoBalance();
// getGnoPrice();
// getGnoValue();

module.exports = { getGnoBalance, getGnoValue };

// node src/components/scripts/portfolio/gno.js