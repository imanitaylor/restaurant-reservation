/**
 * Component for the /search path
 *
 * User inputs a mobile number to look up and display all reservations regardless of status with that mobile number
 * 
 *  @returns {JSX.Element}
 *
 */

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";

function Search() {
  const history = useHistory();
  const [mobileNumber, setMobileNumber] = useState("");

  const [reservations, setReservations] = useState([]);

  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setMobileNumber(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const ac = new AbortController();
    setError(null);
    try {
      listReservations({ mobile_number: mobileNumber }, ac.signal)
        .then(setReservations)
        .then(() => setMobileNumber(""))
        .catch(setError);
    } catch (error) {
      setError(error);
    }

    return () => ac.abort();
  }

  return (
    <div>
      <h1 style={{color:"#284b63"}}>Search Reservations</h1>
      <ErrorAlert error={error} />
      <div className="row">
        <form onSubmit={handleSubmit} className="col-md-8">
          <h3>Find a reservation:</h3>

          <label htmlFor="mobile_number" className="col-4 m-4">
            <input
              id="mobile_number"
              type="text"
              name="mobile_number"
              style={{ width: "100%", fontSize:"20px" }}
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
              value={mobileNumber}
              required
            />
          </label>
          <button type="submit" className="btn m-2" style={{backgroundColor: "#284b63", color:"#ffffff"}}><span className="oi oi-magnifying-glass" />
              &nbsp;
            Find
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => history.push("/dashboard")}
          ><span className="oi oi-x" />
          &nbsp;
            Cancel
          </button>
        </form>
      </div>
      <div className="row">
        {reservations.length ? (
          <div className="db-left">
            <ReservationsList reservations={reservations} />
          </div>
        ) : (
          <h2 className="m-5">No reservations found</h2>
        )}
      </div>
    </div>
  );
}

export default Search;
