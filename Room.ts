import {User} from './User';

export class Room {
    name: string;
    users: User[];
    reveal: boolean;

    constructor() {
        this.users = [];
        this.reveal = false;
    }
    addUser(newUser: User) {
        if (!newUser) {
            return;
        }
        var index = -1;

        for(var i=0;i < this.users.length;i++) {
            var user = this.users[i];

            if (newUser.id == user.id) {
                user.name = newUser.name;
                index = i;
            } else if (newUser.name === user.name) {
                index = i;
            }
        }

        if (index > -1) {   
            this.users[index].id = newUser.id;
        } else {
            this.users.push(newUser);
        }
    }

    removeUser(id: string) {
        var index = -1;
        for(var i=0;i < this.users.length;i++) {
            var user = this.users[i];
            if (user.id == id) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    getUser(userId: string) {
        for(var i=0;i < this.users.length;i++) {
            var user = this.users[i];
            if (user.id == userId) {
                return user;
            }
        }
        return {};
    }

    vote(userId: string, voteValue: string) {
        var user = this.getUser(userId);
        user.voted = true;
        user.voteValue = voteValue;
    }

    newVote() {
        for(var i=0;i < this.users.length;i++) {
            var user = this.users[i];
            user.voted = false;
            user.voteValue = null;
        }
        this.reveal = false;
    }
}