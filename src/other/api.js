const { CNN, NetworkArchitectures } = require("../CNN-js/cnn");

export function getNetworks(server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      const localExisting = JSON.parse(localStorage.getItem(`localNetworks`));
      if (!localExisting) {
        localStorage.setItem(`localNetworks`, `{}`);
        localExisting = {};
      }

      const deserialized = {};

      Object.keys(localExisting).forEach(stringCNNIndex => {
        const o = new CNN(localExisting[stringCNNIndex]);
        o.name = localExisting[stringCNNIndex].name;
        o.id = localExisting[stringCNNIndex].id;
        deserialized[stringCNNIndex] = o;
      });

      resolve(deserialized);
    } else {
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
    }
  });
}

export function createNetwork(name, shape, server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      const existing = JSON.parse(localStorage.getItem(`localNetworks`));
      const neuralNet = new CNN(shape || NetworkArchitectures.LeNet5);
      const net_id = new Date().getTime();
      neuralNet.name = name || net_id;
      neuralNet.id = net_id;
      localStorage.setItem(
        `localNetworks`,
        JSON.stringify(Object.assign(existing || {}, { [net_id]: neuralNet }))
      );
      resolve({ network_id: net_id });
    } else {
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
    }
  });
}

export function getNetwork(id, server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      const existing = JSON.parse(localStorage.getItem(`localNetworks`));
      if (existing[id]) {
        resolve(
          Object.assign(new CNN(existing[id]), {
            name: existing[id].name,
            id: existing[id].id
          })
        );
      } else {
        reject(`Network doesn't exist`);
      }
    } else {
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
    }
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
