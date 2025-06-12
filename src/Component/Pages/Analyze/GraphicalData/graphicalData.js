import { Card, CardContent, Typography, Grid } from "@mui/material";
import "./graphicalData.css";
import {
  ListAltOutlined,
  ArrowBack,
  ArrowForward,
  MoreVert
} from "@mui/icons-material";
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
    sx={{ mt: 0, mb: 0, height: "20px", backgroundColor: "lightgray" }}
  >
    <p style={{ color: "black" }}>
      {title}
    </p>
    <Grid item p={0} mt={-2}>
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
    </Grid>
  </Grid>;

const ComponentOne = () => (
  <Card sx={{ height: "235px", backgroundColor: "lightgray" }}>
    <Header title="Timelines" />
    <CardContent>
      <LineGraph />
    </CardContent>
  </Card>);


const ComponentTwo = () => (
  <Card sx={{ height: "350px", backgroundColor: "lightgray" }}>

    <Header title="Keywords" />
    <CardContent>
      <KeywordChart />
    </CardContent>
  </Card>);


const ComponentThree = () => (
  <Card sx={{ height: "350px", backgroundColor: "lightgray" }}>
    <Header title="Locations" />
    <CardContent>
      <Typography
        variant="h6"
        color="textSecondary"
        align="center"
        height={250}
      >
        <LocationBar/>
        {/* {" "}No Data{" "} */}
      </Typography>
    </CardContent>
  </Card>);
const ComponentFour = () => (
  <Card
    sx={{ height: "350px", backgroundColor: "lightgray" }}
  >
    <Header title="Sentiments" />
    <CardContent>
      <SentimentPieChart  />
    </CardContent>
  </Card>
);
const ComponentFive = () => (
  <Card
    sx={{ height: "350px", backgroundColor: "lightgray" }}
  >
    <Header title="Time" />
    <CardContent>
      <DateBar/>
    </CardContent>
  </Card>
);
const ComponentSix = () => (
  <Card
    sx={{ height: "350px", backgroundColor: "lightgray" }}
  >
    <Header title="Events" />
    <CardContent>
      <EventBar/>
    </CardContent>
  </Card>
);
const ComponentSeven = () => (
  <Card
    sx={{ height: "350px", backgroundColor: "lightgray" }}
  >
    <Header title="Persons" />
    <CardContent>
      <PersonBar />
    </CardContent>
  </Card>
);
const ComponentEight = () => (
  <Card
    sx={{ height: "350px", backgroundColor: "lightgray" }}
  >
    <Header title="Languages" />
    <CardContent>
      <LanguageBar />
    </CardContent>
  </Card>
);

const ComponentNine = () => (
  <Card
    sx={{ height: "350px", backgroundColor: "lightgray",marginBottom:'5rem' }}
  >
    <Header title="Organisations" />
    <CardContent>
      <OrgBar />
    </CardContent>
  </Card>
);
const GraphicalData = () => {
  return (
    <div className="responsiveContainer" >

      <Grid container spacing={1} p={1} className="responsiveGrid" style={{
        background: "lightgray", marginLeft: "0 px !important", height: '100vh',
        overflowY: 'auto'
      }}>
        <Grid item xs={12} sx={{ paddingLeft: '0px !important', paddingTop: "0px !important" }}>
          <ComponentOne />
        </Grid>
        <Grid item xs={6} p={1} pb={0} sx={{ paddingLeft: '0 !important' }}>
          <ComponentTwo />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentThree />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentFour />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentFive />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentSix />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentSeven />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} >
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
