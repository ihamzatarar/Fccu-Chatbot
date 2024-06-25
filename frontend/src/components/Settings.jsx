import React, { useState } from 'react';
import './Styles/Settings.css';

const Settings = ({ onClose }) => {
  const [username, setUsername] = useState('Enter the Username');
  const [name, setName] = useState('Enter the Name');
  const [email, setEmail] = useState('example@mail.com');

  const handleFocus = (e) => {
    if (e.target.value === 'Enter the Username' || e.target.value === 'Enter the Name' || e.target.value === 'example@mail.com') {
      e.target.value = '';
    }
  };

  const handleBlur = (e) => {
    if (e.target.name === 'username' && e.target.value === '') {
      e.target.value = 'Enter the Username';
    } else if (e.target.name === 'name' && e.target.value === '') {
      e.target.value = 'Enter the Name';
    } else if (e.target.name === 'email' && e.target.value === '') {
      e.target.value = 'example@mail.com';
    }
  };

  return (
    <div id="menuWrapper" className="menu-wrapper">
      <div className="menu-settings">
        <button className="back-btn" onClick={onClose}>Back</button>
        <h2>Menu Settings</h2>
        <div className="card">
          <div className="row">
            {/* Form Section */}
            <div className="col-md-9">
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control mb-1"
                      defaultValue={username}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      defaultValue={name}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      type="text"
                      name="email"
                      className="form-control mb-1"
                      defaultValue={email}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <div className="alert alert-warning mt-3">
                      Your email is not confirmed. Please check your inbox.<br />
                      <a href="javascript:void(0)">Resend confirmation</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
