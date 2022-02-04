import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function Search() {
  
  
  const history = useHistory();
  const [mobileNumber, setMobileNumber] = useState("");

    const [reservations, setReservations] = useState([]);
 
        const [error, setError] = useState(null);
      
        const handleChange = (event) => {
          setMobileNumber(
             event.target.value,
          );
        };


  async function handleSubmit(event) {
    event.preventDefault();
    const ac = new AbortController();
    setError(null);
    try {listReservations( {mobile_number: mobileNumber}, ac.signal)
             .then(setReservations)
             .then(() => setMobileNumber(""))
             .catch(setError);
    } catch (error) {
      setError(error);
    }
    
    return () => ac.abort();
  }


  const reservsRows = reservations.map(( reservation, index) => (
    <>
         <tr key={index}>
         <td>{reservation.reservation_id}</td>
         <td>{reservation.first_name}</td>
         <td>{reservation.last_name}</td>
         <td>{reservation.mobile_number}</td>
         <td>{reservation.reservation_time}</td>
         <td>{reservation.reservation_date}</td>
         <td>{reservation.people}</td>
         <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
         </tr>      
         </>
     ));



     const currentReservations = (
      <table>
        <thead>
          <tr>
            <th>Reservation Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Reservation Time</th>
            <th>Reservation Date</th>
            <th>Party Size</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{reservsRows}</tbody>
      </table>
    );



    
  return (
    <div>
      <h1>Search Reservations</h1>
      <ErrorAlert error={error} />
      <div className="row">
      <form onSubmit={handleSubmit}  className="col-12">
      <h4>Find a reservation:</h4>
   
          <label htmlFor="mobile_number" className="col-3 m-4">
            <input
              id="mobile_number"
              type="text"
              name="mobile_number"
              style={{ width: "110%" }}
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
              value={mobileNumber}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary m-2">
            Find
          </button>
          <button
            type="button"
            className="btn btn-secondary m-2"
            onClick={() => history.push("/dashboard")}
          >
            Cancel
          </button>
      </form>
      </div>
      <div className="row">
       { reservations.length ? <div className="db-left">{currentReservations}</div> : <h2 className="m-5">No reservations found</h2> }
      </div>
    </div>
  )
}

export default Search;
