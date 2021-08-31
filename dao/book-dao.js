
class BookDao {


    static async save(dbName, inputData) {
        const url = baseUrl+'/' + dbName
        console.log(url)
        console.log(inputData)
        const { result } = axios.post(url, inputData, { headers: { 'Authorization': basicAuth } })
        return result
    }
    static async findAll(dbName) {
        const url = baseUrl + "/" + dbName + "/_all_docs?include_docs=true";
        const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } })
        const results= data.rows.map(obj => obj.doc);
        console.table(results);
        return results;
        
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
    static async findBook(dbName,bookName) {
        const url = baseUrl + "/" + dbName + "/_find";
        console.log(url);
        let criteria={
            selector:{
                bookName:bookName
            }     
        }
        console.log(criteria)
        const { data } = await axios.post(url, criteria, { headers: { 'Authorization': basicAuth } });
        let result=data.docs.length!=0
        return result
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

    static async deleteOne(dbName, id) {
        const book = await this.findOne(dbName, id)
        console.log(book)
        const url = baseUrl + '/' + dbName + '/' + id + '?rev=' + book._rev;
        console.log(url)
        const { result } = await axios.delete(url, { headers: { 'Authorization': basicAuth } })
        return result;
    }
    static async updateBook(dbName, inputData) {

        //1.get existing record
        let document = await this.findOne(dbName, inputData._id);
        console.log(document)
        if (!document) {
            throw new Error("Invalid Id");
        }

        //2. update field values
        let updatedObj = Object.assign(document, inputData);
        console.log(updatedObj);

        //3. Update 
        const url = baseUrl + "/" + dbName + "/" + inputData._id+'?rev'+inputData._rev;
        console.log(url);
        console.log(JSON.stringify(updatedObj));

        const { data } = await axios.put(url, updatedObj, { headers: { 'Authorization': basicAuth } });
        return data;
    }
}