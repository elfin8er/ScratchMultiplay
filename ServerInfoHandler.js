module.exports = class ServerInfoHandler {
    constructor(infos) {
        this.infos = infos;
    }

    process() {
        console.log("Hello world");
        return this.infos;
    }
}