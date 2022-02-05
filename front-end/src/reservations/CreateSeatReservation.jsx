/**
 * Component for the /reservations/:reservation_id/seat path
 * Allows the user to seat a reservation to a table
 *
 */

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateSeatReservation() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const { reservation_id } = useParams();
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
      await updateTable(reservation_id, formData.table_id, ac.signal);
      history.push(`/dashboard`);
    } catch (errorMesage) {
      setError(errorMesage);
    }

    return () => ac.abort();
  }

  function loadTables() {
    const ac = new AbortController();
    setError(null);
    listTables(ac.signal).then(setTables).catch(setError);

    return () => ac.abort();
  }

  useEffect(loadTables, []);

  return (
    <div>
      <ErrorAlert error={error} />

      <div>
        <h1 style={{color:"#284b63"}}>Seat A Reservation</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="table_id">

            <h3>Please choose a table:</h3>
            <select
              id="table_id"
              name="table_id"
              onChange={handleChange}
              style={{ width: "100%", fontSize:"20px" }}

              required
            >
              <option value="">-- Select an Option --</option>
              {tables.map(({ table_id, table_name, capacity }) => (
                <option key={table_id} value={table_id}>
                  {table_name} - {capacity}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn m-2" style={{backgroundColor: "#284b63", color:"#ffffff"}}><span className="oi oi-check" />
              &nbsp;
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => history.goBack()}
          ><span className="oi oi-x" />
          &nbsp;
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSeatReservation;
