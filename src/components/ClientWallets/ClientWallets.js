import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from 'react-redux';
import {hideClientWalletsFromSelect} from '../../store/actions/clientWallets';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import MainBlock from "../MainBlock/MainBlock";
import SearchInput from '../SearchInput/SearchInput';
import Item from '../Item/Item';
import './ClientWallets.scss';

function ClientWallets(props) {

    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    const tokenList = useSelector(state => state.walletReducer.tokenList);
    const LPTokenList = useSelector(state => state.walletReducer.liquidityList);

    let toArr = [];
    tokenList.map((i) => {
        toArr.push({
            symbol: i.symbol,
            balance: i.balance,
            walletAddress: i.walletAddress,
            lp: false
        })
    })
    LPTokenList.map((i) => {
        toArr.push({
            symbol: i.symbol,
            balance: i.balance,
            walletAddress: i.walletAddress,
            lp: true
        })
    })
    //console.log(LPTokenList);


    function handleClose() {
        return dispatch(hideClientWalletsFromSelect())
    }

    return ReactDOM.createPortal(
        <div className="select-wrapper">
            <MainBlock
                title={'User wallets'}

                button={<CloseBtn func={handleClose}/>}
                content={
                    !tokenList.length && !LPTokenList.length ?  <p className="wallet-ballance">You have not wallets yet</p> :
                        (<>
                            <SearchInput func={setFilter.bind(this)}/>
                            <div className="select-list">
                                {toArr
                                    .sort((a, b) => b.balance - a.balance)
                                    .filter(item => item.symbol.toLowerCase().includes(filter.toLowerCase()))
                                    .map(item => (
                                        <Item
                                            walletAddress={item.walletAddress}
                                            symbol={item.symbol}
                                            balance={item.balance}
                                            lp={item.lp}
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
