import CaseHeader from './caseHeader'
import { useState } from 'react'
import TabulerData from './TabularData/tabulerData'
import GraphicalData from './GraphicalData/graphicalData'
import Resources from './Resources'

const CaseTableDataFilter = () => {
    const [view, setView] = useState('caseData'); // Default view is 'caseData'

  const handleButtonClick = (viewType) => {
    setView(viewType); // Update the view when a button is clicked
  };
  

  return (

    <>

    <CaseHeader onIconClick={handleButtonClick}/>
    <div style={{height:"auto", backgroundColor:"#D3D3D3", overflow:"auto"}}>
       {view === "caseData" && <TabulerData />}
        {view === "graphicalData" && <GraphicalData />}
        {view === "resources" && <Resources />}
    </div>
    </>
  )
}

export default CaseTableDataFilter
