
import GenericRepository from "./genericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }

    register = (doc) =>{
        return this.create(doc);
    }
    getUserByEmail = (email) =>{
        return this.getBy({email});
    }
    getUserById = (id) =>{
        return this.getBy({_id:id})
    }
    updateUser = (id,doc) =>{
        return this.update(id,doc);
    }
    deleteUser = (id) =>{
        return this.delete(id);
    }
    
}