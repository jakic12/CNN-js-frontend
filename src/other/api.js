export function getNetworks(server) {
  return new Promise((resolve, reject) => {
    fetch(`${server.url}/getNetworks`, {
      method: `GET`,
      headers: {
        Authorization: `Bearer ${server.apiToken}`
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

export function createNetwork(name, shape, server) {
  return new Promise((resolve, reject) => {
    fetch(
      `${server.url}/createCnn?name=${name}&shape=${JSON.stringify(shape)}`,
      {
        method: `POST`,
        headers: {
          Authorization: `Bearer ${server.apiToken}`
        }
      }
    )
      .then(response => response.json())
      .then(json => {
        if (json.err) throw json.err;
        resolve(json);
      })
      .catch(reject);
  });
}

export function getNetwork(id, server) {
  return new Promise((resolve, reject) => {
    fetch(`${server.url}/getNetwork/${id}`, {
      headers: {
        Authorization: `Bearer ${server.apiToken}`
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.err) throw json.err;
        else resolve(json);
      })
      .catch(reject);
  });
}

export function login(user, pass, server) {
  return new Promise((resolve, reject) => {
    fetch(`${server.url}/login`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user,
        pass
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.err) throw json.err;
        else resolve(json.token);
      })
      .catch(reject);
  });
}
