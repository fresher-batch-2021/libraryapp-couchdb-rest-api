
class OrderService {
    static collectionName = "libraryapp_orders";

    static getDueDate() {

        const NO_OF_DAYS = 6;
        let dueDate = dayjs().add(NO_OF_DAYS, 'days').format('YYYY-MM-DD');
        return dueDate;
    }
    static async placeOrder(Obj) {
        const userObj = { _id: Obj.user._id, name: Obj.user.name };
        const bookObj = { _id: Obj.book._id, bookTitle: Obj.book.bookName };

        const data = {
            user: userObj,
            book: bookObj,
            orderDate: dayjs(),
            dueDate: this.getDueDate(),
            returnDate: null,
            status: 'ordered'

        }
        console.log(data);
        return await OrderDao.save(this.collectionName, data)
    }
    static async getAllOrders() {
        return OrderDao.findAll(this.collectionName);
    }
    //static async returnDate(orderId) {
    static async returnDate(Obj) {
        //let returnDate = dayjs();
        //let Obj = {_id: orderId, returnDate: returnDate, status:'RETURNED'};
        return OrderDao.updateOne(this.collectionName, Obj)
    }
    static getDiff(dueDate) {
        return dayjs().diff(dueDate, 'days')
    }

    static getRenewalDueDate(currentDueDate) {
        const RENEWAL_DAYS =3;
        return dayjs(currentDueDate).add(RENEWAL_DAYS, 'days').format('YYYY-MM-DD');
    }
    static async renewDate(Obj) {
        const dif = this.getDiff(Obj.dueDate)
        console.log(dif)
        if (dif <= 0) {
            Obj.dueDate = this.getRenewalDueDate(Obj.dueDate)
            Obj.status = 'renewed'
        } else {
            console.log("you cant renew")
            //throw new Error("You cannot renew");
        }
        return OrderDao.updateOne(this.collectionName, Obj)

    }
    static async bookTaken(bookId){
       
        return OrderDao.isBookTaken(this.collectionName,bookId)
    }

   
}
