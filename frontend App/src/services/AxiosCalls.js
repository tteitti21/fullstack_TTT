import axios from "axios";
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const postAll = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newInfos) => {
    const request = axios.put(`${baseUrl}/${id}`, newInfos)
    return request.then(response => response.data)
}

export default { getAll, postAll, deletePerson, update }