import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from 'react-redux';
import {hideClientWalletsFromSelect} from '../../store/actions/clientWallets';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import MainBlock from "../MainBlock/MainBlock";
import SearchInput from '../SearchInput/SearchInput';
import Item from '../Item/Item';
import './ClientWallets.scss';
import {
    checkClientPairExists,
    checkwalletExists,
    getAllClientWallets, getAllPairsWoithoutProvider, subscribe,
} from "../../extensions/webhook/script";
import {setLiquidityList, setPairsList, setTokenList} from "../../store/actions/wallet";

function ClientWallets(props) {

    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    const wallet = useSelector(state => state.walletReducer.wallet);
    const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
    const tokenList = useSelector(state => state.walletReducer.tokenList);
    const LPTokenList = useSelector(state => state.walletReducer.liquidityList);
console.log("tokenList",tokenList,"LPTokenList",LPTokenList)

    const [at,setAT] = useState(toArray(tokenList, LPTokenList))
    function toArray(tokenList2, LPTokenList2){
        let toArr = [];
        tokenList2.map((i) => {
            toArr.push({
                symbol: i.symbol,
                balance: i.balance,
                walletAddress: i.walletAddress,
                lp: false
            })
        })
        LPTokenList2.map((i) => {
            toArr.push({
                symbol: i.symbol,
                balance: i.balance,
                walletAddress: i.walletAddress,
                lp: true
            })
        })
        return toArr
    }

    //console.log(LPTokenList);
useEffect(()=>{
    if(!walletIsConnected){
        return
    }
    setAT(toArray(tokenList, LPTokenList))
console.log("--------------------",tokenList,LPTokenList)

},[tokenList,LPTokenList])

useEffect(async ()=>{
    if(!walletIsConnected){
        return
    }
    let allWallets = await getAllClientWallets(wallet && wallet.id)
    if(allWallets.length === (tokenList.length + LPTokenList.length)) return;
    if(allWallets.length > (tokenList.length + LPTokenList.length)){


        allWallets.forEach(async item => await subscribe(item.walletAddress));
let liquidityListST = allWallets.filter(i => i.symbol.includes('/'));

let tokenListST = allWallets.filter(i => !i.symbol.includes('/'));

    //localStorage.setItem('tokenList', JSON.stringify(tokenListST));
    //localStorage.setItem('liquidityList', JSON.stringify(liquidityListST));

    tokenListST.map((i) => {
        i.lp = false;
    })
    liquidityListST.map((i) => {
       i.lp = true;
    })
        setAT([...tokenListST, ...liquidityListST])
    dispatch(setTokenList(tokenListST));
    dispatch(setLiquidityList(liquidityListST));



    return
    // setAT(toArray(tokenListST, liquidityListST))
}

    let changeba = allWallets && allWallets.filter(item=>{
        let curBD = at.filter(item2=>item2.walletAddress === item.walletAddress)
        console.log("curItem1",item, "curBD",curBD)
        //TODO CHECK console.log curDB
        if(!curBD.length) return
        return curBD[0].balance !== item.balance

    })

    if(changeba.length){

        let liquidityListST = allWallets.filter(i => i.symbol.includes('/'));

        let tokenListST = allWallets.filter(i => !i.symbol.includes('/'))

        localStorage.setItem('tokenList', JSON.stringify(tokenListST));
        localStorage.setItem('liquidityList', JSON.stringify(liquidityListST));
        dispatch(setTokenList(tokenListST));
        dispatch(setLiquidityList(liquidityListST));
        // setAT(toArray(tokenListST, liquidityListST))
    }

},[])



useEffect(async ()=>{
    let allWallets = await getAllClientWallets(wallet && wallet.id)
if(allWallets.length > (tokenList.length + LPTokenList.length)){
    setAT(allWallets)

    allWallets.forEach(async item => await subscribe(item.walletAddress));

    let liquidityListST = tokenList.filter(i => i.symbol.includes('/'));

    let tokenListST = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
        {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
        })
    );

    localStorage.setItem('tokenList', JSON.stringify(tokenListST));
    localStorage.setItem('liquidityList', JSON.stringify(liquidityListST));
    dispatch(setTokenList(tokenListST));
    dispatch(setLiquidityList(liquidityListST));

}



},[])
    function handleClose() {
    console.log("handleClose")
        return dispatch(hideClientWalletsFromSelect())
    }

    return ReactDOM.createPortal(
        <div className="select-wrapper">

            <MainBlock
                title={'User wallets'}

                // handleBlur={handleClose}
                button={<CloseBtn func={handleClose}/>}
                content={
                    !walletIsConnected ?
                        <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button>
                        :
                    !tokenList.length && !LPTokenList.length ?  <div><p className="wallet-ballance" style={{"margin":"0","marginBottom":"10px"}}>You don't have any wallets for your assets.</p>
                            <p className="wallet-ballance" style={{"margin":"0","marginBottom":"10px"}}>Please go to "Swap", choose a pair of assets and "Connect pair", then come back — we'll create some wallets for you here.</p></div> :
                        (<>
                            <SearchInput func={setFilter.bind(this)}/>
                            <div className="select-list">
                                {at
                                    .sort((a, b) => b.balance - a.balance)
                                    .filter(item => item.symbol.toLowerCase().includes(filter.toLowerCase()))
                                    .map(item => (
                                        <Item
                                            walletAddress={item.walletAddress}
                                            symbol={item.symbol}
                                            balance={item.balance}
                                            lp={item.lp || false}
                                            key={item.symbol}
                                        />
                                    ))
                                }
                            </div>
                        </>)
                }
            />

        </div>,
        document.querySelector('body')
    );
}

export default ClientWallets;
