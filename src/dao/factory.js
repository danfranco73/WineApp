// factory for DAOs instances

import { UserDAO } from './userDAO'; // import the DAOs
import { PostDAO } from './postDAO'; // 

export class DAOFactory {
    static getDAO(type) {
        switch (type) {
            case 'user':
                return new UserDAO();
            case 'post':
                return new PostDAO();
            default:
                return null;
        }
    }
}

