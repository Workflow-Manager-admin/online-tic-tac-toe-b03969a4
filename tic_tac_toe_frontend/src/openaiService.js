//
// Service for communicating with OpenAI API using the configured API key.
//

// PUBLIC_INTERFACE
/**
 * Sends a prompt to OpenAI's API and returns the response text.
 * @param {string} prompt - The user's question or instruction.
 * @param {object} [options] - Optional overrides (e.g., model, max_tokens).
 * @returns {Promise<string>} - The AI's response.
 */
export async function askOpenAI(prompt, options = {}) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OpenAI API key is missing. Make sure REACT_APP_OPENAI_API_KEY is set in your .env file."
    );
  }
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const defaultBody = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    ...options,
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(defaultBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error("OpenAI API error: " + error);
    }
    const data = await response.json();
    // For chat completions API, response format is:
    // { choices: [{ message: { content: "..." }, ... }], ... }
    return data?.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("[OpenAI Service]", err);
    throw err;
  }
}
