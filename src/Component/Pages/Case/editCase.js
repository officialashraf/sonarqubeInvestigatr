import{ useState, useEffect } from "react";
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

  const userData = async () => {
    const token = Cookies.get("accessToken");
    try {
      const response = await axios.get('http://5.180.148.40:9000/api/user-man/v1/user', {
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
    userData();
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
    }
  }, [item, users.data]);


  const handleEditCase = async (formData) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Authentication error: No token found");
      return;
    }

    try {

      const hasChanged = {};

      // Only include fields that have actually changed
      if (formData.title !== item.title) hasChanged.title = formData.title;
      if (formData.description !== item.description) hasChanged.description = formData.description;
      if (formData.status !== item.status) hasChanged.status = formData.status;
      if (formData.assignee !== item.assignee) hasChanged.assignee = formData.assignee;
      if (formData.comment !== item.comment) hasChanged.comment = formData.comment;

      // Special handling for watchers array
      const originalWatchers = typeof item.watchers === 'string' ? item.watchers :
        Array.isArray(item.watchers) ? item.watchers.join(", ") : "";
      const newWatchers = Array.isArray(formData.watchers) ? formData.watchers.join(", ") : formData.watchers;

      if (newWatchers !== originalWatchers) {
        hasChanged.watchers = newWatchers;
      }

      // If nothing has changed, just close the popup
      if (Object.keys(hasChanged).length === 0) {
        togglePopup();
        return;
      }

      const response = await axios.put(
        `http://5.180.148.40:9001/api/case-man/v1/case/${item.id}`,
        // updateData,
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
      toast.error(err.response?.data?.detail || "Failed to update case");
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
            <label htmlFor="title">Title <span style={{ color: 'black' }}>*</span></label>
            <input
              className="com"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              required
            />

            <label htmlFor="description">Description <span style={{ color: 'black' }}>*</span></label>
            <input
              className="com"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />

            <label htmlFor="assignee">Assignee <span style={{ color: 'black' }}>*</span></label>
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
              required
            />



            <label htmlFor="watchers">Watchers <span style={{ color: 'black' }}>*</span></label>
            <Select
              options={options}
              isMulti
              styles={customStyles}
              className="com"
              name="watchers"
              placeholder="Select Watchers"
              value={formData.watchers.map((watcher) => {
                const existingWatcher = options.find((opt) => opt.label === watcher);
                return existingWatcher || { value: watcher, label: watcher };
              })}
              onChange={handleWatchersChange}
              required

            />


            <label htmlFor="status">Status:</label>
            <Select
              options={statusOptions}
              name="status"
              styles={customStyles}
              className="com"
              placeholder="Select Status"
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
              <button type="submit" className="create-btn">Update</button>
              <button type="button" className="cancel-btn" onClick={togglePopup}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCase;