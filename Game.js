const Bridge = require('./Bridge');
const RequestHistory = require('./RequestHistory');
const Request = require('./Request');
const Session = require('./Session');
const UsernameEncoding = require('./UsernameEncoding.js');
const ServerInfoHandler = require('./ServerInfoHandler')

module.exports = class Game {
    static VariableType = require('./EVariableType');
    static ServerInfoHandler = require('./ServerInfoHandler')
    constructor(username, password, projectId) {
        this.scratch = {}
        this.scratch.username = username
        this.scratch.password = password
        this.scratch.projectId = projectId
        this.scratch.bridge = new Bridge(username, password, projectId);
        this.timings = {now: Date.now(), lastFrame: Date.now(), lastSecond: Date.now(), frames: 0}

        this.pendingRequests = [] //Requests that are waiting for more packets
        this.requestHistory = new RequestHistory() //Tracks the last 30 requests. Used to catch duplicates.

        this.variables = { //Default variables. This may (should) be overwritten by the extended class.
            server_information: ["☁ server_info1"],
            reqres: [
                {req: "☁ req1", res: "☁ res1"},
                {req: "☁ req2", res: "☁ res2"},
            ]
        }

        this.requestHandlers = { //Default request handlers
            0: require('./RequestHandlers/RequestSessionIdHandler'),
        }

        this.sessions = [];
    }

    async start() {
        let self = this;
        console.log("Starting game on project " + this.scratch.projectId);
        this.scratch.bridge.init();

        this.scratch.bridge.on('connected', () => {
            console.log("Connected!");
            let self = this;
            this.scratch.bridge.cloud.on('set', (variable, value) => {
                self.variableReader(variable, value.toString())
            });
            this.loop();
        });

        
    }

    registerRequestHandler(requestId, handler) {
        this.requestHandlers[requestId] = handler;
    }

    registerServerInfoHandler(handler) {
        var rtr = []
        this.variables.server_information.forEach(() => {rtr.push(undefined)})
        this.serverInfoHandler = new handler(rtr);
    }

    variableReader(variable, value) { //Runs whenever a variable is changed
        if(this.variables.reqres.filter((r) => {return r.req === variable}).length >= 1 && value != '0' && value != '1') { //Variable is a request var
            this.scratch.bridge.cloud.set(variable, 1);
            let request = new Request(this, value, variable);
            request.handle();
        }
        //console.log("Variable changed!" + p1 + ":" + p2 + ":" + p3);
    }

    getSession(sessionId) {
        return this.sessions.filter((sess) => {return sess.sessionId === sessionId})[0]
    }

    createSession(sessionId, username) {
        this.sessions.push(new Session(sessionId, username));
        console.log("New session created for " + username + " (" + sessionId + ")")
    }

    static formatTimestamp(timestamp) {
        if(timestamp.toString().length == 17) return timestamp
        while (timestamp.toString().length < 17) timestamp = "0" + timestamp.toString()
        return timestamp
    }

    static serverTime() {
        let now = Date.now()
        let start_date = new Date('2000-1-1 UTC')
        return ((now - start_date) / 86400000) * 1000000000000 //Format the date
    }

    static decodeUsername(username) {
        let res = ''
        for(var i = 0; i <= username.toString().length/3-1; i++) {
            res = res + UsernameEncoding[Number.parseInt(username.substring(i*3, i*3+3))]
        }
        return res;
    }

    async loop() {
        for(;;){
            //"Frame" counter
            this.timings.now = Date.now();
            let delta = this.timings.now - this.timings.lastFrame;
            this.timings.lastFrame = this.timings.now
            this.timings.frames=this.timings.frames+1;
            

            //"Frame" limiter
            let fps = 5
            if(delta < 1000/fps) {
                let a = (1000/fps)-delta;
                await new Promise(r => setTimeout(r, a*2));
            }

            //Set Server Info
            this.serverInfoHandler.process().forEach((info, i) => {
                this.scratch.bridge.cloud.set(this.variables.server_information[i], info);
            });
        }
        
    }
}