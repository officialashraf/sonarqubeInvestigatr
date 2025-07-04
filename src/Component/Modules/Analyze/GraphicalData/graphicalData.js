import { Card, CardContent, Typography, Grid } from "@mui/material";
import "./graphicalData.css";
// import { ListAltOutlined,ArrowBack, ArrowForward, MoreVert} from "@mui/icons-material";
import LineGraph from "./lineChart";
import KeywordChart from "./keywordChart";
import SentimentPieChart from "./sentimentPiechart";
import LocationBar from "./locationBar";
import DateBar from "./dateBar";
import EventBar from "./eventBar";
import PersonBar from "./personBar";
import LanguageBar from "./languageBar";
import OrgBar from "./orgBar";

const Header = ({ title }) =>
  <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    p={0}
    sx={{ mt: 0, mb: 0, height: "20px"}}
    className="grapghCards"

  >
    <p style={{ color: "white" }}>
      {title}
    </p>
    {/* <Grid item p={0} mt={-2}>
      <ArrowBack
        fontSize="inherit"
        sx={{ color: "black", "&:hover": { color: "gray" } }}
      />

      <ArrowForward
        fontSize="inherit"
        sx={{ color: "black", "&:hover": { color: "gray" } }}
      />

      <ListAltOutlined
        fontSize="inherit"
        sx={{ color: "black", "&:hover": { color: "gray" } }}
      />

      <MoreVert
        fontSize="inherit"
        sx={{ color: "black", "&:hover": { color: "gray" } }}
      />
    </Grid> */}
  </Grid>;

const ComponentOne = () => (
  <>
     <Header title="Timelines" />
  <Card sx={{ height: "300px", backgroundColor: "#101D2B" , borderRadius:'25px' }}>
    <CardContent>
      <LineGraph />
    </CardContent>
    </Card>
 </>);


const ComponentTwo = () => (
  <>
    <Header title="Keywords" />
  <Card sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px' }}>
    <CardContent>
      <KeywordChart />
    </CardContent>
    </Card>
 </>);


const ComponentThree = () => (
  <>
      <Header title="Locations" />
  <Card sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px' }}>
    <CardContent>
      <Typography
        variant="h6"
        color="textSecondary"
        align="center"
        height={250} 
      >
        <LocationBar />
        {/* {" "}No Data{" "} */}
      </Typography>
    </CardContent>
    </Card>
 </>);
const ComponentFour = () => (
  <>
      <Header title="Sentiments" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px'  }}
  >
    <CardContent>
      <SentimentPieChart />
    </CardContent>
    </Card>
 </>
);
const ComponentFive = () => (
  <>
    <Header title="Time" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px' }}
  >
    <CardContent sx={{backgroundColor: "#101D2B" , borderRadius:'25px' }}>
      <DateBar />
    </CardContent>
    </Card>
 </>
);
const ComponentSix = () => (
  <>
      <Header title="Events" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px' }}
  >
    <CardContent>
      <EventBar />
    </CardContent>
    </Card>
 </>
);
const ComponentSeven = () => (
  <>
   <Header title="Persons" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px' }}
  >
    <CardContent>
      <PersonBar />
    </CardContent>
    </Card>
 </>
);
const ComponentEight = () => (
  <>
   <Header title="Languages" />
  <Card
    sx={{ height: "350px" ,backgroundColor: "#101D2B" , borderRadius:'25px'}}   
  >
    <CardContent>
      <LanguageBar />
    </CardContent>
    </Card>
 </>
);

const ComponentNine = () => (
<>
   <Header title="Organisations" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B" , borderRadius:'25px', marginBottom: '5rem', borderRadius:'25px' }}
  >
    <CardContent >
      <OrgBar   />
    </CardContent>
    </Card>
 </>
);
const GraphicalData = () => {
  return (
    <div className="responsiveContainer" >

      <Grid container spacing={1} p={1} className="responsiveGrid" style={{
        background: "#080E17", marginLeft: "0 px !important", height: '100vh',
        overflowY: 'auto'
      }}>
        <Grid item xs={12} sx={{ paddingLeft: '0px !important', paddingTop: "0px !important" }}className="grapghCards">
          <ComponentOne />
        </Grid>
        <Grid item xs={6} p={1} pb={0} sx={{ paddingLeft: '0 !important'}}className="grapghCards">
          <ComponentTwo />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards" >
          <ComponentThree />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards"  >
          <ComponentFour />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentFive />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards">
          <ComponentSix />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards">
          <ComponentSeven />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} className="grapghCards" >
          <ComponentEight />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} >
          <ComponentNine />
        </Grid>

      </Grid>

    </div>
  );
};

export default GraphicalData;
