const Serializer = (object) => {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      if (/At$/.test(key)) {
        object[key] = new Date(Date.parse(object[key]));
      }
    }
  }
  return object;
}

module.exports = Serializer;