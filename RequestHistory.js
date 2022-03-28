module.exports = class RequestHistory {
    constructor() {
        this.requests = [];
    }

    check(req) {
        if (this.requests.filter((r) => {
            if(r) {
                let now = Date.now()
                return r.raw === req.raw && (Date.now() - r.date) < 100;
            }
            return [];
        }).length >= 1) { //Duplicate request
            return true;
        } else {
            this.requests.push(req);
            if (this.requests.length > 30)
                this.requests.shift();
            return false;
        }
    }
}