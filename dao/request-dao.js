class RequestDao {
    static save(dbName, obj) {
        const url = baseUrl + '/' + dbName
        console.log(url)
        console.log(obj)
        const { result } = axios.post(url, obj, { headers: { 'Authorization': basicAuth } })
        return result

    }


    static async findBook(dbName, bookName) {
        const url = baseUrl + "/" + dbName + "/_find";
        console.log(url);
        let criteria = {
            selector: {
                bookName: bookName
            }
        }
        console.log(criteria)
        const { data } = await axios.post(url, criteria, { headers: { 'Authorization': basicAuth } });
        let result = data.docs.length != 0
        return result
    }
    static async findAll(dbName) {
        const url = baseUrl + "/" + dbName + "/_all_docs?include_docs=true";
        const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } })
        const results = data.rows.map(obj => obj.doc);
        console.table(results);
        return results;

    }

    static async addCount(dbName, id) {
        const url = baseUrl + "/" + dbName + '/' + id;
        const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } })
        return data

    }
    static async findOne(dbName, id) {
        const url = baseUrl + "/" + dbName + "/" + id;
        console.log(url);
        try {
            const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } });
            return data;
        } catch (err) {
            this.handleError(err);
        }
    }
    static handleError(err) {
        let { data, status } = err.response;
        console.log(data, status);
        console.log(data);
        if (status == 404) {
            throw new Error("Id not found");
        }
        throw new Error(data.error);
    }
    static async updateOne(dbName, inputData) {
        const order = await this.findOne(dbName, inputData._id)
        console.log(order)
        if (!order) {
            throw new Error("invalid order id")
        }
        let updatedObj = Object.assign(order, inputData);
        console.log(updatedObj);
        console.log(updatedObj)
        const url = baseUrl + '/' + dbName + '/' + updatedObj._id ;
        const { data } = axios.put(url, updatedObj, { headers: { 'Authorization': basicAuth } })
        return data
    }
}