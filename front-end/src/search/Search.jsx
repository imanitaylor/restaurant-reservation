/**
 * Component for the /search path
 *
 * User inputs a mobile number to look up and display all reservations regardless of status with that mobile number
 * 
 *  @returns {JSX.Element}
 *
 */

import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";

function Search() {
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
      <div>
        <form onSubmit={handleSubmit} className="col">
          <h4>Find a reservation:</h4>
          <div className="row">
          <label htmlFor="mobile_number" className="col-8 m-1 p-1">
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
          <button type="submit" className="btn m-1" style={{backgroundColor: "#284b63", color:"#ffffff"}}><span className="oi oi-magnifying-glass" />
              &nbsp;
            Find
          </button>
          </div>
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
