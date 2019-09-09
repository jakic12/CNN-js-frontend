export function getNetworks(apiToken){
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3005/getNetworks`,{
          method: `GET`,
          headers: {
            'Authorization': `Bearer ${apiToken}`
          }
        }).then(response => response.json())
        .then(json => {
          if(json.err)
            throw new Error(json.err)
    
          console.log(json)
          resolve(json)
        })
        .catch(reject)
    })
}

export function createNetworks(apiToken){
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3005/createCnn`,{
          method: `POST`,
          headers: {
            'Authorization': `Bearer ${apiToken}`
          }
        }).then(response => response.json())
        .then(json => {
          if(json.err)
            throw new Error(json.err)
          resolve(json)
        })
        .catch(reject)
    })
}