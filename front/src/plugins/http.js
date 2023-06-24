const serverUrl = "http://localhost:4001"

export default {
    get: async (url) => {
        const options = {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        }

        const res = await fetch(`${serverUrl}/${url}`, options)
        return await res.json()
    },
    post: async (url, data) => {
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        }

        const res = await fetch(`${serverUrl}/${url}`, options)
        return await res.json()
    },
    postWithToken: async (url, data) => {
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: sessionStorage.getItem("token")
            },
            body: JSON.stringify(data)
        }

        const res = await fetch(`${serverUrl}/${url}`, options)
        return await res.json()
    },
}