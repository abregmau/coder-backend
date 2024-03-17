import users from "../schemas/user.schema.js";

class UsersDao {
    static async getUserByEmail(email) {
        return await users.findOne({ email: email });
    }

    static async getUserByCreds(email, password) {
        return await users.findOne({ email: email, password: password });
    }

    static async createUser(firstName, lastName, age, email, password) {
        return await new users({ firstName, lastName, age, email, password }).save();
    }

    static async getUserByID(id) {
        return await users.findOne({ _id: id }, { first_name: 1, last_name: 1, age: 1, email: 1 }).lean();
    }
}

export default UsersDao;
