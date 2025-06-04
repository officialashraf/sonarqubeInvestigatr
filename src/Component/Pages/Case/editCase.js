import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Select from 'react-select';

const EditCase = ({ togglePopup, item }) => {
  // Initialize formData with item values, ensuring proper format for each field
  const [formData, setFormData] = useState({
    title: item.title || "",
    description: item.description || "",
    status: item.status || "",
    // If watchers is a string, split it; if it's already an array, use it; otherwise empty array
    watchers: typeof item.watchers === 'string'
      ? item.watchers.split(",").map((w) => w.trim()).filter((w) => w)
      : Array.isArray(item.watchers) ? item.watchers : [],
    assignee: item.assignee || "",
    comment: item.comment || "",
  });

  const [users, setUsers] = useState({ data: [] });

  const options = users.data?.map(user => ({
    value: user.id,
    label: user.username
  })) || [];

  const statusOptions = [
    { value: "on hold", label: "On Hold" },
    { value: "closed", label: "Closed" }
  ];
  const [initialFormData, setInitialFormData] = useState({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [error, setError] = useState({});


  const validateForm = () => {
    const errors = {};

    if (!formData.title || formData.title.trim() === "") {
      errors.title = "Title is required";
    }

    if (!formData.description) {
      errors.description = "Description is required";
    }
    return errors;
  };


  const getUserData = async () => {
    const token = Cookies.get("accessToken");
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Update formData when item or users change
  useEffect(() => {
    if (users.data?.length > 0) {
      // const assigneeUser = users.data.find(user => user.id === item.assignee);
      setFormData(prev => ({
        ...prev,
        assignee: item.assignee,
        status: item.status,
        watchers: typeof item.watchers === 'string' ?
          item.watchers.split(",").map((w) => w.trim()).filter((w) => w)
          : Array.isArray(item.watchers)
            ? item.watchers
            : [],
      }));
    } console.log("item.watchers", item.watchers)
  }, [item, users.data]);

  const handleEditCase = async (formData) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Authentication error: No token found");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const payloadData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );

    try {
      const hasChanged = {};

      // Compare simple fields
      ["title", "description", "status", "assignee", "comment"].forEach((key) => {
        if (payloadData[key] !== item[key]) {
          hasChanged[key] = payloadData[key];
        }
      });

      // Compare watchers carefully (normalize both before comparing)
      const originalWatchers = Array.isArray(item.watchers)
        ? item.watchers.map(w => w.trim()).filter(Boolean)
        : typeof item.watchers === "string"
          ? item.watchers.split(",").map(w => w.trim()).filter(Boolean)
          : [];

      const currentWatchers = Array.isArray(formData.watchers)
        ? formData.watchers.map(w => w.trim()).filter(Boolean)
        : [];

      const areWatchersDifferent = originalWatchers.length !== currentWatchers.length ||
        originalWatchers.sort().join(",") !== currentWatchers.sort().join(",");

      if (areWatchersDifferent && currentWatchers.length > 0) {
    hasChanged.watchers = [...currentWatchers]; // ✅ Ensures it stays an array of strings

      } else if (currentWatchers.length === 0) {
        hasChanged.watchers = []; // Explicitly set to an empty array if no watchers exist
      }

      if (Object.keys(hasChanged).length === 0) {
        togglePopup();
        return;
      }
      console.log("handlechange", hasChanged)
      const response = await axios.put(
        `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case/${item.id}`,
        hasChanged,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Case updated successfully");
        window.dispatchEvent(new Event("databaseUpdated"));
        togglePopup();
      }
    } catch (err) {
      console.error("Error updating case:", err);
      toast.info(err.response?.data || "Failed to update case");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue;

    if (name === 'title') {
      // Capitalize first letter of each word
      formattedValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
    } else if (name === 'description') {
      // Capitalize only the first letter of the whole input
      formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      // For other fields, keep as is
      formattedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""  // Remove the specific error message
    }));
  };
  const handleWatchersChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      watchers: selectedOptions ? selectedOptions.map((option) => option.label) : [],
    }));
  };

  const handleAssigneeChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      assignee: selectedOption ? selectedOption.value : item.assignee
    }));
  };

  const handleStatusChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      status: selectedOption ? selectedOption.value : item.status
    }));
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'white',
      color: 'black',
      boxShadow: 'none',
      outline: 'none'
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'white',
      color: 'black',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'black' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: 'black',
        color: 'white'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'white',
    }),
    multiValueLabel: (base) => ({
      ...base,
      backgroundColor: 'black',
      color: 'white',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'black',
      '&:hover': {
        backgroundColor: 'black',
        color: 'white'
      }
    })
  };

  // Prepare values for Select components
  // const watcherValues = formData.watchers.map(watcher => ({
  //   value: watcher,
  //   label: watcher
  // }));

  // Find the current assignee option from the users list
  const getCurrentAssignee = () => {
    const matchedAssignee = options.find(option => option.value === formData.assignee);
    if (matchedAssignee) {
      return matchedAssignee;
    }
    return formData.assignee ? {
      value: formData.assignee,
      label: typeof formData.assignee === 'string' ?
        formData.assignee :
        `User ${formData.assignee}`
    } : null;
  };

  // Find the current status option
  const getCurrentStatus = () => {
    const matchedStatus = statusOptions.find(option => option.value === formData.status);
    if (matchedStatus) {
      return matchedStatus;
    }
    return formData.status ? { value: formData.status, label: formData.status.charAt(0).toUpperCase() + formData.status.slice(1) } : null;
  };

  useEffect(() => {
    if (users.data?.length > 0) {
      const formattedWatchers = typeof item.watchers === 'string'
        ? item.watchers.split(",").map(w => w.trim()).filter(Boolean)
        : Array.isArray(item.watchers) ? item.watchers : [];

      setInitialFormData({
        title: item.title || "",
        description: item.description || "",
        status: item.status || "",
        watchers: formattedWatchers,
        assignee: item.assignee || "",
        comment: item.comment || "",
      });

      setFormData({
        title: item.title || "",
        description: item.description || "",
        status: item.status || "",
        watchers: formattedWatchers,
        assignee: item.assignee || "",
        comment: item.comment || "",
      });
    }
  }, [item, users.data]);
  useEffect(() => {
    const isSame =
      formData.title === initialFormData.title &&
      formData.description === initialFormData.description &&
      formData.status === initialFormData.status &&
      formData.assignee === initialFormData.assignee &&
      formData.comment === initialFormData.comment &&
      JSON.stringify([...formData.watchers].sort()) === JSON.stringify([...initialFormData.watchers || []].sort());

    setIsBtnDisabled(isSame);
  }, [formData, initialFormData]);


  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>&times;</button>
        <div className="popup-content">
          <h5>Edit Case</h5>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditCase(formData);
          }}>
            <label htmlFor="title">Title *</label>
            <input
              className="com"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
            />
            {error.title && <p style={{ color: "red", margin: '0px' }} >{error.title}</p>}

            <label htmlFor="description">Description *</label>
            <input
              className="com"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
            {error.description && <p style={{ color: "red", margin: '0px' }} >{error.description}</p>}

            <label htmlFor="assignee">Assignee </label>
            <Select
              options={options}
              name="assignee"
              styles={customStyles}
              className="com"
              placeholder="Select Assignee"
              // defaultInputValue={formData.assignee}
              value={getCurrentAssignee()}
              onChange={handleAssigneeChange}
              defaultMenuIsOpen={false}
              openMenuOnClick={true}
            />



            <label htmlFor="watchers">Watchers</label>
            <Select
              options={options}
              isMulti
              styles={customStyles}
              className="com"
              name="watchers"
              placeholder="Select watchers"
              value={formData.watchers.map((watcher) => {
                const existingWatcher = options.find((opt) => opt.label === watcher);
                return existingWatcher || { value: watcher, label: watcher };
              })
              }
              onChange={handleWatchersChange}
            />


            <label htmlFor="status">Status:</label>
            <Select
              options={statusOptions}
              name="status"
              styles={customStyles}
              className="com"
              placeholder="Select status"
              value={getCurrentStatus()}
              onChange={handleStatusChange}
              defaultMenuIsOpen={false}  // Ensures menu starts closed
              openMenuOnClick={true}
            />

            <label htmlFor="comment">Comment:</label>
            <input
              className="com"
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Add a comment"
            />

            <div className="button-container">
              <button type="submit" className="create-btn" disabled={isBtnDisabled}>Update</button>
              <button type="button" className="cancel-btn" onClick={togglePopup}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCase;