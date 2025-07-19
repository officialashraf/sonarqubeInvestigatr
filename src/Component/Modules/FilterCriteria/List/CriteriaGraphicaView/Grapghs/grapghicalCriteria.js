import { Card, CardContent, Grid } from "@mui/material";
import styles from "../../../../Analyze/GraphicalData/graphicalData.module.css";
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
    className={styles.graphCards}
    style={{margin:'0px 0px 10px 15px'}}
  >
    <p style={{ color: "white",fontSize:"16px", paddingLeft: "5px"}}>
      {title}
    </p>
</Grid>;

const ComponentOne = () => (
  <>
     <Header title="Timeline"  />
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
    sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius:'25px' }}
  >
    <CardContent>
      <SentimentPieChart  />
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
    <div className={styles.responsiveContainer} >

      <Grid container spacing={1} p={1} className={styles.responsiveGrid} style={{
        background: "#080E17", marginLeft: "0 px !important", height: '100vh',
        overflowY: 'auto'
      }}>
        <Grid item xs={12} sx={{ paddingLeft: '0px !important', paddingTop: "0px !important" }} className={styles.graphCards}>
          <ComponentOne />
        </Grid>
        <Grid item xs={6} p={1} pb={0} sx={{ paddingLeft: '0 !important' }} className={styles.graphCards}>
          <ComponentTwo />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className={styles.graphCards}>
          <ComponentThree />
        </Grid>
        <Grid item xs={6} p={1} pb={0}  className={styles.graphCards}>
          <ComponentFour />
        </Grid>

        <Grid item xs={6} p={1} pb={0} className={styles.graphCards}>
          <ComponentFive />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className={styles.graphCards}>
          <ComponentSix />
        </Grid>
        <Grid item xs={6} p={1} pb={0} className={styles.graphCards}>
          <ComponentSeven />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} className={styles.graphCards}>
          <ComponentEight />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10} className={styles.graphCards}>
          <ComponentNine />
        </Grid>
      </Grid>

    </div>
  );
};

export default GrapghicalCriteria;