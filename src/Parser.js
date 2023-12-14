import allFunctions from "./functionLibrary.js";
import constants from "./constants.js";
import Function from "./Function.js";
const TokenTypes = {
    Whitespace: 0,
    Number: 1,
    FuncName: 2,
    Operation: 3,
    Parens: 4,
    EndOfFile: 5
};
const operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
    "**": (a, b) => a ** b
};
const isValid = {};
isValid[TokenTypes.Whitespace] = char => ' \t\n\xa0'.includes(char);
isValid[TokenTypes.Number] = (char, current) => '0123456789'.includes(char) || (char == '.' && !current.includes('.'));
isValid[TokenTypes.FuncName] = char => constants.letters.includes(char);
isValid[TokenTypes.Operation] = char => operators[char] !== undefined;
isValid[TokenTypes.Parens] = () => false;
class Parser {
    constructor(input) {
        this.stored = null;
        this.input = input;
        this.index = 0;
        this.lastFun = '';
    }
    getTokenType(char) {
        for(const typ of [TokenTypes.Whitespace, TokenTypes.Number, TokenTypes.FuncName, TokenTypes.Operation]) {
            if(isValid[typ](char, '')) {
                return typ;
            }
        }
        if(char == '(' || char == ')') {
            return TokenTypes.Parens;
        }
        throw `Invalid character: ${char}`;
    }
    nextRawToken() {
        let currentToken = '';
        let tokenType = TokenTypes.Whitespace;
        while(this.index < this.input.length) {
            const char = this.input[this.index];
            if(isValid[tokenType](char, currentToken)) {
                currentToken += char;
            } else if(tokenType == TokenTypes.Whitespace) {
                currentToken = char;
                tokenType = this.getTokenType(char);
            } else {
                break;
            }
            this.index++;
        }
        if(tokenType == TokenTypes.Whitespace) {
            return ['', TokenTypes.EndOfFile];
        }
        return [currentToken, tokenType];
    }
    nextToken() {
        if(this.stored != null) {
            const sto = this.stored;
            this.stored = null;
            return sto;
        }
        return this.nextRawToken();
    }
    doneWithInput() {
        return this.index >= this.input.length;
    }
    parse(bindings) {
        return this.parseOperationSet(['+', '-'], 
            () => this.parseOperationSet(['*', '/', '%'], 
                () => this.parseOperationSet(['**'], 
                    () => this.parseLowest(bindings))));
    }
    parseOperationSet(operations, innerFun) {
        let fun = innerFun();
        let nextToken = this.nextToken();
        while(nextToken[1] == TokenTypes.Operation && operations.includes(nextToken[0])) {
            const RHS = innerFun();
            const LHS = fun;
            const storedFun = operators[nextToken[0]];
            fun = context => storedFun(LHS(context), RHS(context));
            nextToken = this.nextToken();
        }
        this.stored = nextToken;
        return fun;
    }
    parseLowest(bindings) {
        const token = this.nextToken();
        switch(token[1]) {
            case TokenTypes.Number:
                const flo = Number.parseFloat(token[0]);
                return () => flo;
            case TokenTypes.FuncName:
                let actualFun = allFunctions[token[0]];
                this.lastFun = token[0];
                if(actualFun === undefined) {
                    const binding = bindings[token[0]];
                    if(binding === undefined) {
                        throw `${token[0]} is not defined as a function!`;
                    }
                    actualFun = new Function("", [], (context, i = context.n - context.N) => {
                        const _i = Math.max(0, Math.min(context.current_s.length, Math.round(i)));
                        if(_i < 0 || _i >= binding.length) {
                            return 0;
                        }
                        return binding[_i];
                    });
                }
                const nextToken = this.nextToken();
                if(nextToken[1] == TokenTypes.Parens && nextToken[0] == '(') {
                    const args = [];
                    let findClosingParens = this.nextToken();
                    while(findClosingParens[1] != TokenTypes.Parens || findClosingParens[0] != ')') {
                        this.stored = findClosingParens;
                        args.push(this.parse(bindings));
                        findClosingParens = this.nextToken();
                    }
                    return actualFun.makeCallTo(args); 
                }
                this.stored = nextToken;
                return actualFun.makeCallTo([]); 
            case TokenTypes.Parens:
                if(token[0] == '(') {
                    const body = this.parse(bindings);
                    const endParen = this.nextToken();
                    if(endParen[1] != TokenTypes.Parens || endParen[0] != ')') {
                        throw `Expecting closing parentheses, received ${endParen[0]}!`;
                    }
                    return body;
                }
            case TokenTypes.Operation:
                if(token[0] == '-') {
                    const inner = this.parseLowest();
                    return context => -1 * inner(context);
                }
        }
        throw `Unexpected token: ${token[0]}!`;
    }
}
export default Parser;