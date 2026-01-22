
import { huggingface } from '@ai-sdk/huggingface';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
dotenv.config();

const modelsToTest = [
  'meta-llama/Meta-Llama-3-8B-Instruct',
  'mistralai/Mixtral-8x7B-Instruct-v0.1',
  'mistralai/Mistral-7B-Instruct-v0.3',
  'Qwen/Qwen2.5-72B-Instruct',
  'microsoft/Phi-3-mini-4k-instruct',
  'google/gemma-7b-it'
];

async function testModels() {
  console.log("🔑 Checking HUGGINGFACE_API_KEY...");
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error("❌ HUGGINGFACE_API_KEY is missing in .env file");
    return;
  }
  console.log("✅ Key found (starts with " + process.env.HUGGINGFACE_API_KEY.substring(0, 5) + "...)");
  console.log("\n🧪 Testing Models...\n");

  for (const modelId of modelsToTest) {
    process.stdout.write(`Testing ${modelId}... `);
    try {
      const result = await generateText({
        model: huggingface(modelId),
        prompt: 'Say "Hello World" and nothing else.',
      });
      console.log(`✅ OK! Response: "${result.text.trim()}"`);
    } catch (error: any) {
      if (error.statusCode === 429) {
          console.log(`❌ Rate Limited (429)`);
      } else if (error.statusCode === 401 || error.statusCode === 403) {
          console.log(`❌ Auth Error (${error.statusCode})`);
      } else if (error.statusCode === 404) {
           console.log(`❌ Not Found / Not Supported (${error.statusCode})`);
      } else if (error.statusCode === 400) {
           console.log(`❌ Bad Request (400) - Likely not a Chat Model or format issue`);
      } else {
          console.log(`❌ Error: ${error.message || error}`);
      }
    }
  }
}

testModels();
