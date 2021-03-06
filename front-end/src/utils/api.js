/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

//to look at the localhost OR our API during deployment
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates and saves a new reservation to the database.
 * Takes in a reservation from the user
 * @param reservation
 *  the reservation to save
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation.
 */
 export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: reservation}),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Creates and saves a new table to the database.
 * Takes in a table from the user
 * @param table
 *  the table to save
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves the saved table.
 */
 export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: table}),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Retrieves all existing table.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */

 export async function listTables(tables, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  Object.entries(tables).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
}


/**
 * This updates a table and a reservation.
 * The reservation is seated at a specific table
 * Takes in a reservation from the user
 * @param reservation_id
 *  the reservation that is to be seated
 * @param tableId
 * the table that is being used, the reservation will occupy
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves the saved table.
 */
 export async function updateTable(reservation_id, tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: {reservation_id} }),
    signal,
  };
  return await fetchJson(url, options);
}



/**
 * This deletes a reservation_id from a table once the reservation is finished
 * @param tableId
 * the table that is being used, the reservation will occupy
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves the saved table.
 */
 export async function deleteTableReservation(tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({data: {}}),
    signal,
  };
  return await fetchJson(url, options);
}


/**
 * This updates a reservations status
 * @param reservationId
 * the reservation that is being updated
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation.
 */
 export async function changeReservationStatus(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: {}}),
    signal,
  };
  return await fetchJson(url, options);
}


/**
 * Reads a reservation to the database.
 * @param reservation_id
 *  * Takes in a reservation_id
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation.
 */
export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}


/**
 * This updates a reservations
 * @param reservation
 * the new reservation information that is being updated
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation.
 */
export async function updateReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation.reservation_id}`);
  return await fetchJson(url, {
    headers,
    signal,
    method: 'PUT',
    body: JSON.stringify({data: reservation}),
  })

}