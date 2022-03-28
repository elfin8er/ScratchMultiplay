module.exports = class Session {
    constructor(sessionId, username) {
        this.sessionId = sessionId;
        this.username = username;
        this.lastSeen = Date.now();
    }
}