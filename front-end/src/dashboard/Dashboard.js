import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
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
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);


  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setError)

    return () => abortController.abort();
  }

        
      const reservsRows = reservations.map(({reservation_id, first_name, last_name, mobile_number, reservation_time, reservation_date, people}, index) => (
        <tr key={index}>
            <td>{reservation_id}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{mobile_number}</td>
            <td>{formatAsTime(reservation_time)}</td>
            <td>{reservation_date}</td>
            <td>{people}</td>
            <a type="button" className="btn btn-primary m-2" href={`/reservations/${reservation_id}/seat`}>Seat</a>
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
              <tbody>{reservsRows}</tbody>
            </table>
          );


          const tableRows = tables.map(({table_id, table_name, capacity}, index) => (
            <tr key={index}>
              <td>{table_id}</td>
                <td>{table_name}</td>
                <td>{capacity}</td>
                <td></td>
            </tr>
            ));


          const currentTables = (
            <table>
              <thead>
                <tr>
                  <th>Table ID</th>
                  <th>Table Name</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          );




  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={error} />
      <div className="row">
        <div className="db-left">{currentReservations}</div>
        <div className="db-right">{currentTables}</div>
      </div>
      <div className="row">
      <button type="button" className="btn btn-primary m-2" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Prev</button>
      <button type="button" className="btn btn-primary m-2" onClick={() => history.push(`/dashboard`)}>Today</button>
      <button type="button" className="btn btn-primary m-2" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;

