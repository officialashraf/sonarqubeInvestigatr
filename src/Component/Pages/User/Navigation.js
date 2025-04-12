import React from 'react'
import './Navigation.css';

const Navigation = () => {
  return <nav className="navigation">
      <ul className="nav-links">
        <li>
          <a href="/user" className="nav-link-show" style={{ borderBottom: "1px solid #00000" }}>
            Users
          </a>
        </li>
        <li>
          <a href="/roles" className="nav-link-show">
            Roles
          </a>
        </li>
      </ul>
    </nav>;
}

export default Navigation;