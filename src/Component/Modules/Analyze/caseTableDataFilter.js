import CaseHeader from './caseHeader'
import { useState } from 'react'
import TabulerData from './TabularData/tabulerData'
import GraphicalData from './GraphicalData/graphicalData'
import Resources from './Resources'

const CaseTableDataFilter = () => {
  const [view, setView] = useState('graphicalData');

  const handleButtonClick = (viewType) => {
    setView(viewType); // Update the view when a button is clicked
  };

  return (

    <>
      <CaseHeader onIconClick={handleButtonClick} activeView={view} />
      <div style={{ height: "auto", backgroundColor: "#101D2B", padding: "15px", borderRadius: "15px", overflow: "auto" }}>
        {view === "caseData" && <TabulerData />}
        {view === "graphicalData" && <GraphicalData />}
        {view === "resources" && <Resources />}
      </div>
    </>
  )
}

export default CaseTableDataFilter
