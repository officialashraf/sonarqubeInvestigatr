import { Card, CardContent, Typography, Grid } from "@mui/material";
import styles from  './graphicalData.module.css'
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
import LazyLoadWrapper from "./LazyLoadWrapper";

const Header = ({ title }) =>
  <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    p={0}
    sx={{ mt: 0, mb: 0, height: "20px" }}
    className={styles.grapghCards}
      style={{margin:'0px 0px 10px 15px'}}
  >
    <p style={{ color: "white", paddingLeft: "5px",fontSize:"16px" }}>
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
    <Card sx={{ height: "300px", backgroundColor: "#101D2B", borderRadius: '25px' }}>
      <CardContent>
        <LazyLoadWrapper height={300}>
          <LineGraph />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>);


const ComponentTwo = () => (
  <>
    <Header title="Keywords" />
    <Card sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}>
      <CardContent>
        <LazyLoadWrapper height={350}>
          <KeywordChart />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>);


const ComponentThree = () => (
  <>
    <Header title="Locations" />
    <Card sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}>
      <CardContent>
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          height={250}
        >
          <LazyLoadWrapper height={350}>
            <LocationBar />
          </LazyLoadWrapper>
          {/* {" "}No Data{" "} */}
        </Typography>
      </CardContent>
    </Card>
  </>);
const ComponentFour = () => (
  <>
    <Header title="Sentiments" />
    <Card
      sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}
    >
      <CardContent>
        <LazyLoadWrapper height={350}>
          <SentimentPieChart />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>
);
const ComponentFive = () => (
  <>
    <Header title="Time" />
    <Card
      sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}
    >
      <CardContent sx={{ backgroundColor: "#101D2B", borderRadius: '25px' }}>
        <LazyLoadWrapper height={350}>
          <DateBar />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>
);
const ComponentSix = () => (
  <>
    <Header title="Events" />
    <Card
      sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}
    >
      <CardContent>
        <LazyLoadWrapper height={350}>
          <EventBar />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>
);
const ComponentSeven = () => (
  <>
    <Header title="Persons" />
    <Card
      sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}
    >
      <CardContent>
        <LazyLoadWrapper height={350}>
          <PersonBar />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>
);
const ComponentEight = () => (
  <>
    <Header title="Languages" />
    <Card
      sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px' }}
    >
      <CardContent>
        <LazyLoadWrapper height={350}>
          <LanguageBar />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>
);

const ComponentNine = () => (
  <>
    <Header title="Organisations" />
    <Card
      sx={{ height: "350px", backgroundColor: "#101D2B", borderRadius: '25px', marginBottom: '5rem', borderRadius: '25px' }}
    >
      <CardContent >
        <LazyLoadWrapper height={350}>
          <OrgBar />
        </LazyLoadWrapper>
      </CardContent>
    </Card>
  </>
);
const GraphicalData = () => {
  return (
    <div className={styles.responsiveContainer} 
    // style={{overflowY: 'auto', maxHeight: '90vh'}}
    >

      <Grid container spacing={1} p={1} className={styles.responsiveGrid} style={{
        background: "#080E17", marginLeft: "0 px !important", height: '100%',
         overflowY: 'auto'
      }}>
        <Grid item xs={12} sx={{ paddingLeft: '0px !important', paddingTop: "0px !important" }}  className={styles.grapghCards}>
          <ComponentOne />
        </Grid>
        <Grid item xs={6} p={1} pb={0} sx={{ paddingLeft: '0 !important' }}  className={styles.grapghCards}>
          <ComponentTwo />
        </Grid>
        <Grid item xs={6} p={1} pb={0}  className={styles.grapghCards} >
          <ComponentThree />
        </Grid>
        <Grid item xs={6} p={1} pb={0}  className={styles.grapghCards}  >
          <ComponentFour />
        </Grid>
        <Grid item xs={6} p={1} pb={0} >
          <ComponentFive />
        </Grid>
        <Grid item xs={6} p={1} pb={0}  className={styles.grapghCards}>
          <ComponentSix />
        </Grid>
        <Grid item xs={6} p={1} pb={0}  className={styles.grapghCards}>
          <ComponentSeven />
        </Grid>
        <Grid item xs={6} p={1} pb={0} mb={10}  className={styles.grapghCards} >
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
