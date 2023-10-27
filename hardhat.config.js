
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {},
    // polygon_mumbai: {
    //   url: "https://rpc-mumbai.maticvigil.com",
    //   accounts: [keys.DEPLOY_PRIVATE_KEY]
    // }
  },
  // etherscan: {
  //   apiKey: keys.POLYGON_API_KEY
  // },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};



// module.exports = {
//   defaultNetwork: "polygon_mumbai",
//   networks: {
//     hardhat: {
//     },
//     polygon_mumbai: {
//       url: "https://rpc-mumbai.maticvigil.com",
//       accounts: [process.env.PRIVATE_KEY]
//     }
//   },
//   etherscan: {
//     apiKey: process.env.POLYGONSCAN_API_KEY
//   },
//   solidity: {
//     version: "0.8.9",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
// }