

export const createFormUrlEncoded = (data) => {
  return new URLSearchParams(Object.entries(data)).toString();
}

