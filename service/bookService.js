class BookService {

    static collectionName = "libraryapp_books";

    static async addBooks(Obj) {
        return BookDao.save(this.collectionName, Obj)
    }
    static async getBooks() {
        return BookDao.findAll(this.collectionName)
    }
    static async deleteBook(id) {

        //step 1: check if any books ordered
        //let orders = await ORderDAO.findAll({ selector: { bookId: 123,status:'ORDERED'}})
        //let taken = orders.length > 0;
        //if taken, unable to delete book error message
        const bookData = await OrderService.bookTaken(id)
        console.log(bookData)
        if (bookData === true) {
            throw new Error('Book has been Ordered')
        }
        else {
            return BookDao.deleteOne(this.collectionName, id)
        }
    }
    static async update(bookObj) {

        return BookDao.updateBook(this.collectionName, bookObj)
    }
    static async findBookByName(bookName) {
        return BookDao.findBook(this.collectionName, bookName)
    }
}