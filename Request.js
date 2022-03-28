module.exports = class Request {

    constructor(game, request, variable) {
        this.game = game;
        this.raw = request;
        this.variable = variable;
        this.type = request.substring(0,4);
        this.size = Number.parseInt(request.substring(6,8));
        this.sessionId = request.substring(8,12);
        this.date = Date.now();
        this.data = []

        this.addData(Number.parseInt(request.substring(4,6)), request.substring(12,256));
        //value.substring(0,4), value.substring(4,6), value.substring(6,8), value.substring(8,12), variable, value.substring(12, 256)
    }

    addData(packetNum, data) {
        this.data[packetNum] = data;
    }

    getData() {
        let res = '';
        this.data.forEach((d) => {
            res += d;
        });
        return res;
    }

    processRequest() {
        new (this.game.requestHandlers[Number.parseInt(this.type)])(this.game, this).process();
    }

    handle() {
        if(!this.game.requestHistory.check(this)) { //Request hasn't been run recently 
            let pendingRequest = this.game.pendingRequests.filter((req) => {return req.sessionId === this.sessionId && req.requestId === (new Request(raw_request)).requestId})[0]
            if(pendingRequest) {
                pendingRequest.addPacket(this.raw);
                if(pendingRequest.data.length == pendingRequest.size+1) { //Request is built
                    this.processRequest(); //Process the request
                    let pos = this.game.pendingRequests.indexOf(pendingRequest)
                    this.game.pendingRequests.slice(pos, 1) //Remove the request from the pendingRequests queue
                }
            } else {
                if(this.data.length == this.size+1) { //Request is built
                    this.processRequest() //Process the request
                } else {
                    this.game.pendingRequests.push(this);
                }
                
            }
        }
    }
}