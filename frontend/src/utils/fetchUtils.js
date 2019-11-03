const baseURL = 'http://localhost:8000/'

export function fetchCurrentUser(token) {
  return fetch(baseURL + 'core/current_user/', {
    headers: {
      Authorization: `JWT ${token}`,
    }
  }).then(response => response.json());
}

export function fetchToken(data) {
  return fetch(baseURL + 'token-auth/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.ok ? response.json() : null);
}

export function putNewUser(data) {
  return fetch(baseURL + "core/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  .then(response =>  response.ok ? response.json() : null);
}

export function postNewCity(token, data) {
  return fetch(baseURL + "core/destinations/", {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  .then(response => response.ok ? response.json() : null)
}

export function putEditCity(token, data) {
  //console.log(data)
  const form = new FormData();
  form.append("pk", data.pk);
  form.append('city', data.city);
  form.append('country', data.country);
  form.append('latitude', data.latitude);
  form.append('longitude', data.longitude);
  for (var i=0; i<data.files.length; i++) {
    form.append('images', data.files[i]);
  }
  // form.append('images', data.files);

  return fetch(baseURL + "core/destinations/" + data.pk + "/", {
    method: "PUT",
    headers: {
      Authorization: `JWT ${token}`,
      //"Content-Type": "application/json",
    },
    body: form,
  })
  .then(response => response.ok ? response.json() : null)
}