import "./loader.css"

import React from 'react'

const Loader =({style})=>{
  return (
    <div className="loading">
        <div style={style}></div>
        <h6>Please wait</h6>
    </div>
  )
}

export default Loader