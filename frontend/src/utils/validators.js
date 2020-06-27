export const validateLatitude = (lat) => {
    return /^-?\d*(\.\d+)?$/.test(lat)
        && parseFloat(lat) >= -90 
        && parseFloat(lat) <= 90 ? true : false
}

export const validateLongitude = (lng) => {
    return /^-?\d*(\.\d+)?$/.test(lng)
        && parseFloat(lng) >= -180
        && parseFloat(lng) <= 180 ? true : false
}

export const validateString = (str, length) => {
    const regex = /^[a-zA-Z.,\' /_-]+$/
    return str !== "" ? regex.test(str) && str.length <= length : true
}

export const validateUsername = (str, length) => {
    const regex = /^[a-zA-Z1-9.-_]+$/
    return str !== "" ? regex.test(str) && str.length >= length && str.charAt(0) !== " ": true;
}

export const validatePassword = (str, length) => {
    const regex = /^[a-zA-Z1-9!@#$%^&*()-_=+<,>./?]+$/
    return str !== "" ? regex.test(str) && str.length >= length : true
}

export const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email !== "" ? re.test(email) : true;
  }