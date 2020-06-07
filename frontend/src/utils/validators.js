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
    return canBeBlank ? (/^[a-zA-Z ]+$/.test(str) && str.length <= length) || str === "" : /^[a-zA-Z ]+$/.test(str) && str.length <= length && str.charAt(0) !== " "
}