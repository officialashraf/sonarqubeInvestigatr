import React from 'react'
import Headerm from '../../Home/header'
import Sidebar from '../../Home/leftSideBar'
import RightSidebar from '../../Home/rightSideBar'
import MainContainer from '../mainContainer'
import Preheader from './preheaderFilter'
import Header from '../headerFilter'


const CaseAddFilter = ({ onAnalyzeClick, caseData1 }) => {
  return (
    <div >
    <Headerm />

    <div className="dashboard-container">

      <div className="cont-a">
        <Sidebar />
      </div>


      <div className="cont-b">
      <Header onAnalyzeClick={onAnalyzeClick} caseData1={caseData1} />
      {/* <Header onAnalyzeClick={onAnalyzeClick} caseData1={caseData1} /> */}
      <Preheader />
      
        <MainContainer caseData1={caseData1} /> 
       
      </div>


      <div className="cont-c">
        <RightSidebar  />
      </div>
    </div>
  </div>
  )
}

export default CaseAddFilter