const RequestHandler = require('./RequestHandler');
const Game = require('../Game');

module.exports = class RequestSessionIdHandler extends RequestHandler {
    constructor(game, request) {
        super(game, request);
        this.type = "RequestSessionId";
    }
    process() {
        super.process();
        let self = this;
        this.data = this.request.getData();
        let sessionId = this.request.sessionId;
        let username = Game.decodeUsername(this.data.substring(0, 256));
        var openUserSession = this.game.sessions.filter((sess) => { //Checks to see if the user already has any sessions open
            if(sess.username = username) {return sess}
        })[0];
        if(openUserSession) { //User already has a session open!
            console.log("Session already open!");
            sessionId = openUserSession.sessionId;
        } else {
            var openSessions = this.game.sessions.filter((sess) => {
                if(sess.sessionId = self.request.sessionId) {return sess}
            });
            if(openSessions.length >= 1) {
                //Session ID is already taken TODO: Respond with an available sessionId
            } else {
                this.game.createSession(sessionId, username)
            }
        }
        this.respond(sessionId);
    }
}
