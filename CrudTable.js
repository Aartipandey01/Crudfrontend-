
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';

function CrudTable({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    ID: '',
    Name: '',
    LastName: '',
    Email: '',
    Contact: '',
    Location: '',
    Address: '',
    Salary: '', 
    WorkingStatus: ''
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/emp/get`);
      setEmployees(res.data.data || res.data);  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async () => {
  setLoading(true);
  try {
    if (editId) {
      await axios.put(`http://localhost:5000/emp/update/${editId}`, formData);
    } else {
      const { ID, ...dataToSend } = formData;  // Remove empty ID when creating
      await axios.post(`http://localhost:5000/emp/createEmployee`, dataToSend);
    }
    await fetchEmployees();  // Ensure data is refreshed
    resetForm();
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/emp/delete/${id}`);
      setEmployees(prev => prev.filter(emp => emp.Id !== id)); // update UI immediately
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      ID: emp.Id,
      Name: emp.Name,
      LastName: emp.LastName,
      Email: emp.Email,
      Contact: emp.Contact,
      Location: emp.Location,
      Address: emp.Address,
      Salary: emp.Salary,
      WorkingStatus: emp.WorkingStatus
    });
    setEditId(emp.Id);
    setShowPopup(true);
  };

  const resetForm = () => {
    setFormData({
      ID: '',
      Name: '',
      LastName: '',
      Email: '',
      Contact: '',
      Location: '',
      Address: '',
      Salary: '',
      WorkingStatus: ''
    });
    setEditId(null);
    setShowPopup(false);
  };
  //logout
  const handleLogout = async () => {
  try {
    await axios.post('http://localhost:5000/logout/loggedout', {}, { withCredentials: true });
    onLogout();  
  } catch (err) {
    console.error('Logout failed', err);
  }
};


  return (
    <div className="app-container">
      <h1>Employee CRUD Table</h1>
      <button className="add-btn" onClick={() => setShowPopup(true)}>+ Add Employee</button>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      

      {loading ? <p>Loading...</p> : (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>LastName</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Address</th>
                <th>Salary</th>
                <th>WorkingStatus</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.Id}>
                  <td>{emp.Id}</td>
                  <td>{emp.Name}</td>
                  <td>{emp.LastName}</td>
                  <td>{emp.Email}</td>
                  <td>{emp.Contact}</td>
                  <td>{emp.Location}</td>
                  <td>{emp.Address}</td>
                  <td>{emp.Salary}</td>
                  <td>{emp.WorkingStatus}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(emp.Id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>{editId ? 'Edit Employee' : 'Add Employee'}</h3>
            <input name="Name" placeholder="Name" value={formData.Name} onChange={handleChange} />
            <input name="LastName" placeholder="LastName" value={formData.LastName} onChange={handleChange} />
            <input name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} />
            <input name="Contact" placeholder="Contact" value={formData.Contact} onChange={handleChange} />
            <input name="Location" placeholder="Location" value={formData.Location} onChange={handleChange} />
            <input name="Address" placeholder="Address" value={formData.Address} onChange={handleChange} />
            <input name="Salary" placeholder="Salary" value={formData.Salary} onChange={handleChange} />
            <input name="WorkingStatus" placeholder="WorkingStatus" value={formData.WorkingStatus} onChange={handleChange} />
            <div className="form-buttons">
              {loading ? (
                <p style={{ color: '#007bff', fontWeight: 'bold' }}>Processing...</p>
              ) : (
                <>
                  <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</button>
                  <button onClick={resetForm}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrudTable;
