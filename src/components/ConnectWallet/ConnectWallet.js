import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {closeConnecting, setCurExt, setWalletIsConnected, showPopup} from '../../store/actions/app';
import {setLiquidityList, setPairsList, setPubKey, setTokenList, setWallet} from '../../store/actions/wallet';
import { setSwapFromToken, setSwapToToken } from '../../store/actions/swap';
import { setPoolFromToken, setPoolToToken } from '../../store/actions/pool';
import {
    getAllClientWallets,
    getClientBalance,
    checkPubKey,
    subscribe,
    getRootBalanceOF,
    getAllPairsWoithoutProvider, checkClientPairExists, subscribeClient
} from '../../extensions/webhook/script.js';
import {setCreator, transfer, onSharding, createDEXclient} from '../../extensions/sdk/run';
import MainBlock from '../MainBlock/MainBlock';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import './ConnectWallet.scss';
const Radiance = require('../../extensions/Radiance.json');
function ConnectWallet() {
    const dispatch = useDispatch();
    const history = useHistory();
    let curExt = useSelector(state => state.appReducer.curExt);

    let swapFromToken = useSelector(state => state.swapReducer.fromToken);
    let swapToToken = useSelector(state => state.swapReducer.toToken);

    let poolFromToken = useSelector(state => state.poolReducer.fromToken);
    let poolToToken = useSelector(state => state.poolReducer.toToken);

    const [currentStatus, setcurrentStatus] = useState("Connecting wallet")

    useEffect(async () => {
        let pubKey = await checkPubKey(curExt._extLib.pubkey);
        let msigAd = curExt._extLib.address;
        if(!pubKey.status) {
            let balanceOF = await getRootBalanceOF()
            if(!balanceOF.balanceOf[msigAd]) {
                setcurrentStatus("transfer - transferring funds to root")
                let tranferToDex = await transfer(curExt._extLib.SendTransfer, Radiance.networks['2'].dexroot, 10000000000)
                if (tranferToDex && tranferToDex.code) {
                    console.log("tranferToDex",tranferToDex)
                    if(tranferToDex.code===2){
                        //TODO check codes and popup
                        console.log("tranferToDex WITH CODE 2")
                        dispatch(closeConnecting());
                        dispatch(showPopup({type: 'error', message: 'Deploy wallet pls'}));
                        dispatch(setCurExt(""));
                    }
                    dispatch(closeConnecting());
                    dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
                    dispatch(setCurExt(""));
                    setcurrentStatus("Connecting wallet")
                    return
                }
            }
            setcurrentStatus("setCreator - registering your wallet on dex")
                let dexCLientStatus = await setCreator(curExt);
            console.log("dexCLientStatus",dexCLientStatus)
            if((dexCLientStatus && dexCLientStatus.code) || !dexCLientStatus.status){
                setcurrentStatus("Connecting wallet")
                dispatch(closeConnecting());
                dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
                dispatch(setCurExt(""));
                return
            }else if(dexCLientStatus.status){
                setcurrentStatus("onSharding - looking for the best shard for you")
                console.log("i am on sharding")
                let onShardingStatus = await onSharding(curExt._extLib.pubkey)
                console.log("onSharding",onShardingStatus)
                if(onShardingStatus.status){
                    setcurrentStatus("createDEXclient - last step deploy dex client")
                    let createCLientStatus = await createDEXclient(curExt,onShardingStatus.data)
                    if(!createCLientStatus.status){
                        dispatch(closeConnecting());
                        dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
                        dispatch(setCurExt(""));
                        setcurrentStatus("Connecting wallet")
                    }
                    console.log("createCLientStatus",createCLientStatus)
                }else{
                    dispatch(closeConnecting());
                    dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
                    dispatch(setCurExt(""));
                    setcurrentStatus("Connecting wallet")
                }
            }



        }

        console.log("i am here")
        pubKey = await checkPubKey(curExt._extLib.pubkey);
        try {
            let msgiAddress = curExt._extLib.address;
            let msigBalance = await getClientBalance(msgiAddress);

            const pairs = await getAllPairsWoithoutProvider();

            let arrPairs = [];
            await pairs.map(async item=>{
                item.exists = await checkClientPairExists(pubKey.dexclient, item.pairAddress)
                console.log("item.exists" + item.exists)
                arrPairs.push(item)
            })
            console.log("arrPairs:" + arrPairs)        
            dispatch(setPairsList(arrPairs));


            let tokenList = await getAllClientWallets(pubKey.dexclient);
            let liquidityList = [];

            if(tokenList.length) {
                tokenList.forEach(async item => await subscribe(item.walletAddress));

                liquidityList = tokenList.filter(i => i.symbol.includes('/'));

                tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
                    {
                        ...i,
                        symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
                    })
                );

                dispatch(setTokenList(tokenList));
                dispatch(setLiquidityList(liquidityList));
                //localStorage.setItem('tokenList', JSON.stringify(tokenList));
                //localStorage.setItem('liquidityList', JSON.stringify(liquidityList));
            }
            const clientBalance = await getClientBalance(pubKey.dexclient);
            dispatch(setPubKey(pubKey));
            dispatch(setWallet({id: pubKey.dexclient, balance: clientBalance}));

            localStorage.setItem('pubKey', JSON.stringify(pubKey));
            localStorage.setItem('wallet', JSON.stringify({id: pubKey.dexclient, balance: clientBalance}));
            tokenList.forEach(i => {
                if(swapFromToken.symbol === i.symbol) {
                    swapFromToken.balance = i.balance;
                    swapFromToken.walletAddress = i.walletAddress;
                    dispatch(setSwapFromToken(swapFromToken));
                } else if(swapToToken.symbol === i.symbol) {
                    swapToToken.balance = i.balance;
                    swapToToken.walletAddress = i.walletAddress;
                    dispatch(setSwapToToken(swapToToken));
                } else if(poolFromToken.symbol === i.symbol) {
                    poolFromToken.balance = i.balance;
                    poolFromToken.walletAddress = i.walletAddress;
                    dispatch(setPoolFromToken(poolFromToken));
                } else if(poolToToken.symbol === i.symbol) {
                    poolToToken.balance = i.balance;
                    poolToToken.walletAddress = i.walletAddress;
                    dispatch(setPoolToToken(poolToToken));
                }
            })

            dispatch(setWalletIsConnected(true));
            await subscribeClient(pubKey.dexclient)
            dispatch(closeConnecting());
            history.push("/swap")
        } catch (err) {
            console.log(err);
            dispatch(closeConnecting());
            dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
        }
    }, []);

    return (
        <MainBlock
            smallTitle={true}
            normalTitle={true}
            title={currentStatus}
            button={<CloseBtn func={closeConnecting} />}
            content={
                <div className="connect-wallet-center">
                    <Loader />
                    <span className="connect-wallet-init-text">Initializing</span>
                </div>
            }
        />
    )
}

export default ConnectWallet;
