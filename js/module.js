async function postObjectAsJson(url, object, httpVerbum) {
    const objectAsJsonString = JSON.stringify(object)
    console.log(objectAsJsonString)
    const fetchOptions = {
        method: httpVerbum,
        headers: {
            "Content-Type": "application/json",
        },
        body: objectAsJsonString
    }
    const response = await fetch(url, fetchOptions)
    return response
}

async function restDelete(url) {
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: ""
    }
    const response = await fetch(url, fetchOptions)
    return response
}

function fetchAnyUrl(url) {
    return fetch(url).then(response => response.json())
}

const urlRegioner = "http://localhost:8080/tool/getregioner"

let regionMap = new Map()

async function fetchRegioner() {
    if (regionMap.size < 2) {
        console.log("fetch regioner fra backend")
        const regioner = await fetchAnyUrl(urlRegioner)
        regioner.forEach(region => regionMap.set(region.navn, region))
    }
    return regionMap
}

export {postObjectAsJson, fetchAnyUrl, restDelete, fetchRegioner}

