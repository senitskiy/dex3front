import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from 'react-redux';
import {hidePoolExplorer} from '../../store/actions/poolExplorer';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import MainBlock from "../MainBlock/MainBlock";
import SearchInput from '../SearchInput/SearchInput';
import PoolExplorerItem from '../PoolExplorerItem/PoolExplorerItem';
import './PoolExplorer.scss';
import {getAllPairsWoithoutProvider} from "../../extensions/webhook/script";

function PoolExplorer(props) {

    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    const pairsList = useSelector(state => state.walletReducer.pairsList);


    // const [st,setST] = useState(pairsList)


    // function arrPairs(tokenList2, LPTokenList2){
    //     let toArr = [];
    //     tokenList2.map((i) => {
    //         toArr.push({
    //             symbol: i.symbol,
    //             balance: i.balance,
    //             walletAddress: i.walletAddress,
    //             lp: false
    //         })
    //     })
    //     LPTokenList2.map((i) => {
    //         toArr.push({
    //             symbol: i.symbol,
    //             balance: i.balance,
    //             walletAddress: i.walletAddress,
    //             lp: true
    //         })
    //     })
    //     return toArr
    // }
    // const [chekCurDaata, setchekCurDaata] = useState(true)
    // useEffect(async()=>{
    //     setchekCurDaata(true)
    // },[])

// useEffect(async()=>{
//
//     // if(chekCurDaata){
//         setInterval(async() => {
//             console.log("1122")
//             setST(await getAllPairsWoithoutProvider())
//
//         }, 2000)
//
//     // }
//
//
// },[])







    function handleClose() {
        // setchekCurDaata(false)
        // clearTimeout = () => {
        //     // use clearTimeout on the stored timeout in the class property "timeout"
        //     window.clearInterval();
        // }
        return dispatch(hidePoolExplorer())
    }

    return ReactDOM.createPortal(

        <div className="select-wrapper">

            <MainBlock
                title={'Pool explorer'}

                button={<CloseBtn func={handleClose}/>}
                content={
                    !pairsList.length ? <Loader/> :
                        (<>
                            <SearchInput func={setFilter.bind(this)}/>
                            <div className="select-list">
                                {pairsList
                                    .sort((a, b) => (b.reserveA - a.reserveA) -  (b.reservetB - a.reservetB))
                                    .filter(item => item.symbolA.toLowerCase().includes(filter.toLowerCase()) || item.symbolB.toLowerCase().includes(filter.toLowerCase()))
                                    .map(item => (
                                        <PoolExplorerItem
                                            pair={item}
                                            key={item.symbolA + " " + item.symbolB}
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

export default PoolExplorer;
