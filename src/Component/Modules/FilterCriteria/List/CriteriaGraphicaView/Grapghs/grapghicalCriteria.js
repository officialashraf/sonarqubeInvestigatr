import { Card, CardContent, Grid } from "@mui/material";
import "../../../../Analyze/GraphicalData/graphical.css";
import LineGrapgh from "./criteriaLineChart";
import KeywordChart from "./criteriaKeywordCloude";
import SentimentPieChart from "./criteriaSentiment";
import DateGraph from "./dateGraph";
import EventGraph from "./eventGarph";
import PersonGraph from "./personGarph";
import OrgGraph from "./organisationGraph";
import LanguageGraph from "./languageGraph";
import LocationGraph from "./locationGraph";

const Header = ({ title }) =>
  <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    p={0}
    sx={{ mt: 0, mb: 0, height: "20px" }}
    className="graphCards"
  >
    <p style={{ color: "white" }}>
      {title}
    </p>

  </Grid>;

const ComponentOne = () => (
  <>
     <Header title="Timeline" />
  <Card sx={{ height: "300px", backgroundColor: "#101D2B", borderRadius:'25px' }}>
    <CardContent>
      <LineGrapgh />
    </CardContent>
  </Card>
  </>);


const ComponentTwo = () => (
  <>
      <Header title="Keywords" />
  <Card sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}>
    <CardContent>
      <KeywordChart />
    </CardContent>
  </Card>
  </>);


const ComponentThree = () => (
  <>
      <Header title="Location" />
  <Card sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}>
    <CardContent>
      <LocationGraph />
    </CardContent>
  </Card>
  </>);
const ComponentFour = () => (
  <>
      <Header title="Sentiment" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px', marginBottom: "5rem" }}
  >
    <CardContent>
      <SentimentPieChart height={250} />
    </CardContent>
  </Card>
  </>
);

const ComponentFive = () => (
  <>
      <Header title="Time" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}
  >
    <CardContent>
      <DateGraph />
    </CardContent>
  </Card>
  </>
);
const ComponentSix = () => (
  <>
      <Header title="Events" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}
  >
    <CardContent>
      <EventGraph />
    </CardContent>
  </Card>
  </>
);
const ComponentSeven = () => (
  <>
      <Header title="Persons" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}
  >
    <CardContent>
      <PersonGraph />
    </CardContent>
  </Card>
  </>
);
const ComponentEight = () => (
  <>
   <Header title="Languages" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}
  >
    <CardContent>
      <LanguageGraph />
    </CardContent>
  </Card>
  </>
);

const ComponentNine = () => (
  <>
      <Header title="Organisations" />
  <Card
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px', marginBottom: '5rem' }}
  >
    <CardContent>
      <OrgGraph />
    </CardContent>
  </Card>
  </>
);

const GrapghicalCriteria = () => {
  return (
    <div className="responsiveContainer" >

      <Grid container spacing={1} p={1} className="responsiveGrid" style={{
        background: "#080E17", marginLeft: "0 px !important", height: '100vh',
        overflowY: 'auto'
      }}>
        <Grid item xs={12} sx={{ paddingLeft: '0px !important', paddingTop: "0px !important" }} className="grapghCards">
          <ComponentOne />
        </Grid>
        <Grid item xs={6} p={1} pb={0} sx={{ paddingLeft: '0 !important' }} className="grapghCards">
          <ComponentTwo />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards">
          <ComponentThree />
        </Grid>
        <Grid item xs={6} p={1} pb={0}  className="grapghCards">
          <ComponentFour />
        </Grid>

        <Grid item xs={6} p={1} pb={0} className="grapghCards">
          <ComponentFive />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards">
          <ComponentSix />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className="grapghCards">
          <ComponentSeven />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} className="grapghCards">
          <ComponentEight />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} className="grapghCards">
          <ComponentNine />
        </Grid>
      </Grid>

    </div>
  );
};

export default GrapghicalCriteria;