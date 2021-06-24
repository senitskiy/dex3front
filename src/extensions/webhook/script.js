import {DEXrootContract} from "../contracts/DEXRoot.js";
import {DEXclientContract} from "../contracts/DEXClient.js";
import {GContract} from "../contracts/GContract.js";
import {TONTokenWalletContract} from "../contracts/TONTokenWallet.js";
import {RootTokenContract} from "../contracts/RootTokenContract.js";
import {SafeMultisigWallet} from "../msig/SafeMultisigWallet.js";
import {DEXPairContract} from "../contracts/DEXPairContract.js";
import {abiContract, signerKeys} from "@tonclient/core";
// import {getWalletBalance} from "../sdk/run";
import {libWeb} from "@tonclient/lib-web";
import {store} from '../../index'
import {setSubscribeData} from '../../store/actions/wallet'

const { ResponseType } = require("@tonclient/core/dist/bin");
const {
    MessageBodyType,
    TonClient,
} = require("@tonclient/core");
const { Account } = require("@tonclient/appkit");
TonClient.useBinaryLibrary(libWeb);
const DappServer = "net.ton.dev"
const client = new TonClient({ network: { endpoints: [DappServer] } });

const Radiance = require('../Radiance.json');

function hex2a(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        let v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
}
function getShardThis(string) {
    return string[2];
}

let GiverAd = "0:ed069a52b79f0bc21d13da9762a591e957ade1890d4a1c355e0010a8cb291ae4"
export async function transferFromGiver(addr, count) {
    const gSigner = signerKeys({
        "public": "d7e584a9ef4d41de1060b95dc1cdfec6df60dd166abc684ae505a9ff48925a19",
        "secret": "742bba3dab8eb0622ba0356acd3de4fd263b9f7290fdb719589f163f6468b699"
    })

    const curGiverContract = new Account(GContract, {address: GiverAd, signer: gSigner,client});
    return await curGiverContract.run("pay", {
        addr, count
    });
}

export async function getShardConnectPairQUERY(clientAddress,targetShard,rootAddress) {
    let connectorSoArg0;
    let status = false;
    let n = 0;
    let shardC
    let connectorAddr

    const accClient = new Account(DEXclientContract, {address: clientAddress, client});
    const RootTknContract = new Account(RootTokenContract, {address:rootAddress, client});

    let shardW
    let walletAddr
    while (!status) {
        let response = await accClient.runLocal("getConnectorAddress", {_answer_id: 0, connectorSoArg: n})
        connectorAddr = response.decoded.output.value0;
        shardC = getShardThis(connectorAddr);
        if (shardC === targetShard) {
            let resp = await RootTknContract.runLocal("getWalletAddress", {_answer_id: 0, wallet_public_key_: 0, owner_address_: connectorAddr})
            walletAddr = resp.decoded.output.value0;
            shardW = getShardThis(walletAddr);
            if (shardW === targetShard) {
                connectorSoArg0 = n;
                status = true;
            } else {
                //console.log(n, 'second');
            }
        } else {
            //console.log(n, 'first');
        }
        n++;
    }


    return connectorSoArg0

}


export async function getRootCreators() {
    // try {
    const RootContract = new Account(DEXrootContract, {address:Radiance.networks['2'].dexroot, client});
    let RootCreators = await RootContract.runLocal("creators", {})
    return RootCreators.decoded.output
    // } catch (e) {
    //     console.log("catch E", e);
    //     return e
    // }
}
export async function getRootBalanceOF() {
    try {
        const RootContract = new Account(DEXrootContract, {address:Radiance.networks['2'].dexroot, client});

        let RootbalanceOf = await RootContract.runLocal("balanceOf", {})
        return RootbalanceOf.decoded.output
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to get balance of TOKENS in token wallets
 * @author   max_akkerman
 * @param   {string} walletAddress
 * @return   {number}
 */

export async function getWalletBalanceQUERY(walletAddress) {
    try {
        const curWalletContract = new Account(TONTokenWalletContract, {address:walletAddress, client});

        let curWalletBalance = await curWalletContract.runLocal("balance", {_answer_id:0})
        return curWalletBalance
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to check connected pair or not
 * @author   max_akkerman
 * @param   {string, string} clientAddress,pairAddress
 * @return   {bool}
 */

export async function checkClientPairExists(clientAddress,pairAddress) {
    const acc = new Account(DEXclientContract, {address: clientAddress, client});
    try{
        const response = await acc.runLocal("getAllDataPreparation", {});
        let clientPairs = response.decoded.output.pairKeysR

        let newArr = clientPairs.filter(item => item === pairAddress
        );
        return newArr.length !== 0;
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to get client wallets
 * @author   max_akkerman
 * @param   {string} clientAddress
 * @return   [{walletAddress:string,symbol:string,balance:number}]
 */


export async function getAllClientWallets(clientAddress) {
console.log("clientAddress____",clientAddress)
    const acc = new Account(DEXclientContract, {address: clientAddress, client});
    const response = await acc.runLocal("rootWallet", {});
    let normalizeWallets = []
    try {
        for (const item of Object.entries(response.decoded.output.rootWallet)) {

            const curWalletContract = new Account(TONTokenWalletContract, {address: item[1], client});
            const curRootContract = new Account(RootTokenContract, {address: item[0], client});

            let curWalletData = await curWalletContract.runLocal("getDetails", {_answer_id: 0})
            let curRootData = await curRootContract.runLocal("getDetails", {_answer_id: 0})
            let itemData = {};

            itemData.walletAddress = item[1];
            itemData.symbol = hex2a(curRootData.decoded.output.value0.symbol);
            itemData.balance = +curWalletData.decoded.output.value0.balance / 1000000000;
            normalizeWallets.push(itemData)
        }
        console.log("normalizeWallets",normalizeWallets)
        return normalizeWallets
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to check existing of dexclient at root
 * @author   max_akkerman
 * @param   {number} clientPubkey
 * @return   [{walletAddress:string,symbol:string,balance:number}]
 */

export async function checkPubKey(clientPubkey) {
    try {
        const RootContract = new Account(DEXrootContract, {address:Radiance.networks['2'].dexroot, client});

        let response = await RootContract.runLocal("checkPubKey", {pubkey:"0x"+clientPubkey})
        let checkedData = response.decoded.output;
        return checkedData
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to get all pairs on dex root
 * @author   max_akkerman
 * @param
 * @return   [{pairAddress:string,symbolA:string,reserveA:number,symbolB:string,reserveB:number,rateAB:nubmer,rateBA:number}]
 */

export async function getAllPairsWoithoutProvider() {
    const acc = new Account(DEXrootContract, {address: Radiance.networks["2"].dexroot, client});
    const response = await acc.runLocal("pairs", {});

    let normlizeWallets = []

    for (const item of Object.entries(response.decoded.output.pairs)) {

        const curRootTokenA = new Account(RootTokenContract, {address: item[1].root0, client});
        const curRootTokenB = new Account(RootTokenContract, {address: item[1].root1, client});
        const curRootTokenAB = new Account(RootTokenContract, {address: item[1].rootLP, client});
        const pairContract = new Account(DEXPairContract, {address: item[0], client});

        let bal = await pairContract.runLocal("balanceReserve", {})

        let curRootDataA = await curRootTokenA.runLocal("getDetails", {_answer_id:0})
        let curRootDataB = await curRootTokenB.runLocal("getDetails", {_answer_id:0})
        let curRootDataAB = await curRootTokenAB.runLocal("getDetails", {_answer_id:0})

        let itemData = {};
        itemData.pairAddress = item[0];

        // itemData.pairname = hex2a(curRootDataAB.decoded.output.value0.name)
        itemData.symbolA = hex2a(curRootDataA.decoded.output.value0.symbol) === 'WTON' ? 'TON' : hex2a(curRootDataA.decoded.output.value0.symbol)
        itemData.reserveA = bal.decoded.output.balanceReserve[item[1].root0]

        itemData.symbolB = hex2a(curRootDataB.decoded.output.value0.symbol) === 'WTON' ? 'TON' : hex2a(curRootDataB.decoded.output.value0.symbol)
        itemData.reservetB = bal.decoded.output.balanceReserve[item[1].root1]

        itemData.rateAB = +bal.decoded.output.balanceReserve[item[1].root1] / +bal.decoded.output.balanceReserve[item[1].root0]
        itemData.rateBA = +bal.decoded.output.balanceReserve[item[1].root0] / +bal.decoded.output.balanceReserve[item[1].root1]
        normlizeWallets.push(itemData)
        itemData.totalSupply = await getPairsTotalSupply(item[0])
    }
    return normlizeWallets

}

/**
 * Function to get native balance of address in tons
 * @author   max_akkerman
 * @param {string} clientAddress
 * @return   {number}
 */

export async function getClientBalance(clientAddress) {
console.log("clientAddress",clientAddress)
    let address = clientAddress
    if(clientAddress === "0:0000000000000000000000000000000000000000000000000000000000000000")return 0
    try {
        let clientBalance = await client.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    eq: address,
                },
            },
            result: "balance",
        });
        console.log("clientBalance",clientBalance)
        return +clientBalance.result[0].balance / 1000000000
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

const decode = {
    async message(abi, boc) {

        try {
            const decodedMessage = (
                await TonClient.default.abi.decode_message({
                    abi: abiContract(abi),
                    message: boc,
                })
            )
            return decodedMessage
        } catch (e) {
            // console.log(e)
            return e.code
        }
    },
}

async function body(abi, body, internal = true) {
    try {
        const decodedBody = (
            await TonClient.default.abi.decode_message_body({
                abi: abiContract(abi),
                body: body,
                is_internal: internal
            })
        )
        return decodedBody
    } catch (e) {
        console.log(e)
        return e.code
    }
}

export async function subscribe(address) {

    let subscribeID = (await client.net.subscribe_collection({
        collection: "messages",
        filter: {
            dst: { eq: address },
        },
        limit:1,
        order:[{path:"created_at",direction:'DESC'}],
        result: "id boc created_at body dst src",
    }, async (params,responseType) => {

        if (responseType === ResponseType.Custom) {
            let decoded = await decode.message(DEXrootContract.abi, params.result.boc)
            if (decoded === 304) {decoded = await decode.message(RootTokenContract.abi, params.result.boc)}
            if (decoded === 304) {decoded = await decode.message(TONTokenWalletContract.abi, params.result.boc)}
            if (decoded === 304) {decoded = await decode.message(SafeMultisigWallet.abi, params.result.boc)}
            if (decoded === 304) {decoded = await decode.message(DEXPairContract.abi, params.result.boc)}
            if (decoded === 304) {decoded = await decode.message(DEXclientContract.abi, params.result.boc)}

            if(params.result.src === GiverAd){
                console.log("from giver",params)
                return
            }

            if(decoded.name === "accept"){
                console.log("decoded.name",decoded)
                setTimeout(()=>store.dispatch(setSubscribeData({transactionID:params.result.id, src:params.result.src,dst:params.result.dst,created_at:params.result.created_at, amountOfTokens:  decoded.value ? decoded.value.tokens : 0})),2000)
                return
            }
console.log("decoded",decoded,"params",params)

            if(decoded.value && decoded.value.grams){
                return null
            }
            let caseID = await checkMessagesAmount({transactionID:params.result.id, src:params.result.src,dst:params.result.dst,created_at:params.result.created_at, amountOfTokens: decoded.value.tokens})
            if(caseID && caseID.dst) store.dispatch(setSubscribeData(caseID));
        }
    })).handle;
    return {status:"success", subscribedAddress: address}
}
let checkerArr = [];
let checkMessagesAmount = function(messageID){
    for (let i = 0; i < checkerArr.length; i++) {
        if (checkerArr[i].transactionID === messageID.transactionID) {
            return null
        }
    }
    checkerArr.push(messageID)
    return messageID
}

export async function getPairsTotalSupply(pairAddress) {
    const acc = new Account(DEXPairContract, {address: pairAddress, client});
    try{
        const response = await acc.runLocal("totalSupply", {});
        let pairTotalSupply = response.decoded.output.totalSupply;
        return pairTotalSupply
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}



export async function getAllDataPreparation(clientAddress) {
    const acc = new Account(DEXclientContract, {address: clientAddress, client});
    try{
        const response = await acc.runLocal("rootWallet", {});
        return response.decoded.output.rootWallet;
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

const secretKeys = {
    "0:8ed631b2691e55ddc65065e0475d82a0b776307797b31a2683a3af7b5c26b984": {"public":"0ce403a4a20165155788f0517d1a455b4f1e82899f3782fadcf07413b2a56730","secret":"e91e2e4e61d35d882a478bb21f77184b9aca6f93faedf6ed24be9e9bf032ef55"},
    "0:d214d4779f63e062569a39d414a98c9891cf5e97cc790a3e6c62ce5fd0a5e1c9": {"public":"cdc97359b239a115d61364526052da837a85d396fa7cca76da015942657c9fad","secret":"f5a05c6211db62ff076fb25a7c349033123f2a0b9aea97b673f2b83e378b3824"},
    "0:0fa9e2a9993f55f41c90b050468f2f7909a391b7de3cb1b3df74bf449b4dae4c": {"public":"f574ac4095a3d3d8b267e4300bac4825ece723ed2569238a860149b683201a5c","secret":"96975ca89e99116a97a4850f0cc962e8d2630a80e4568d76b8e2f94a7addf312"},
    "0:d1828255dc48d7db45e9e36c6ef5852319ecb6376bf95bf4e7c1a77d9f3590e0": {"public":"04a88959a0b1b1655894343714ce7bc7c516c8195407ab6c8de8b64c92e7f172","secret":"cd69d372dacd5f8fd0f8e6db120205bb128507df76b02064f6d01d90e8e3be04"}
};

export async function mintTokens(walletAddress, clientAddress) {
    const countToken = 100
    const rootData = await getAllDataPreparation(clientAddress.dexclient);
    let rootAddress = "";
    for(let walletId in rootData) {
        if(rootData.hasOwnProperty(walletId)) {
            let wallet = rootData[walletId];
            if(wallet === walletAddress) rootAddress = walletId;
        }
    }
    console.log("rootData",rootData)
    const signer = signerKeys(secretKeys[rootAddress]);

    const curRootContract = new Account(RootTokenContract, {address: rootAddress, signer, client});
    let usersGiver = []
    if(localStorage.getItem("usersGiver") === null) {
        localStorage.setItem("usersGiver", JSON.stringify(usersGiver))
    }
    else usersGiver = JSON.parse(localStorage.getItem("usersGiver"));
    console.log("rootData[rootAddress]",rootData[rootAddress])
    if(usersGiver.includes(rootData[rootAddress]) === false) {
        await transferFromGiver(rootData[rootAddress], 120000000)
        usersGiver.push(rootData[rootAddress])
    }
    localStorage.setItem("usersGiver", JSON.stringify(usersGiver))

    let resf = await curRootContract.run("mint", {
        tokens: countToken*1e9,
        to: rootData[rootAddress]
    }).catch(e => {
        console.log("token giver error", e)
            return e
        }
    )
    console.log("resf",resf)
}
