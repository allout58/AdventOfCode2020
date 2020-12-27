declare module 'jison' {
  interface ParserJson {
    lex: {
      rules: Array<[string, string]>;
    };
    bnf: Record<string, string[]>;
  }
  class Parser {
    constructor(json: ParserJson);
    parse(str: string): boolean;
  }
}
