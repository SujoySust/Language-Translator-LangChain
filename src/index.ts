// Welcome to your TypeScript translator project!
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatPromptValueInterface } from "@langchain/core/prompt_values";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

// Load environment variables from .env file into a custom object to avoid warnings
const envConfig = dotenv.config({ processEnv: {} });
const env = envConfig.parsed || {};

interface TranslationOptions {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
}

class Translator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(options: TranslationOptions): Promise<string> {
    const { sourceLanguage, targetLanguage, text } = options;

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey: this.apiKey,
    });

    const messages = await this.preparePrompt(
      sourceLanguage,
      targetLanguage,
      text
    );

    // Direct response
    const directOutput = await this.directResponse(model, messages);
    return `[Translated from ${sourceLanguage} to ${targetLanguage}]: ${directOutput}`;
  }

  private async preparePrompt(
    sourceLanguage: string,
    targetLanguage: string,
    text: string
  ): Promise<ChatPromptValueInterface> {
    const systemTemplate =
      "Translate the following from {sourceLanguage} into {targetLanguage}";

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["user", "{text}"],
    ]);

    return await promptTemplate.invoke({
      sourceLanguage,
      targetLanguage,
      text,
    });
  }

  private async streamResponse(
    model: ChatOpenAI,
    messages: BaseLanguageModelInput
  ): Promise<string> {
    const stream = await model.stream(messages);
    for await (const chunk of stream) {
      console.log("chunk", chunk.content);
    }
    return stream.toString();
  }

  private async directResponse(
    model: ChatOpenAI,
    messages: BaseLanguageModelInput
  ): Promise<string> {
    const response = await model.invoke(messages);
    return response.content as string;
  }
}

// Example usage
async function main(): Promise<void> {
  const apiKey = env.OPENAI_API_KEY || "";
  const translator = new Translator(apiKey);

  const result = await translator.translate({
    sourceLanguage: "en",
    targetLanguage: "es",
    text: "Hello How are you?",
  });

  console.log(result);
}

if (require.main === module) {
  main().catch(console.error);
}

export { TranslationOptions, Translator };
