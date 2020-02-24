export function getNetworks(url, apiToken) {
  return new Promise((resolve, reject) => {
    fetch(`${url}/getNetworks`, {
      method: `GET`,
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.err) throw json.err;
        resolve(json);
      })
      .catch(reject);
  });
}

export function createNetworks(name, url, apiToken) {
  return new Promise((resolve, reject) => {
    fetch(`${url}/createCnn?name=${name}`, {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.err) throw json.err;
        resolve(json);
      })
      .catch(reject);
  });
}
