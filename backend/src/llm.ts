import { config } from './config';

export async function generatePanelPrompts(story: string, panelCount: number): Promise<string[]> {
  try {
    console.log('Generating panel prompts for:', story);
    const response = await fetch(`https://api-inference.huggingface.co/models/${config.llmModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.hfApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Create ${panelCount} distinct image prompts for a comic strip based on this story: "${story}". Each prompt should describe a different scene or moment from the story, suitable for a single panel of the comic.`,
      }),
    });

    const responseText = await response.text();
    console.log('LLM API raw response:', responseText);

    if (!response.ok) {
      console.error('LLM API error:', response.status, responseText);
      throw new Error(`Failed to generate panel prompts: ${response.status} ${response.statusText}. Response: ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse LLM API response:', parseError);
      throw new Error(`Failed to parse LLM API response: ${responseText}`);
    }

    console.log('LLM API parsed response:', result);

    if (Array.isArray(result) && result[0] && typeof result[0].generated_text === 'string') {
      const generatedText = result[0].generated_text;
      // Split the generated text into separate prompts
      const prompts = generatedText.split('\n').filter((prompt: string) => prompt.trim() !== '');
      return prompts.slice(0, panelCount); // Ensure we only return the requested number of prompts
    } else {
      console.error('Unexpected response format:', result);
      throw new Error(`Unexpected response format from LLM: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error('Error in generatePanelPrompts:', error);
    throw error;
  }
}