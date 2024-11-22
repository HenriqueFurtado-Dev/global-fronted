// src/utils/apiHelper.js

export const extractEmbeddedData = (data, key) => {
    if (data._embedded && Array.isArray(data._embedded[key])) {
      return data._embedded[key];
    } else if (Array.isArray(data[key])) {
      return data[key];
    }
    return [];
  };
  