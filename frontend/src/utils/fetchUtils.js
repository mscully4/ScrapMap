//const baseURL = 'http://35.223.155.224/'
import axios from 'axios';
var debounce = require('debounce-promise')

const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:8000/' : `${window.location.origin}/backend/`

//General Functions
export function fetchCurrentUser(token) {
  return fetch(baseURL + 'core/current_user/', {
    headers: {
      Authorization: `JWT ${token}`,
    }
  });
}

export function fetchToken(data) {
  return fetch(baseURL + 'token-auth/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export function putNewUser(data) {
  return fetch(baseURL + "core/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
}


//Owner Functions
export function postNewCity(token, data) {
  return fetch(baseURL + "core/destination/", {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

export function postNewPlace(token, data) {
  return fetch(baseURL + "core/place/", {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
}

export function putEditCity(token, data) {
  const form = new FormData();
  form.append("pk", data.pk);
  form.append('city', data.city);
  form.append('country', data.country);
  form.append('countryCode', data.countryCode)
  form.append('latitude', data.latitude);
  form.append('longitude', data.longitude);

  return fetch(baseURL + "core/destination/" + data.pk + "/", {
    method: "PUT",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

export function putEditPlace(token, data) {
  const form = new FormData();
  form.append('pk', data.pk)
  form.append('destination', data.destination);
  form.append('name', data.name)
  form.append("address", data.address);
  form.append('street', data.street);
  form.append('city', data.city);
  form.append('state', data.state);
  form.append('country', data.state);
  form.append('zip_code', data.zip_code)
  form.append('latitude', data.latitude)
  form.append('longitude', data.longitude);
  form.append('types', data.types)
  form.append('placeId', data.placeId)
  for (var i=0; i<data.pictures.length; i++) {
    form.append('images', data.pictures[i]);
  }

  return fetch(baseURL + "core/place/" + data.pk + "/", {
    method: "PUT",
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: form,
  })
  .then(response => response.ok ? response.json() : null)
}

export function putEditPlaceAxios(token, data) {
  const form = new FormData();
  form.append('pk', data.pk)
  form.append('destination', data.destination);
  form.append('name', data.name)
  form.append("address", data.address);
  form.append('street', data.street);
  form.append('city', data.city);
  form.append('state', data.state);
  form.append('country', data.state);
  form.append('zip_code', data.zip_code)
  form.append('latitude', data.latitude)
  form.append('longitude', data.longitude);
  form.append('types', data.types)
  form.append('main_type', data.main_type)
  form.append('placeId', data.placeId)
  for (var i=0; i<data.pictures.length; i++) {
    form.append('images', data.pictures[i]);
  }

  const config = {
    onUploadProgress: function(progressEvent) {
      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
      console.log(percentCompleted)
    },
    headers: {
      'Content-Type': "multipart/form-data",
      Authorization: `JWT ${token}`,
    }
  }
 return axios.put(baseURL + "core/place/" + data.pk + "/", form, config)

}

export function deleteCity(token, data) {
  return fetch(baseURL + "core/destination/" + data.pk + "/", {
    method: "DELETE",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    }
  })
}

export function deletePlace(token, data) {
  return fetch(baseURL + "core/place/" + data.pk + "/", {
    method: "DELETE",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    }
  })
}

export function deleteImage(token, data) {
  return fetch(baseURL + "core/image/" + data.pk + "/", {
    method: "DELETE",
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    }
  })
}

//User Functions
function getUser(token, username) {
  return fetch(baseURL + "core/destinations/" + username + "/",{
    method: "GET",
  })
}

export const getUserDebounced = debounce(getUser, 1000)

function searchUsers(username) {
  return fetch(baseURL + "core/search/" + username + "/", {
    method: "GET",
  })
}

export const searchUsersDebounced = debounce(searchUsers, 1000)

//Password Reset Requests
export function requestToken(email) {
  return fetch(baseURL + 'core/password_reset/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email})
  })
}

export function validateToken(token) {
  return fetch(baseURL + "core/password_reset/validate_token/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: token})
  })
}

export function changePassword(token, password) {
  return fetch(baseURL + "core/password_reset/confirm/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: token, password: password})
  })
}