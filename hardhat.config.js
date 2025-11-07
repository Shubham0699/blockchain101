require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const {
  RPC_URL,
  PRIVATE_KEY,
  SEPOLIA_RPC_URL,
  PRIVATE_KEY_TESTNET,
  ETHERSCAN_API_KEY,
  COINMARKETCAP_API_KEY
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: RPC_URL || "http://127.0.0.1:8545"
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts:
        PRIVATE_KEY_TESTNET && PRIVATE_KEY_TESTNET.length > 0
          ? [PRIVATE_KEY_TESTNET]
          : []
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || ""
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY || ""
  }
};
