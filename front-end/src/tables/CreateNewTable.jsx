import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function CreateNewTable() {
        const initialFormState = {
            table_name: "",
            capacity: "",
          };
        
          const [formData, setFormData] = useState({ ...initialFormState });
          const [error, setError] = useState(null);
          const history = useHistory();
        
          const handleChange = ({ target }) => {
            setFormData({
              ...formData,
              [target.name]: target.value,
            });
          };
        
          async function handleSubmit(event) {
            event.preventDefault();
            const ac = new AbortController();
            setError(null);
            try {
              await createTable(
                { ...formData, capacity: Number(formData.capacity) },
                ac.signal
              );
              history.push(`/dashboard`);
            } catch (error) {
              setError(error);
            }
            
            return () => ac.abort();
          }
        
          return (
            <div>
              <h1>Create A New Table</h1>
              <ErrorAlert error={error} />
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <label htmlFor="table_name" className="col">
                    <h4>Table Name</h4>
                    <input
                      id="table_name"
                      style={{ width: "100%" }}
                      type="text"
                      name="table_name"
                      placeholder="Table Name"
                      onChange={handleChange}
                      value={formData.table_name}
                      required
                    />
                  </label>
                  <label htmlFor="capacity" className="col">
                    <h4>Table Capacity</h4>
                    <input
                      id="capacity"
                      style={{ width: "100%" }}
                      type="number"
                      name="capacity"
                      min={1}
                      onChange={handleChange}
                      value={formData.capacity}
                      required
                    />
                  </label>
                </div>
        
                <div>
                  <button type="submit" className="btn btn-primary m-2">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-2"
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          );
}

export default CreateNewTable;
