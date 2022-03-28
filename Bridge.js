const Scratch = require('new-scratch3-api');
const EventEmitter = require('events');
module.exports = class Bridge extends EventEmitter {
    constructor(username, password, projectId) {
        super();
        this.username = username
        this.password = password
        this.projectId = projectId
        this.initiated = false
    }

    async init() {
        if(!this.initiated) {
            this.session = await Scratch.UserSession.create(this.username, this.password);
            this.cloud = await this.session.cloudSession(this.projectId.toString());
            await this.cloud.connect();
        }
        this.initiated = true;
        this.emit('connected');
    }
}