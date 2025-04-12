import React from 'react'

import CardList from './cards.js'
import './dashboard.css'

import DataTable from '../Case/caseList.js'



const Home = () => {



  return (
    <div style={{height: "100%", width:"100%",flexDirection:"column", overflow:"hidden", margin:"2.5px"}}>

      <div className="row-1">
        <CardList /> 
        </div>
      <div className="row-2" >
        <DataTable />

      </div>

    </div>
  )
}

export default Home
