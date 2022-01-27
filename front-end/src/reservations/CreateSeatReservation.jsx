import React, { useState, useEffect }from 'react';
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateSeatReservation() {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const {reservationId} = useParams();
    const initialFormState = {
        table_name: "",
      };
    const [formData, setFormData] = useState({ ...initialFormState });
     
      const handleChange = ({ target }) => {
        setFormData({
          [target.name]: target.value,
        });
      };
    

    async function handleSubmit(event) {
        event.preventDefault();
        const ac = new AbortController();
        setError(null);
        try {
          await updateTable(
            reservationId, formData.value,
            ac.signal
          );
          history.push(`/dashboard`);
        } catch (errorMesage) {
          setError(errorMesage);
        }
        
        return () => ac.abort();
      }



      function loadTables() {
        const abortController = new AbortController();
        setError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setError)
    
        return () => abortController.abort();
      }
    
      useEffect(loadTables, []);




  return <div>
      <ErrorAlert error={error} />

<div>
<form onSubmit={handleSubmit}>
<label htmlFor="table_id">
                Seat at:
                <select 
                id="table_id" 
                name="table_id" 
                onChange={handleChange} 
                value={formData.table_id}
                >
                   <option value="">-- Select an Option --</option>
                  {tables.map(({table_id, table_name, capacity}) => (
                    <option value={table_id}>{table_name} - {capacity}</option>
                  ))}
                </select>
                </label>


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
          </form>
        </div>
  </div>;
}

export default CreateSeatReservation;
