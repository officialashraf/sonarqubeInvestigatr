import Header from './headerFilter';
import MainContainer from './mainContainer';

const MainFilter = () => {


  return (
    <>
      <div style={{ height: "100%", flexDirection: "column", overflow: "hidden" }}>

        <Header />
        <MainContainer />
      </div>
    </>
  );
};

export default MainFilter;
