import { useEffect, useState } from "react";
import "./addUser.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import CommonTextInput from "../../Common/MultiSelect/CommonTextInput";
import CommonSingleSelect from "../../Common/MultiSelect/CommonSingleSelect";
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';
import AppButton from "../../Common/Buttton/button";
import { useTranslation } from "react-i18next";
import { useAutoFocusWithManualAutofill } from "../../../utils/autoFocus";

const AddUser = ({ onClose }) => {
  const { t } = useTranslation();
  const token = Cookies.get("accessToken");
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    contact_no: "",
    password: ""
  });

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!formData.username.trim()) {
      errors.username = t("addUser.errors.username");
    }

    if (!formData.first_name.trim()) {
      errors.first_name = t("addUser.errors.firstName");
    }

    if (!formData.role.trim()) {
      errors.role = t("addUser.errors.role");
    }

    if (!formData.email.trim()) {
      errors.email = t("addUser.errors.email");
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t("addUser.errors.invalidEmail");
    }

    if (!formData.password.trim()) {
      errors.password = t("addUser.errors.password");
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = t("addUser.errors.invalidPassword");
    }

    return errors;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/roles`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const formattedRoles = response.data.map(role => ({
          value: role,
          label: role
        }));
        setRoles(formattedRoles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    const capitalizeFields = ['first_name', 'last_name', 'role'];

    if (name === 'username') {
      value = value.toLowerCase().replace(/\s/g, '');
    } else if (capitalizeFields.includes(name)) {
      value = value.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error(t("addUser.errors.authTokenMissing"));
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

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`,
        payloadData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(t("addUser.errors.userAddSuccess"));
        window.dispatchEvent(new Event("databaseUpdated"));
        onClose();
      } else {
        toast.error(t("addUser.errors.userAddFailed"));
      }
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.response?.data?.detail || t("addUser.errors.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>&times;</button>
        <div className="popup-content">
          <h5>{t("addUser.title")}</h5>
          <form onSubmit={handleCreateUser}>
            <CommonTextInput
              label={t("addUser.username")}
              ref={inputRef}
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t("addUser.usernamePlaceholder")}
              readOnly={isReadOnly}
              onFocus={handleFocus}
              requiblack
            />
            {error.username && <p style={{ color: "red", margin: '0px' }}>{error.username}</p>}

            <CommonTextInput
              label={t("addUser.firstName")}
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder={t("addUser.firstNamePlaceholder")}
            />
            {error.first_name && <p style={{ color: "red", margin: '0px' }}>{error.first_name}</p>}

            <CommonTextInput
              label={t("addUser.lastName")}
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder={t("addUser.lastNamePlaceholder")}
            />

            <CommonSingleSelect
              label={t("addUser.role")}
              options={roles}
              placeholder={t("addUser.rolePlaceholder")}
              isLoading={loading}
              value={roles.find(role => role.value === formData.role)}
              onChange={(selectedOption) => setFormData({ ...formData, role: selectedOption.value })}
              customStyles={customSelectStyles}
            />
            {error.role && <p style={{ color: "red", margin: '0px' }}>{error.role}</p>}

            <CommonTextInput
              label={t("addUser.email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("addUser.emailPlaceholder")}
              requiblack
            />
            {error.email && <p style={{ color: "red", margin: '0px' }}>{error.email}</p>}

            <CommonTextInput
              label={t("addUser.contact")}
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              placeholder={t("addUser.contactPlaceholder")}
            />

            <CommonTextInput
              label={t("addUser.password")}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("addUser.passwordPlaceholder")}
              requiblack
            />
            {error.password && <p style={{ color: "red", margin: '0px' }}>{error.password}</p>}

            <div className="button-container">
              <AppButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("addUser.creating") : t("addUser.create")}
              </AppButton>
              <AppButton type="button" onClick={onClose}>
                {t("addUser.cancel")}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
