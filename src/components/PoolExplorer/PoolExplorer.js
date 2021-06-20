import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {useDispatch, useSelector} from 'react-redux';
import {hidePoolExplorer} from '../../store/actions/poolExplorer';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import MainBlock from "../MainBlock/MainBlock";
import SearchInput from '../SearchInput/SearchInput';
import PoolExplorerItem from '../PoolExplorerItem/PoolExplorerItem';
import './PoolExplorer.scss';

function PoolExplorer(props) {

    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    const pairsList = useSelector(state => state.walletReducer.pairsList);

    function handleClose() {
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