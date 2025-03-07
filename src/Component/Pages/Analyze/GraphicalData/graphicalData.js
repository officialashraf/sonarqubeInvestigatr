import React from "react";
import { Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import "../../../../Assets/Stlyes/graphicalData.css"
import {ListAltOutlined ,ArrowBack, ArrowForward, MoreVert} from '@mui/icons-material';
import LineChart1 from "./lineChart";
import KeywordChart from "./keywordChart";


const Header = ({ title }) => (
  <Grid container alignItems="center" justifyContent="space-between" p={0} sx={{ mt: 0, mb: 0, height:"20px" ,  backgroundColor: "lightgray"}}>
    <p style={{color:"black"}} >{title}</p>
    <Grid item p={0} mt={-2}>
       
        <ArrowBack fontSize="inherit" sx={{ color: "black", '&:hover': { color: "gray" } }}  />
     
      
        <ArrowForward fontSize="inherit" sx={{ color: "black", '&:hover': { color: "gray" } }}  />
     
      
        <ListAltOutlined  fontSize="inherit" sx={{ color: "black", '&:hover': { color: "gray" } }} />
     
      
        <MoreVert  fontSize="inherit" sx={{ color: "black", '&:hover': { color: "gray" } }} />
     
    </Grid>
  </Grid>
);

const ComponentOne = () => (
  <Card  sx={{ height: "235px", backgroundColor: "lightgray" }}>
    <Header title="Timeline" />
    <CardContent>
    <LineChart1/>
    </CardContent>
  </Card>
);

const ComponentTwo = () => (
  <Card  sx={{ height: "235px" ,backgroundColor: "lightgray" }}>
    <Header title="Keywords" />
    <CardContent>
    <KeywordChart/>
    </CardContent>
  </Card>
);

const ComponentThree = () => (
  <Card  sx={{ height: "235px", backgroundColor: "lightgray" }}>
    <Header title="Location" />
    <CardContent>
      <Typography variant="h6" color="textSecondary" align="center" height={250}> No Data </Typography>
    </CardContent>
  </Card>
);

const GraphicalData = () => {
  return (
    <div className="responsiveContainer" >

    <Grid container spacing={1} p={1} className="responsiveGrid" style={{background:"lightgray", marginLeft:"0 px !important"}}>
      <Grid item xs={12}  sx={{ paddingLeft: '0px !important',  paddingTop:"0px !important"}}>
      <ComponentOne/>
      </Grid>
      <Grid item xs={6} p={1} pb={0}  sx={{ paddingLeft: '0 !important' }}>
     <ComponentTwo/>
      </Grid>
      <Grid item xs={6} p={1} pb={0} >
        <ComponentThree />
      </Grid>
    </Grid>
    </div>
  );
};

export default GraphicalData;
