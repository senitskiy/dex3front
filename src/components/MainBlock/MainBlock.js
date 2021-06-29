import React from 'react';
import "./MainBlock.scss";

function MainBlock(props) {
  function classGenerator() {
    let str = 'mainblock-title';

    if(props.smallTitle) { str += " mainblock-title--small" }
    if(props.normalTitle) { str += " mainblock-title--normal" }

    return str;
  }

  return (
    <div className={props.class ? props.class + " mainblock" : "mainblock"}>
      { (props.title || props.button) && (
        <div className="mainblock-header">
          <h2 className={classGenerator()}>{props.title}</h2>
          {props.button && props.button}
        </div>
        )}
      {props.content}
      {props.footer && props.footer}
    </div>
  )
}

export default MainBlock;
