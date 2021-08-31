const dbUsername = 'apikey-v2-380rhhqzbqk6eifbn30gvuevzk9903pdrrsd7f8ipknj';
const dbPassword = 'ee0e39016c30dc0fc4fd04d12a420174';
const basicAuth = 'Basic ' + btoa(dbUsername + ':' + dbPassword);
const baseUrl = "https://5804af1c-53d6-4cc1-b0eb-5219a1cc5775-bluemix.cloudantnosqldb.appdomain.cloud";

class RestService {

    /**
     * Save the record in table
     * insert into tablename (col1, col2,...) values ( ?, ?,...);
     * Reference: https://database.learn2build.in/couchdb/insert-records/      
     * @param {string} dbName 
     * @param {object} inputData 
     * @returns 
     */
    static async save(dbName, inputData) {
        const url = baseUrl + "/" + dbName;
        console.log(url);
        console.log(JSON.stringify(inputData));
        const { data } = await axios.post(url, inputData, { headers: { 'Authorization': basicAuth } });
        return data;
    }


    /**
     * Find All Records
     * Query: select * from tablename;
     * Reference: https://database.learn2build.in/couchdb/display-records/
     * @param {string} dbName 
     * @returns 
     */
    static async findAll(dbName) {

        const url = baseUrl + "/" + dbName + "/_all_docs?include_docs=true";
        console.log(url);
        const { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } });
        return data.rows.map(obj => obj.doc);
    }

    /**
     * Find Record by Id
     * Query: select * from tablename where id = ?
     * Reference: https://database.learn2build.in/couchdb/display-records/
     * @param {string} dbName 
     * @param {string} id 
     * @returns 
     */
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

    /**
     * Delete the record by id.
     * Step 1: Find Record by Id, If id does not exists, throw error "Invalid Id"
     * Step 2: If record exists, delete the record
     * Query: delete from tablename where id = ? 
     * Reference: https://database.learn2build.in/couchdb/delete-records/
     * @param {string} dbName 
     * @param {string} id 
     * @returns 
     */
    static async deleteOne(dbName, id) {

        const document = await this.findOne(dbName, id);
        console.log(document);
        const url = baseUrl + "/" + dbName + "/" + id + "?rev=" + document._rev;
        console.log(url);
        const { data } = await axios.delete(url, { headers: { 'Authorization': basicAuth } });
        return data;
    }


    /**
     * Update the record
     * Step 1: Find Record by Id, If id does not exists, throw error "Invalid Id"
     * Step 2: If record exists, update the record
     * Query: update tablename set column1 = ?, column2 = ?, .... where id = ?      
     * Reference: https://database.learn2build.in/couchdb/update-records/
     * @param {string} dbName 
     * @param {object} inputData 
     * @returns 
     */
    static async updateOne(dbName, inputData) {

        //1.get existing record
        let document = await this.findOne(dbName, inputData._id);
        if (!document) {
            throw new Error("Invalid Id");
        }

        //2. update field values
        let updatedObj = Object.assign(document, inputData);
        console.log(updatedObj);

        //3. Update 
        const url = baseUrl + "/" + dbName + "/" + inputData._id;
        console.log(url);
        console.log(JSON.stringify(updatedObj));

        const { data } = await axios.put(url, updatedObj, { headers: { 'Authorization': basicAuth } });
        return data;
    }


    /**
     * Find records based on the criteria
     * eg1: select * from tablename where name = ?
     * input: 
     * { 
     *     selector: { name : 'Naresh' }
     * }
     * eg2: select _id,name from tablename where name = ?
     * input: 
     * { 
     *     selector: { name : 'Naresh' },
     *     fields: ["_id","name"]
     * }
     * Reference: 
     * https://database.learn2build.in/couchdb/display-records/
     * https://database.learn2build.in/couchdb/sort-records/
     * @param {string} dbName 
     * @param {string} selector 
     * @returns 
     */
    static async query(dbName, selector) {
        const url = baseUrl + "/" + dbName + "/_find";
        console.log(url);
        console.log(JSON.stringify(selector));

        const { data } = await axios.post(url, selector, { headers: { 'Authorization': basicAuth } });
        return data.docs;
    }



}