import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { SortDown, SortUp, Search } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logFilterCount } from '../../../Redux/Action/filterAction.js';
import Cookies from 'js-cookie';
import Loader from '../Layout/loader.js';
import { toast } from 'react-toastify';

const ExistingFilter = ({ selectedFilters, onFilterToggle, onFilterSelect, setShowAddFilter }) => {
  const token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const caseId = useSelector((state) => state.caseData.caseData.id);

  const [loading, setLoading] = useState(true);
  const [filterdata, setfilterdata] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarVisibility, setSearchBarVisibility] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc'); // new state for sort direction

  const toggleSearchBar = () => {
    setSearchBarVisibility(!searchBarVisibility);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const sortFilters = () => {
    if (filterdata.data) {
      const sortedFilters = [...filterdata.data].sort((a, b) => {
        // First sort by checked status
        const aChecked = selectedFilters.includes(a.id) ? 0 : 1;
        const bChecked = selectedFilters.includes(b.id) ? 0 : 1;

        // If checked status is different, maintain checked items at top
        if (aChecked !== bChecked) return aChecked - bChecked;
        const dateA = new Date(a.modified_on || a.created_on);
        const dateB = new Date(b.modified_on || b.created_on);

        if (sortDirection === 'asc') {
          return dateA - dateB; // Latest firstass
        } else {
          return dateB - dateA; // Oldest first
        }
      });

      setfilterdata({ ...filterdata, data: sortedFilters });
      // Toggle sort direction for next click
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };
  const isFilterInCurrentCase = useCallback((filter) => {
    return Array.isArray(filter["case id"]) &&
      filter["case id"].includes(String(caseId));
  }, [caseId]);

  const sortFiltersHelper = useCallback((filters) => {
    return filters.sort((a, b) => {
      // First priority: Checked status
      const aInCurrentCase = isFilterInCurrentCase(a);
      const bInCurrentCase = isFilterInCurrentCase(b);
      if (aInCurrentCase && !bInCurrentCase) return -1;
      if (!aInCurrentCase && bInCurrentCase) return 1;

      // Second priority: Latest modified/created date
      const dateA = new Date(a.modified_on || a.created_on);
      const dateB = new Date(b.modified_on || b.created_on);
      if (dateA !== dateB) {
        return sortDirection === 'asc' ? dateB - dateA : dateA - dateB;
      }

      // Third priority: Name
      return a.name.localeCompare(b.name);
    });
  }, [isFilterInCurrentCase, sortDirection]);


  useEffect(() => {
    const filterData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/filters`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const user = response.data;
        const sortedFilters = sortFiltersHelper([...user.data]);

        dispatch(logFilterCount(user));
        setfilterdata({ ...user, data: sortedFilters });;

      } catch (error) {
        toast.error(error.message)
        console.error('There was an error fetching the data!', error);
      } finally {
        setLoading(false);
      }
    };
    filterData();
    const handleDatabaseUpdate = () => {
      filterData();
    };

    window.addEventListener("databaseUpdated", handleDatabaseUpdate);

    return () => {
      window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
    };
  }, [dispatch, token, sortFiltersHelper]);

  return (
    <>
      <div className="filters-wrapper" style={{ margin: '1px' }}>
        <div className='existingFil'>
          <p className='existing-title' style={{ margin: '0' }}>Existing Filters</p>
          {searchBarVisibility && (
            <input
              className="search_input"
              placeholder="Search..."
              onChange={handleSearch}
              style={{ marginLeft: '2px' }}
            />
          )}
          {!searchBarVisibility && (
            <span style={{ marginLeft: '0px', marginRight: '0' }}>
              <Search onClick={toggleSearchBar} style={{ width: '10px', marginLeft: '80px' }} />
            </span>
          )}
          <button
            className="btn btn-sm me-2 sort-filters"
            onClick={sortFilters}
            style={{ marginLeft: '0px', marginRight: '0px', width: '8px' }}
          >
            {sortDirection === 'asc' ? <SortDown /> : <SortUp />}
          </button>
        </div>
        <div className='exist-filter'>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: '8rem' }}>
              <Loader />
            </div>
          ) : (
            <ul className="list-group existing-filters-ul">
              {filterdata.data && filterdata.data.length > 0 ? (
                filterdata.data
                  .filter(filter => filter.name.toLowerCase().includes(searchQuery))
                  .map((filter) => (
                    <li key={filter.id} className="list-group-item existing-filters-li">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedFilters.includes(filter.id)}
                        onChange={(e) => onFilterToggle(filter.id, e.target.checked)}
                      />

                      <div className="filter-content" onClick={() => {
                        onFilterSelect(filter.id);
                        setShowAddFilter(true);
                      }}>
                        <div className="filter-text">
                          <span className="filter-name">{filter.name}</span>
                          <p className="filter-meta">Created by: {filter.created_by}</p>
                        </div>
                        <div className="filter-date">
                          {filter.created_on.slice(0, 10)}
                        </div>
                      </div>
                    </li>

                  ))
              ) : (
                <li className="list-group-item existing-filters-li" style={{ display: "flex", height: "400px", justifyContent: "center", alignItems: "center", border: "none" }}>
                  <p>No filters created yet</p>
                </li>
              )}
            </ul>
          )}
        </div>

      </div>
    </>
  );
};

export default ExistingFilter;