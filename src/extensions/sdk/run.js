import {Account} from "@tonclient/appkit";
import {checkExtensions, getCurrentExtension} from "../extensions/checkExtensions";
import {DEXrootContract} from "../contracts/DEXRoot.js";
import {DEXclientContract} from "../contracts/DEXClient.js";
import {RootTokenContract} from "../contracts/RootTokenContract.js";
import {SafeMultisigWallet} from "../msig/SafeMultisigWallet.js";
import {
    getRootCreators,
    getShardConnectPairQUERY,
    checkPubKey,
    getClientBalance,
    transferFromGiver,
    pairs,
    getsoUINT,
    getAllDataPrep, getClientAddrAtRootForShard, checkSouint
} from "../webhook/script"

// TonClient.useBinaryLibrary(libWeb);

const Radiance = require('../Radiance.json');

function UserException(message) {
    this.message = message;
    this.name = "UserExeption";
}

function getShard(string) {
    return string[2];
}



/**
 * Function to send to root client pubkey
 * @author   max_akkerman
 * @return   callback         onSharding()
 */
export async function setCreator(curExt) {
    const {name, address, pubkey, contract, runMethod, callMethod, SendTransfer, internal} = curExt._extLib

    let checkClientExists = await checkPubKey(pubkey)

    if(checkClientExists.status){
        return {status:false, text:"pubkey checked - y already have dex client"}
    }else {
        try {

            const rootContract = await contract(DEXrootContract.abi, Radiance.networks['2'].dexroot);

            let checkClientExists = await getRootCreators()
            if(checkClientExists.creators["0x"+pubkey]){

                console.log("checkClientExists.creators[\"0x\"+pubkey]",checkClientExists.creators["0x"+pubkey])
                // await onSharding(curExt)
                return {status:"success", text:"setCreator success"}
            }
            let setCrStatus = await callMethod("setCreator", {giverAddr: address}, rootContract)
            console.log("setCrStatus",setCrStatus)
            let n = 0
            while (!checkClientExists.creators["0x"+pubkey]){

                checkClientExists = await getRootCreators()
                n++
                if(n>500){

                    return {status:false, text:"setCreator success"}
                }
            }
            // return await onSharding(curExt)
            return {status:"success", operation:"setCreator timeout, you tried too much, try again"}


            // return resp

        } catch (e) {
            console.log("catch E", e);
            return e
        }
    }
}


/**
 * Function to get shard id to deploy dex client
 * @author   max_akkerman
 * @return   callback         createDEXclient()
 */

export async function onSharding(pubkey) {
    console.log("curExt onSharding",pubkey)
    try {
        // const rootContract = await contract(DEXrootContract.abi, Radiance.networks['2'].dexroot);
        let targetShard = getShard(Radiance.networks['2'].dexroot);
        // console.log("pubkeypubkey",pubkey)
        let status = false;
        let n = 0;
        let clientAddress
        while (!status) {
            let response = await getClientAddrAtRootForShard(pubkey,n)
            // ("getClientAddress", {_answer_id:0,clientPubKey:'0x'+pubkey,clientSoArg:n}, rootContract)
            console.log("response",response)
            let clientAddr = response;
            // if(name==="broxus"){
            //     // console.log("response.value0",response.value0)
            //     clientAddr = response.value0._address;
            // }else{
            //     clientAddr = response.value0;
            // }
            let shard = getShard(clientAddr);
            if (shard === targetShard) {
                status = true;
                clientAddress = clientAddr;
                // console.log({address: clientAddr, keys: pubkey, clientSoArg: n})
                return {status:true, data:{address: clientAddr, keys: '0x'+pubkey, clientSoArg: n}}
                // return await createDEXclient(curExt, {address: clientAddr, keys: '0x'+pubkey, clientSoArg: n}).catch(e=>{return e})
                // return {address: clientAddr, keys: pubkey, clientSoArg: n}
            }
            if(n>1000){
                return {status:false, text:"sharding timeout, you tried too much, try again"}
            }
            n++;
        }
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to send to root client pubkey
 * @author   max_akkerman
 * @param   {object} shardData {address: clientAddr, keys: '0x'+pubkey, clientSoArg: n}
 * @return   {object} {deployedAddress:address,statusCreate:bool}
 */

export async function createDEXclient(curExt, shardData) {
    console.log("shardData",shardData)
    const {pubkey, contract, callMethod} = curExt._extLib

    try {
        const rootContract = await contract(DEXrootContract.abi, Radiance.networks['2'].dexroot);
        let createDEXclientStatus = await callMethod("createDEXclient", {
            pubkey: shardData.keys,
            souint: shardData.clientSoArg
        }, rootContract).catch(e => {
            console.log("createDEXclienteeeeee",e)
                let ecode = '106';
                let found = e.text.match(ecode);
                if(found){
                    return {status:false,text:"y are not registered at dex root, pls transfer some funds to dex root address"}
                }else{
                    return e
                }
            }
        )
console.log("createDEXclientStatus",createDEXclientStatus)
        let checkDexClientExists =  await checkPubKey(pubkey);
        let n=0
        console.log("checkDexClientExists",checkDexClientExists)
        while(!checkDexClientExists.status){
            console.log("checkDexClientExists",checkDexClientExists)
            checkDexClientExists =  await checkPubKey(pubkey);

            if(n>1500){
                console.log({status:false,text:"checking pubkey failed"})
                return {status:false,text:"checking pubkey failed"}
            }
            n++
        }
        return checkDexClientExists
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to transfer tons
 * @author   max_akkerman
 * @param   {curExt:object, addressTo:string, amount:number}
 * @return   {object} processSwapA
 */

export async function transfer(SendTransfer,addressTo,amount) {
    try {
        const transfer = await SendTransfer(addressTo,amount.toString())
        return transfer
    } catch(e) {
        console.log("e",e)
        return e
    }
}
/**
 * Function to swap A
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, qtyA:number}
 * @return   {object} processSwapA
 */

export async function swapA(curExt,pairAddr, qtyA) {
    console.log("qtyA",qtyA, typeof qtyA)
    const {pubkey, contract, callMethod,SendTransfer} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }

    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const processSwapA = await callMethod("processSwapA", {pairAddr:pairAddr, qtyA:Number(qtyA)}, clientContract)
        console.log("processSwapA",processSwapA)
        transferFromGiver(getClientAddressFromRoot.dexclient, 300000000).then(res=>console.log("sucess ended",res))
        return processSwapA
    } catch (e) {
        return e
    }
}

/**
 * Function to swap B
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, qtyB:number}
 * @return   {object} processSwapB
 */

export async function swapB(curExt,pairAddr, qtyB) {
    console.log("qtyB",qtyB)
    const {pubkey, contract, callMethod,SendTransfer} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }

    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const processSwapA = await callMethod("processSwapB", {pairAddr:pairAddr, qtyB:qtyB}, clientContract)
        transferFromGiver(getClientAddressFromRoot.dexclient, 300000000).then(res=>console.log("sucess ended",res))
        return processSwapA
    } catch (e) {
        console.log("catch E processSwapB", e);
        return e
    }

}

/**
 * Function to return liquid from pair, tokens - are the liquidityProvider tokens type
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, tokens:number}
 * @return   {object} returnLiquidity
 */


export async function returnLiquidity(curExt,pairAddr, tokens) {
    // let curExt = {};
    // await checkExtensions().then(async res => curExt = await getCurrentExtension(res))
    console.log(pairAddr, tokens.toFixed(),"pairAddr, tokens")
    const {pubkey, contract, SendTransfer, callMethod} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const returnLiquidity = await callMethod("returnLiquidity", {pairAddr:pairAddr, tokens: tokens.toFixed()}, clientContract)
        transferFromGiver(getClientAddressFromRoot.dexclient, 300000000).then(res=>console.log("sucess ended",res))
        return returnLiquidity
    } catch (e) {
        console.log("catch E returnLiquidity", e);
        return e
    }
}

/**
 * Function to process liquid
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, qtyA:number,qtyB:number}
 * @return   {object} processLiquidity
 */

export async function processLiquidity(curExt,pairAddr, qtyA, qtyB) {
    // let curExt = {};
    // await checkExtensions().then(async res => curExt = await getCurrentExtension(res))
    console.log("===============", typeof qtyA, typeof qtyB, "===============")

    let qtyAnum = Number(qtyA)
    let qtyBnum = Number(qtyB)
    console.log(pairAddr, qtyAnum, qtyBnum, "===============")
    const {pubkey, contract, SendTransfer, callMethod} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)

    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const processLiquidity = await callMethod("processLiquidity", {pairAddr:pairAddr, qtyA:qtyAnum.toFixed(), qtyB:qtyBnum.toFixed()}, clientContract)
        transferFromGiver(getClientAddressFromRoot.dexclient, 300000000).then(res=>console.log("sucess ended",res))
        return processLiquidity
    } catch (e) {
        console.log("catch E processLiquidity", e);
        return e
    }

}

/**
 * Function to connect To Pair
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string}
 * @return   {object} processLiquidity
 */

export async function connectToPair(curExt,pairAddr) {
    // console.log("pairAddr",pairAddr,"curExt",curExt)
    const {contract,callMethod,pubkey} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
// console.log("curPia",curPia)
    // transferFromGiver(getClientAddressFromRoot.dexclient, 4500000000).then(res=>console.log("secess transfered from giver",res))

    // let checkClientBalance = await getClientBalance(getClientAddressFromRoot.dexclient)
    // if(6000000000 > (checkClientBalance*1000000000)){
    //     await transfer(SendTransfer,getClientAddressFromRoot.dexclient,8000000000)
    // }
    // console.log("getClientAddressFromRoot",getClientAddressFromRoot)
    // let pairsTT = await pairs(getClientAddressFromRoot && getClientAddressFromRoot.dexclient)
    //
    //
    //   let curP = pairsTT[pairAddr]
    //
    //
    //
    // if(!curP){
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        let connectRes = await callMethod("connectPair", {pairAddr: pairAddr}, clientContract)
        // console.log("connectRes",connectRes)
        if (!connectRes || (connectRes && (connectRes.code === 1000 || connectRes.code === 3))) {
            return connectRes
        } else {
            return {
                pairAddr: pairAddr,
                callMethod: callMethod,
                contract: contract,
                clientAddress: getClientAddressFromRoot.dexclient,
                clientContract: clientContract
            }
        }
    } catch (e) {
        return e
    }
    // }else{
    //     return {status:true,text:"you are already connected to pair"}
    // }


}

export async function getClientForConnect(data) {
    const {pairAddr, clientAddress, contract, callMethod,clientContract} = data
    try {
        let soUINT = await getsoUINT(clientAddress)
        let pairsT = await pairs(clientAddress)
        let clientRoots = await getAllDataPrep(clientAddress)
        let curPair = null
        let n=0

        while (!curPair){
            pairsT = await pairs(clientAddress)
            curPair = pairsT[pairAddr]
            n++
            if(n>500){
                return {code:3,text:"time limit in checking cur pair"}
            }
        }
        // console.log("cure pair finded")
        return {...soUINT, curPair,clientAdr:clientAddress,callMethod,clientContract,contract:contract,clientRoots:clientRoots.rootKeysR}
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}



export async function connectToPairStep2DeployWallets(connectionData) {
    let { curPair,clientAdr,callMethod, clientContract,clientRoots} = connectionData;
    let targetShard = getShard(clientAdr);
    let cureClientRoots = [curPair.rootA,curPair.rootB,curPair.rootAB]
    console.log("cureClientRoots",cureClientRoots)
    console.log("clientRoots",clientRoots)
    let newArr = cureClientRoots.filter(function(item) {
        return clientRoots.indexOf(item) === -1;
    });
    if(newArr.length===0){
        return {code:3,text:"y already have all pair wallets"}
    }
let resArray = []

    try {
        for (const item of newArr) {
            // console.log("getting shard")
            let soUint = await getShardConnectPairQUERY(clientAdr, targetShard, item)

            console.log("getting shard",item,"soUint",soUint)
                    let connectRootRes = await callMethod("connectRoot", {
                        root: item,
                        souint: soUint,
                        gramsToConnector: 500000000,
                        gramsToRoot: 1500000000
                    }, clientContract)
                    resArray.push(connectRootRes)
                    console.log("connectRootRes.code", resArray)
                    if (connectRootRes.code) {
                        console.log("connectRootRes.code", connectRootRes.code)
                        return connectRootRes
                    }
        }
        return {status: "success", resArray: resArray}
    }catch(e){
        console.log("connectRoot e")
        return e
    }

    // let connectedItem = []
    // newArr.map(async (item,i)=> {
    //     connectedItem.push(await connectToPairDeployWallets(connectToRootsStatus,item))
    // })
    // console.log("connectedItem-----------------",connectedItem)
    // return {newArr:newArr,clientAdr:clientAdr,targetShard:targetShard,clientContract:clientContract,callMethod:callMethod}
}

// export async function connectToPairDeployWallets(data,item){
    // let { clientAdr,targetShard,clientContract,callMethod } = data
    // let soUint = await getShardConnectPairQUERY(clientAdr,targetShard,item)
    // console.log("connection to roots",soUint)
//     let connectStatus = await callMethod("connectRoot", {root: item, souint:soUint,gramsToConnector:500000000,gramsToRoot:1500000000}, clientContract)
//
// return {status:"success", connectStatus:connectStatus,connectedRoot:item}
        // )

// }
