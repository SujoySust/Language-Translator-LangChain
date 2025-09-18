interface TranslationOptions {
    sourceLanguage: string;
    targetLanguage: string;
    text: string;
}
declare class Translator {
    private apiKey;
    constructor(apiKey: string);
    translate(options: TranslationOptions): Promise<string>;
}
export { Translator, TranslationOptions };
//# sourceMappingURL=index.d.ts.map