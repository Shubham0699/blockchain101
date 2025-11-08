
const {ethers} = require ('hardhat');
const  fs  = require ('fs');

async function main(){
const bankVaultfactory = await ethers.getContractFactory('bankVault');
console.log("deploying contract...");
const deployed = await bankVaultfactory.deploy();
await deployed.waitForDeployment();
const address = await deployed.getAddress();
console.log(`bank vault deployed at ${address}`);



}



main();