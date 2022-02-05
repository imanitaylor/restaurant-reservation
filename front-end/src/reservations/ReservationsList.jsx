/**
 * Component used/displayed in the Dashboard and Search components
 *
 * Displays a table of reservations
 *
 */

import React, { useState } from "react";
import { formatAsTime } from "../utils/date-time";
import { changeReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function ReservationsList({ reservations }) {
  const [error, setError] = useState(null);
  const history = useHistory();

  async function handleSeated(reservationId) {
    const ac = new AbortController();
    setError(null);
    try {
      await changeReservationStatus(reservationId, ac.signal);
    } catch (error) {
      setError(error);
    }
    return () => ac.abort();
  }

  async function handleCancel(reservationId) {
    const ac = new AbortController();
    setError(null);

    const result = window.confirm(
      "Do you want to cancel this reservation? \n\nThis can not be undone."
    );

    if (result === true) {
      try {
        await changeReservationStatus(reservationId, ac.signal);
        history.go();
      } catch (error) {
        setError(error);
      }
    }

    return () => ac.abort();
  }

  const reservsRows = reservations.map((reservation) => (
    <>
      <tr key={reservation.reservation_id}>
        <td>{reservation.reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        {reservation.status === "booked" && (
          <>
            <td className="border-0">
              <a
                className="btn btn-secondary m-2"
                onClick={() => handleSeated(reservation.reservation_id)}
                href={`/reservations/${reservation.reservation_id}/seat`}
              ><span className="oi oi-person" />
              &nbsp;
                Seat
              </a>
            </td>
            <td className="border-0">
              <a
                className="btn m-2" style={{backgroundColor: "#284b63", color:"#ffffff"}}
                onClick={() =>
                  history.push(`/reservations/:reservation_id/edit`)
                }
                href={`/reservations/${reservation.reservation_id}/edit`}
              ><span className="oi oi-pencil" />
              &nbsp;
                Edit
              </a>
            </td>
            <td className="border-0">
              <button
                className="btn btn-danger m-2"
                onClick={() => handleCancel(reservation.reservation_id)}
                data-reservation-id-cancel={reservation.reservation_id}
              ><span className="oi oi-x" />
              &nbsp;
                Cancel
              </button>
            </td>
          </>
        )}
      </tr>
    </>
  ));

  return (
    <div>
      <ErrorAlert error={error} />

      <table className="table" style={{fontSize:"18px"}}>
        <thead className="thead">
          <tr style={{color: "#284b63", background:"#d9d9d9"}}>
            <th className="border-bottom-0">Reservation Number</th>
            <th className="border-bottom-0">First Name</th>
            <th className="border-bottom-0">Last Name</th>
            <th className="border-bottom-0">Phone Number</th>
            <th className="border-bottom-0">Reservation Time</th>
            <th className="border-bottom-0">Reservation Date</th>
            <th className="border-bottom-0">Party Size</th>
            <th className="border-bottom-0">Status</th>
          </tr>
        </thead>
        <tbody>{reservsRows}</tbody>
      </table>
    </div>
  );
}

export default ReservationsList;
