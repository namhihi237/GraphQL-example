require("@babel/register");
import { server } from "../../src/app";
module.exports = async () => {
    global.server = server;
};
