class RequestService {
    static collectionName = 'libraryapp_requests'
    static async addRequest(obj) {
        const book = await BookService.findBookByName(obj.bookName)
        const request = await RequestDao.findBook(this.collectionName, obj.bookName)
        console.log(request)
        console.log(book)
        if (book === true) {
            throw new Error('Book Already Exists')
        } else if (request === true) {
            throw new Error('Book Already Requested')
        }
        return RequestDao.save(this.collectionName, obj)
    }

    static async findAllRequests() {
        return RequestDao.findAll(this.collectionName)
    }

    
    static async addNewCount(id, email) {
        const data = await RequestDao.addCount(this.collectionName, id)
        console.log(data);
        
        data.totalRequests.push(email)
        console.log(data)
        //return RequestDao.save(this.collectionName, data)
        return RequestDao.updateOne(this.collectionName , { _id: id, totalRequests : data.totalRequests});
    }
    static async findrequest(id) {
        const data = await RequestDao.findOne(this.collectionName, id)
        console.log(data)
        return data
    }
}