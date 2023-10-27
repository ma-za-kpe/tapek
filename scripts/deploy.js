const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  console.log("Deployment started!");

  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log(`Deploying the contract with the account: ${address}`);

  const TapekContract = await hre.ethers.getContractFactory("TapekContract");
  const contract = await TapekContract.deploy();

  console.log(`TapekContract deployed to ${contract.address}`);
}

main().catch(error => {
  console.log(error);
  process.exitCode = 1;
});
