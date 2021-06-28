import freeton from "freeton";
import "core-js/stable";
import "regenerator-runtime/runtime";
import ton, {Address, AddressLiteral, Contract, hasTonProvider} from 'ton-inpage-provider';

const {DEXrootContract} = require('./../DEXroot');
const {DEXclientContract} = require('./../DEXclient');

export async function checkExtensions() {
    return [
        {
            name: "extraton",
            available: await checkExtensionAvailability(),
            link: "https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm",
        },
        {
            name: "broxus",
            available: await hasTonProvider(),
            link: "https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk",
        }
    ]
}

async function checkExtensionAvailability() {
    return window.freeton !== undefined;
}

export async function getCurrentExtension(extension) {
    let curExtension = {};
    // if(curExtension.length === 0){
    //     console.log("0000000>>>>>>no extension",curExtension)
    //     extensionsArry[0]._extLib = await extraton()
    //     extensionsArry[0].name = "testing extraton"
    //     return extensionsArry[0]
    // }
    if (extension === "extraton") {
        curExtension._extLib = await extraton()
    } else {
        curExtension._extLib = await broxus()
    }

    // if (curExtension.length > 1) {
    //     return curExtension[0]
    // }
    return curExtension
}


async function extraton() {

    const provider = getProvider();
    const signer = await provider.getSigner();

    let curExtenson = {};
    curExtenson.name = "extraton";
    curExtenson.address = signer.wallet.address;
    curExtenson.pubkey = await signer.getPublicKey();
    curExtenson.contract = (contractAbi, contractAddress) => {
        return new freeton.Contract(signer, contractAbi, contractAddress)
    };
    curExtenson.runMethod = async (methodName, params, contract) => {
        return await contract.methods[methodName].run(params)
    };
    curExtenson.callMethod = async (methodName, params, contract) => {
        return await contract.methods[methodName].call(params)
    };
    curExtenson.SendTransfer = async (to,amount) => {
        let wallet = signer.getWallet()
        return await wallet.transfer(to, amount, false,"")
    }
    return curExtenson
}

function getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
}



async function broxus() {

    await ton.ensureInitialized();
    const {accountInteraction} = await ton.requestPermissions({
        permissions: ['tonClient', 'accountInteraction']
    });
    if (accountInteraction == null) {
        return new Error('Insufficient permissions');
    }
    let curExtenson = {};

    curExtenson.name = "broxus";
    curExtenson.address = accountInteraction.address._address;
    curExtenson.pubkey = accountInteraction.publicKey;
    curExtenson.contract = (contractAbi, contractAddress) => {
        return new Contract(contractAbi, new AddressLiteral(contractAddress))
    };
    curExtenson.runMethod = async (methodName, params, contract) => {
        return await contract.methods[methodName](params).call({cachedState: undefined})
    };
    curExtenson.callMethod = async (methodName, params, contract) => {
        return await contract.methods[methodName](params).sendExternal({publicKey: accountInteraction.publicKey}).catch(e=> {
            return e
        })
    };
    curExtenson.internal = async (methodName, params, contract) => {
        return await contract.methods[methodName](params).send({
            from: new Address(curExtenson.address),
            amount: "10000000000",
            bounce: false
        })
    };
    curExtenson.SendTransfer = async (to,amount) => {
        return await ton.sendMessage({
            sender: curExtenson.address,
            recipient: new Address(to),
            amount: amount,
            bounce: false
        })
    }

    // const { transaction } = await ton.rawApi.sendMessage({
    //     sender: curExtenson.address,
    //     recipient: new Address(curExtenson.address),
    //     amount: '10000000000',
    //     bounce: false,
    //     payload: {
    //     //   abi: DePoolAbi,
    //     //   method: 'addOrdinaryStake',
    //     //   params: {
    //     //     stake: '10000000000'
    //     //   }
    //     }
    //   });
    console.log(curExtenson);

    return curExtenson
}


