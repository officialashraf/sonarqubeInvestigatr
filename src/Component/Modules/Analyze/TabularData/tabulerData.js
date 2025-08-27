import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSummaryData } from "../../../../Redux/Action/filterAction";
import Loader from "../../Layout/loader";
import axios from "axios";
import Cookies from "js-cookie";
import CommonTableComponent from "../../../Common/Table/CommonTableComponent";

const TabulerData = () => {
  const dispatch = useDispatch();
  const caseData = useSelector((state) => state.caseData.caseData);
  const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
  const {
    data,
    headers,
    page,
    totalPages,
    loading,
    error,
    totalResults,
  } = useSelector((state) => state.filterData);

  const [currentPage, setCurrentPage] = useState(page);
  const [columnMapping, setColumnMapping] = useState([]);

  useEffect(() => {
    if (caseData?.id) {
      const rawPayload = {
        case_id: String(caseData.id),
        file_type: caseFilter?.file_type,
        starttime: caseFilter?.start_time,
        endtime: caseFilter?.end_time,
        aggsFields: caseFilter?.aggs_fields,
        keyword: caseFilter?.keyword,
        sentiments: caseFilter?.sentiment,
        targets: Array.isArray(caseFilter?.target)
          ? caseFilter.target.map(t => String(t.value))
          : [],
        page: currentPage,
        itemsPerPage: 50,
      };
      
      const summaryPayload = Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
        )
      );
      
      dispatch(fetchSummaryData(summaryPayload));
      console.log("summary payload tabular", summaryPayload);
    }
  }, [caseData?.id, caseFilter, currentPage]);

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        setColumnMapping(response.data);
      } catch (error) {
        console.error("Mapping fetch failed", error);
      }
    };

    fetchMapping();
  }, [caseData?.id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    const rawPayload = {
      case_id: String(caseData.id),
      file_type: caseFilter?.file_type,
      starttime: caseFilter?.start_time,
      endtime: caseFilter?.end_time,
      aggsFields: caseFilter?.aggs_fields,
      keyword: caseFilter?.keyword,
      sentiments: caseFilter?.sentiment,
      targets: Array.isArray(caseFilter?.target)
        ? caseFilter.target.map(t => String(t.value))
        : [],
      page,
      itemsPerPage: 50,
    };
    
    const pageChangePayload = Object.fromEntries(
      Object.entries(rawPayload).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0) &&
          !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      )
    );
    
    dispatch(fetchSummaryData(pageChangePayload));
    console.log("page change payload", pageChangePayload);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger">{error.message}</div>;

  return (
    <CommonTableComponent
      data={data}
      headers={headers}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={totalResults}
      handlePageChange={handlePageChange}
      columnMapping={columnMapping}
      useColumnMapping={true}
      specialColumns={["targets", "person", "gpe", "unified_case_id", "org", "loc", "socialmedia_hashtags"]}
      noDataMessage="No tabular data available"
    />
  );
};

export default TabulerData;