import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import useQuery from "../utils/useQuery";
import { previous, next, today, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import "./Dashboard.css"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  
  const query = useQuery();
  const getDate = query.get("date");

  if (getDate) {
    date = getDate;
  } else {
    date = today();
  }
  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

        
      const rows = reservations.map(({reservation_id, first_name, last_name, mobile_number, reservation_time, reservation_date, people}, index) => (
        <tr key={index}>
            <td>{reservation_id}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{mobile_number}</td>
            <td>{formatAsTime(reservation_time)}</td>
            <td>{reservation_date}</td>
            <td>{people}</td>
        </tr>
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
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          );






  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="row">{currentReservations}</div>
      <div className="row">
      <button type="submit" className="btn btn-primary m-2" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Prev</button>
      <button type="submit" className="btn btn-primary m-2" onClick={() => history.push(`/dashboard`)}>Today</button>
      <button type="submit" className="btn btn-primary m-2" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;

