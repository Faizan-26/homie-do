export class User {

    constructor(id, name, email, profilePicture, subjectIds = []) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.subjectIds = subjectIds;

    }

    static fromJSON(json) {
        return new User(json.id, json.name, json.email, json.profilePicture, json.subjectIds || []);
    }

    static StoreToLocalStorage(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static GetFromLocalStorage() {
        const user = localStorage.getItem('user');
        return user ? User.fromJSON(JSON.parse(user)) : null;
    }

    static ClearLocalStorage() {
        localStorage.removeItem('user');
    }

    static IsLoggedIn() {
        return this.GetFromLocalStorage() !== null;
    }

    static getUserId() {
        const user = this.GetFromLocalStorage();
        return user ? user.id : null;
    }

    static Logout() {
        this.ClearLocalStorage();
    }

    addSubject(subjectId) {
        if (!this.subjectIds.includes(subjectId)) {
            this.subjectIds.push(subjectId);
            User.StoreToLocalStorage(this);
        }
        return this;
    }

    removeSubject(subjectId) {
        this.subjectIds = this.subjectIds.filter(id => id !== subjectId);
        User.StoreToLocalStorage(this);
        return this;
    }

    hasSubject(subjectId) {
        return this.subjectIds.includes(subjectId);
    }

    getSubjects() {
        return this.subjectIds;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            profilePicture: this.profilePicture,
            subjectIds: this.subjectIds
        }
    }
    getSubjects(){
        return this.subjectIds.map(id => Subject.getSubjectById(id));
    }
}
