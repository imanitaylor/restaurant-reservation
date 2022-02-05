/**
 * Defines the /dashboard path.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */


import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import "./Dashboard.css";

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
    const ac = new AbortController();
    setError(null);
    listReservations({ date }, ac.signal).then(setReservations).catch(setError);

    listTables(ac.signal).then(setTables).catch(setError);

    return () => ac.abort();
  }

  return (
    <main>
      <h1 style={{color:"#284b63"}}>Dashboard</h1>
      <ErrorAlert error={error} />
      <div className="d-md-flex mb-3">
        <h3 className="mb-0" >Reservations for {date}</h3>
      </div>
      
      <div className="row">
        <button
          type="button"
          className="btn m-2" style={{backgroundColor: "#284b63", color:"#ffffff"}}
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        ><span className="oi oi-media-skip-backward" />
        &nbsp;
          Prev
        </button>
        <button
          type="button"
          className="btn btn-secondary m-2"
          onClick={() => history.push(`/dashboard`)}
        >
          Today
        </button>
        <button
          type="button"
          className="btn m-2" style={{backgroundColor: "#284b63", color:"#ffffff"}}
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next &nbsp;<span className="oi oi-media-skip-forward" />
        
        </button>
      </div>
      <div className="row">
        <div className="db-left">
          <ReservationsList reservations={reservations} />
        </div>
        <div className="db-right">
          <TablesList tables={tables} />
        </div>
      </div>
      
    </main>
  );
}

export default Dashboard;
