import React from 'react';
//import { Container } from 'react-bootstrap';
import Header from './headerFilter';
//import Preheader from './preheaderFilter';
import MainContainer from './mainContainer';
// import { useSelector } from 'react-redux';

const MainFilter = () => {
  //const caseData1 = useSelector((state) => state.case.caseData.caseData);
  return (
    <>
<div style={{height: "100%",flexDirection:"column", overflow:"hidden"}}>

      <Header  />
      {/* <Preheader /> */}
      
        <MainContainer />
</div>
        
           
    </>
  );
};

export default MainFilter;
