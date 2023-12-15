import allFunctions from "./functionLibrary.js";
import Parser from "../classes/Parser.js";
import constants from "./constants.js";
export default varName => {
    if(allFunctions[varName] !== undefined) {
        return false;
    }
    const sampleParser = new Parser(varName);
    const rawToken = sampleParser.nextRawToken();
    const afterThat = sampleParser.nextRawToken();
    if(rawToken[1] != constants.TokenTypes.FuncName || afterThat[1] != constants.TokenTypes.EndOfFile) {
        return false;
    }
    return true;
};