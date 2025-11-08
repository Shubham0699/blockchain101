import 'dotenv/config';
import { Command } from 'commander';
import { ethers } from 'ethers';
import {JsonRpcProvider , formatEther} from 'ethers';
import fs from 'fs';

const program = new Command();
const RPC = process.env.RPC_URL || 'http://127.0.0.1:8545';
const provider = new JsonRpcProvider(RPC);

const PK=process.env.PRIVATE_KEY;
if(!PK) {
    console.warn("private key not set, invoke command will fail");
}

const wallet = new ethers.Wallet(PK, provider);

program
.name('chain-cli')
.description('simple blockchain cli tool');

program
.command('balance <address>')
.description('gives the balance of that address/account')
.action(async (address) =>{
    try{
    const b = await provider.getBalance(address)
    console.log(address,'balance',formatEther(b),'eth')
    } catch(err){
        console.log('error getting balance:', err.message);
    }

});

program
.command('call <address> <abiPath> <method> [args...]')
.description('read-only call')
.action(async( address, abiPath , method, args)=>{
    try{
        const abiFile = JSON.parse(fs.readFileSync(abiPath));
        const abi = abiFile.abi;
        const c = new ethers.Contract(address, abi, provider);
        const res = await c[method](...args);
        console.log('result:',res.toString ? res.toString():res);
    }
    catch(err){
        console.log("error calling function:",err.message);
    }

});

program
.command('invoke <address> <abiPath> <method> [args...]')
.option('--value --<valueInEth>','ether value to send','0')
.description('invoking the contract commands')
.action(async(address,abiPath,method,args=[],options)=>{

    try{
        const abiFile= JSON.parse(fs.readFileSync(abiPath));
        const abi = abiFile.abi;
        const contract = new ethers.Contract(address,abi,wallet);

        const overrides={};
        if(options.value && options.value !=='0') overrides.value=ethers.utils.parseEther(options.value);

        const txresp = await contract[method](...args,overrides);
        console.log("tx hash:",txresp.hash);

        const receipt = await txresp.wait();
        console.log("mined to block:",receipt.blockNumber,'gasUsed:',receipt.gasUsed.toString());
    }
    catch(err){
        console.log("can not invoke function",err.message);
    }



    
})




program.parse(process.argv);