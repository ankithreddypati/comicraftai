import { config } from './config';

interface LLMPredictionParams {
  systemPrompt: string;
  userPrompt: string;
}

export async function predict({ systemPrompt, userPrompt }: LLMPredictionParams): Promise<string> {
  const response = await fetch(`https://api-inference.huggingface.co/models/${config.llmModel}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.hfApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant: Here's the JSON response:`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API responded with ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data[0].generated_text;

  console.log('Raw LLM response:', generatedText);

  // Extract JSON from the response
  const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  } else {
    throw new Error('Failed to extract valid JSON from LLM response');
  }
}