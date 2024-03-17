import users from "../schemas/users.schema.js";

class UsersDao {
    static async getUserByEmail(email) {
        return await users.findOne({ email: email });
    }

    static async getUserByCreds(email, password) {
        return await users.findOne({ email: email, password: password });
    }

    static async createUser(firstName, lastName, email, password) {
        return await new users({ firstName, lastName, email, password }).save();
    }

    static async getUserByID(id) {
        return await users.findOne({ _id: id }, { firstName: 1, lastName: 1, email: 1, isAdmin: 1 }).lean();
    }
}

export default UsersDao;
