import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { iconGenerator } from '../../iconGenerator';
import './PoolExplorerItem.scss';

function PoolExplorerItem(props) {
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  return (
      <React.Fragment>
        <div className="poolExplorer__box">
          <span className="poolExplorer__box_text">Pair</span>
          <div className="poolExplorer__box_pair">
            <img className="poolExplorer__icon_margin" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>
            <b>{props.pair.symbolA}</b>
          </div>
          <span className="poolExplorer__box_text">/</span>
          <div className="poolExplorer__box_pair">
            <img className="poolExplorer__icon_margin" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>
            <b>{props.pair.symbolB}</b>
          </div>
          </div>
        <div className="select-item">
          {/*<div className="select-item-wrapper">*/}
          {/*    <div className="poolExplorer__pair_block">*/}
          {/*      <div className="poolExplorer__pair">*/}
          {/*        <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>*/}
          {/*        <p className="select-item-title">{props.pair.symbolA}</p>*/}
          {/*      </div>*/}
          {/*      <div className="poolExplorer__pair">*/}
          {/*        <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>*/}
          {/*        <p className="select-item-title">{props.pair.symbolB}</p>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*</div>*/}
          <div className="poolExplorer__pair_rate">
            <div className="poolExplorer__reserve">
              <span className="select-item-descr"><div>
                1 {props.pair.symbolA} = <b>{props.pair.rateAB < 0.0001 ? parseFloat(props.pair.rateAB).toFixed(9) : parseFloat(props.pair.rateAB).toFixed(4)}</b> {props.pair.symbolB}
              </div>
              </span>
            </div>
            <div className="poolExplorer__reserve">
               <span className="select-item-descr"><div>
                 1 {props.pair.symbolB} = <b>{props.pair.rateBA < 0.0001 ? parseFloat(props.pair.rateBA).toFixed(8) : parseFloat(props.pair.rateBA).toFixed(4)}</b> {props.pair.symbolA}
               </div>
               </span>
            </div>
          </div>


          <div className="poolExplorer__fixed_width">
            <div className="poolExplorer__reserve">
              <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>
              {(parseFloat(props.pair.reserveA) / 1e9).toFixed(4)}
            </div>
            <div className="poolExplorer__reserve">
              <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>
              {(parseFloat(props.pair.reservetB) / 1e9).toFixed(4)}
            </div>
          </div>



          {/*<div className="select-item" onClick={copyAddress}>*/}
          {/*  <div className="select-item-wrapper">*/}
          {/*    <div className="poolExplorer__pair_block">*/}
          {/*      <div className="poolExplorer__pair">*/}
          {/*        <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>*/}
          {/*        <p className="select-item-title">{props.pair.symbolB}</p>*/}
          {/*      </div>*/}
          {/*      <div className="poolExplorer__pair">*/}
          {/*        <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>*/}
          {/*        <p className="select-item-title">{props.pair.symbolA}</p>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <span className="select-item-descr">{!isVisible &&  "Rate: " + parseFloat(props.pair.rateBA).toFixed(4)} {isVisible && "Address copied"}</span>*/}

          {/*    <div>*/}
          {/*      <div className="poolExplorer__reserve">*/}
          {/*        <img  className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>*/}
          {/*        {(parseFloat(props.pair.reservetB) / 1e9).toFixed(4)}*/}
          {/*      </div>*/}
          {/*      <div className="poolExplorer__reserve">*/}
          {/*        <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>*/}
          {/*        {(parseFloat(props.pair.reserveA) / 1e9).toFixed(4)}*/}
          {/*      </div>*/}
          {/*    </div>*/}
        </div>
      </React.Fragment>
  )
}

export default PoolExplorerItem;
