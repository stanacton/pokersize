
export class User {
    name: string;
    id: string;
    voted: boolean;
    voteValue: string;
    
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}