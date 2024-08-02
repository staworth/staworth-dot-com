require('dotenv').config('.env');
var { Web3 } = require('web3');
fs = require('fs');
const { getMooLpBifiValue, getBifiBalance } = require('./portfolio/bifi.js');
const { getGnoBalance, getGnoValue } = require('./portfolio/gno.js');
const { getEthBalance, getEthValue } = require('./portfolio/eth.js')

const walletAddress = "0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e";

async function updatePortfolio() {
    var json = JSON.parse(fs.readFileSync("src/components/data/portfolio.json").toString());

    // BIFI Balance
    var bifiBalance = await getBifiBalance();
    json["bifi"]["balance"] = bifiBalance;

    // BIFI Value
    var bifiValue = await getMooLpBifiValue();
    json["bifi"]["value"] = bifiValue;

    // GNO Balance
    var gnoBalance = await getGnoBalance();
    json["gno"]["balance"] = gnoBalance;

    // GNO Value
    var gnoValue = await getGnoValue();
    json["gno"]["value"] = gnoValue;

    // ETH Balance
    var ethBalance = await getEthBalance();
    json["eth"]["balance"] = ethBalance;

    // ETH Value
    var ethValue = await getEthValue();
    json["eth"]["value"] = ethValue;

    // Total Value
    var totalValue = await getMooLpBifiValue() + await getGnoValue() + await getEthValue();
    json["total"]["value"] = totalValue;

    fs.writeFileSync("src/components/data/portfolio.json", JSON.stringify(json));
}

updatePortfolio()

// node src/components/scripts/portfolio.js