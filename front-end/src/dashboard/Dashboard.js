import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables, deleteTableReservation, changeReservationStatus } from "../utils/api";
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

  async function handleDelete(tableId, reservationId, newStatus) {
    const ac = new AbortController();
    setError(null);

    const result = window.confirm(
      "Is this table ready to seat new guests? \n\nThis can not be undone."
    );

if (result === true) {

  try {
      await deleteTableReservation(
        tableId,
        ac.signal
      );
      loadDashboard();
    } catch (error) {
      setError(error);
    }
  }
    
    return () => ac.abort();
  }

        

  async function handleSeated(reservationId) {
    const ac = new AbortController();
    setError(null);
  try {
      await changeReservationStatus(
        reservationId,
        ac.signal
      );
      loadDashboard();
    } catch (error) {
      setError(error);
    }
    
    return () => ac.abort();
  }

      const reservsRows = reservations.map(( reservation, index) => (
       <>{ reservation.status !== "finished" && 
            <tr key={index}>
            <td>{reservation.reservation_id}</td>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{formatAsTime(reservation.reservation_time)}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            {reservation.status === "booked"&& (<td><a className="btn btn-primary m-2" onClick={() => handleSeated(reservation.reservation_id)} href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a></td>)}
            </tr>
            }       
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


          const tableRows = tables.map((table, index) => (
            <tr key={index}>
              <td>{table.table_id}</td>
                <td>{table.table_name}</td>
                <td>{table.capacity}</td>
                <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
                <td> {table.reservation_id && (<button type="button" className="btn btn-primary m-2" data-table-id-finish={table.table_id} onClick={() => handleDelete(table.table_id, table.reservation_id)}>Finish</button>)}</td>
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
                  <th>Table Completion</th>
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

