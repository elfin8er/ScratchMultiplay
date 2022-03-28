module.exports = class VariableType {
    static SERVERINFO1 = new VariableType("serverinfo1");
    static SERVERINFO2 = new VariableType("serverinfo2");
    static SERVERINFO3 = new VariableType("serverinfo3");
    static SERVERINFO4 = new VariableType("serverinfo4");
    static SERVERINFO5 = new VariableType("serverinfo5");
    static SERVERINFO6 = new VariableType("serverinfo6");
    static SERVERINFO7 = new VariableType("serverinfo7");
    static SERVERINFO8 = new VariableType("serverinfo8");
    static SERVERINFO9 = new VariableType("serverinfo9");
    static SERVERINFO10 = new VariableType("serverinfo10");
    static REQUESTHANDLER = new VariableType("requesthandler");
    static RESPONSEHANDLER = new VariableType("responsehandler");

    constructor(type) {
        this.type = type
    }
}