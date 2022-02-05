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
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={error} />
      <div className="row">
        <div className="db-left">
          <ReservationsList reservations={reservations} />
        </div>
        <div className="db-right">
          <TablesList tables={tables} />
        </div>
      </div>
      <div className="row">
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Prev
        </button>
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => history.push(`/dashboard`)}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
