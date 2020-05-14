import testDataset from "./testDataset";
import {
  stringToUint8Array,
  uint8ArrayToString,
} from "../CNN-js/datasetProcessor";
import { CNN, NetworkArchitectures } from "../CNN-js/cnn";

//init database
const openDb = () => {
  return new Promise((resolve, reject) => {
    const promiseDb = window.indexedDB.open("CNNjs-localStore", 1);

    promiseDb.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("networks")) {
        db.createObjectStore("networks", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("datasets")) {
        db.createObjectStore("datasets", { keyPath: "id" });
      }
    };

    promiseDb.onsuccess = (db) => {
      resolve(promiseDb.result);
    };
    promiseDb.onerror = (e) => reject(e);
  });
};

const addRecord = (store_name, data) => {
  return new Promise((resolve, reject) => {
    console.log(store_name, data);
    openDb().then((db) => {
      const tx = db
        .transaction(store_name, "readwrite")
        .objectStore(store_name)
        .put(JSON.parse(JSON.stringify(data))); // before, it was ".put(data)" -> added because of function cloning

      tx.onsuccess = () => {
        resolve();
      };
      tx.onerror = (e) => {
        reject(e);
      };
    });
  });
};

const getRecord = (store_name, id) => {
  return new Promise((resolve, reject) => {
    openDb().then((db) => {
      const tx = db.transaction(store_name).objectStore(store_name).get(id);

      tx.onsuccess = (event) => {
        resolve(tx.result);
      };
      tx.onerror = (e) => {
        reject(e);
      };
    });
  });
};

const getAllRecordsAsObject = (store_name, keyProp) => {
  return new Promise((resolve, reject) => {
    openDb().then((db) => {
      const out = {};
      db
        .transaction(store_name, "readonly")
        .objectStore(store_name)
        .openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          out[cursor.value[keyProp]] = cursor.value;
          cursor.continue();
        } else {
          resolve(out);
        }
      };
    });
  });
};

export function getNetworks(server) {
  return new Promise(async (resolve, reject) => {
    if (server.url === `local`) {
      let localExisting = await getAllRecordsAsObject(`networks`, `id`);
      if (!localExisting) {
        localExisting = {};
      }

      const deserialized = {};

      Object.keys(localExisting).forEach((stringCNNIndex) => {
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
          Authorization: `Bearer ${server.apiToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
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
      const neuralNet = new CNN(shape || NetworkArchitectures.LeNet5);
      const net_id = new Date().getTime();
      neuralNet.name = name || net_id;
      neuralNet.id = net_id;
      addRecord("networks", JSON.parse(JSON.stringify(neuralNet)))
        .then(() => {
          resolve();
        })
        .catch((e) => reject(e));
    } else {
      fetch(
        `${server.url}/createCnn?name=${name}&shape=${JSON.stringify(shape)}`,
        {
          method: `POST`,
          headers: {
            Authorization: `Bearer ${server.apiToken}`,
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
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
      getRecord(`networks`, parseInt(id))
        .then((saved) => {
          console.log(saved);
          if (saved) {
            resolve(
              Object.assign(new CNN(saved), {
                name: saved.name,
                id: saved.id,
              })
            );
          } else {
            reject(`Network doesn't exist`);
          }
        })
        .catch(() => reject(`Local database error`));
    } else {
      fetch(`${server.url}/getNetwork/${id}`, {
        headers: {
          Authorization: `Bearer ${server.apiToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        pass,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.err) throw json.err;
        else resolve(json.token);
      })
      .catch(reject);
  });
}

export function getDatasets(server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      getAllRecordsAsObject(`datasets`, `id`)
        .then((localExisting) => {
          if (!localExisting) {
            localExisting = { testDataset: testDataset };
          }

          Object.keys(localExisting).forEach((id) => {
            if (typeof localExisting[id].data === "string") {
              localExisting[id].data = stringToUint8Array(
                localExisting[id].data
              );
            }
            localExisting[id].full = true;
          });
          resolve(localExisting);
        })
        .catch((e) => reject(e));
    } else {
      fetch(`${server.url}/getDatasets`, {
        method: `GET`,
        headers: {
          Authorization: `Bearer ${server.apiToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.err) throw json.err;
          //TODO: parse string data to uint8Array
          resolve(json);
        })
        .catch(reject);
    }
  });
}

export function getDataset(id, server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      getRecord(`datasets`, id)
        .then((dataset) => {
          resolve(dataset);
        })
        .catch((e) => reject(e));
    } else {
      fetch(`${server.url}/getDataset/${id}`, {
        headers: {
          Authorization: `Bearer ${server.apiToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.err) throw json.err;
          else resolve(json);
        })
        .catch(reject);
    }
  });
}

export function newDataset(dataset, server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      addRecord(`datasets`, dataset)
        .then(() => resolve())
        .catch((e) => reject(e));
    } else {
      //TODO: newDataset on server
    }
  });
}

export function setNetwork(network, server) {
  return new Promise((resolve, reject) => {
    if (server.url === `local`) {
      addRecord(`networks`, network)
        .then(() => resolve())
        .catch((e) => reject(e));
    } else {
      //TODO: newDataset on server
    }
  });
}
