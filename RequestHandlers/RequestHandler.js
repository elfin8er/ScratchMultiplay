module.exports = class RequestHandler {
    constructor(game, request) {
        this.type = "undefined";
        this.game = game;
        this.request = request;
    }
    process() {
        console.log("Handling " + this.type + " request from " + this.request.sessionId + ": " + this.request.getData());
    }

    respond(data) {
        //If data is a string, we'll encode the data before sending it
        if(!data instanceof Number) {
            data = this.game.encode_generic(data);
        }
        //If data is a number, we'll assume it's already been encoded.
        //TODO: If the response length is too long, we'll need to send it in multiple packets.
        //Add the headers
        var res = this.request.type + '0000' + this.request.sessionId + data

        //Send response to the expected response variable
        var asdf = this.game.variables.reqres.filter((reqres) => {return reqres.req === this.request.variable})[0].res
        this.game.scratch.bridge.cloud.set(asdf, res);
    }
}
