
class OrderDao {
    static async save(dbName, data) {
        const url = baseUrl + '/' + dbName
        return axios.post(url, data, { headers: { 'Authorization': basicAuth } });
    }
    static async findAll(dbName) {

        const url = baseUrl + "/" + dbName + "/_all_docs?include_docs=true";
        console.log(url);
        const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } });
        console.table(data.rows.map(obj => obj.doc))
        return data.rows.map(obj => obj.doc);
    }
    static async findOne(dbName,id) {
        const url = baseUrl + '/' + dbName + '/' + id;
        console.log(url)
        try {
            const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } });
            return data;
        } catch (error) {
            this.handleError(error)
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
        const order = this.findOne(dbName, inputData._id)
        console.log(order)
        if (!order) {
            throw new Error("invalid order id")
        }
        let updatedObj = Object.assign(order, inputData);
        console.log(updatedObj);

        const url = baseUrl + '/' + dbName +'/'+ inputData._id+'?rev'+inputData._rev
        const { data } = axios.put(url, updatedObj, { headers: { 'Authorization': basicAuth } })
        return data
    }

    static async findByBookAndStatus(dbName, bookName) {
        const url = baseUrl + "/" + dbName + "/_find";
        console.log(url);
        console.log(JSON.stringify(selector));

        let selector = { 
            bookName : bookName,
            status : 'ordered'
        }
        const { data } = await axios.post(url, selector, { headers: { 'Authorization': basicAuth } });
        return data.docs;
    }

    static async isBookTaken(dbName,book_id) {
        const url = baseUrl + "/" + dbName + "/_find";
        console.log(url);
        let criteria={
            selector:{
                book:{_id:book_id},status:'renewed'
            }
            
        }
        console.log(criteria)
        const { data } = await axios.post(url, criteria, { headers: { 'Authorization': basicAuth } });
        let result=data.docs.length!=0;
        return result
    }

}