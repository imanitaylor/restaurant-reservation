/**
 * Component used/displayed in the Dashboard component
 *
 * Displays a table of tables
 * User has the ability to "finish" a reservation at a table
 *
 */

import React, { useState } from "react";
import { deleteTableReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function TablesList({ tables }) {
  const [error, setError] = useState(null);
  const history = useHistory();

  async function handleDelete(tableId) {
    const ac = new AbortController();
    setError(null);

    const result = window.confirm(
      "Is this table ready to seat new guests? \n\nThis can not be undone."
    );

    if (result === true) {
      try {
        await deleteTableReservation(tableId, ac.signal);
        history.push("/");
      } catch (error) {
        setError(error);
      }
    }

    return () => ac.abort();
  }

  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      <td>{table.table_id}</td>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {table.reservation_id ? "Occupied" : "Free"}
      </td>
      <td>
        {" "}
        {table.reservation_id && (
          <button
            type="button"
            className="btn btn-primary m-2"
            data-table-id-finish={table.table_id}
            onClick={() => handleDelete(table.table_id, table.reservation_id)}
          >
            Finish
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <ErrorAlert error={error} />

      <table className="table">
        <thead>
          <tr>
            <th className="border-bottom-0">Table ID</th>
            <th className="border-bottom-0">Table Name</th>
            <th className="border-bottom-0">Capacity</th>
            <th className="border-bottom-0">Status</th>
            <th className="border-bottom-0">Table Completion</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default TablesList;
