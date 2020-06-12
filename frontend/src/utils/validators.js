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

export const validateString = (str, length, canBeBlank) => {
    const regex = /^[a-zA-Z.,\' /-]+$/
    return canBeBlank ? (regex.test(str) && str.length <= length) || str === "" : regex.test(str) && str.length <= length && str.charAt(0) !== " "
}

export const validatePassword = (str) => {
    const regex = /^[a-zA-Z1-9!@#$%^&*()-_=+<,>./?]+$/
    return regex.test(str)
}

export const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }