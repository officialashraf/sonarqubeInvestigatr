import React from 'react'

import CardList from './cards.js'
import '../../../Assets/Stlyes/dashboard.css'

import DataTable from '../Case/caseList.js'



const Home = () => {



  return (
    <div>

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
