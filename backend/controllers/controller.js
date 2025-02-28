import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const login = (req, res) => {
  const data = req.body;
  if (!data.username || !data.password) {
    return res.status(400).json({ error: "username and password required" });
  }

  if (data.username !== "testuser" || data.password !== "testuser") {
    return res.status(401).json({ error: "invalid credentials" });
  }

  return res.status(200).json({ status: true });
};

const grammarCheck = async (req, res) => {
  const data = req.body;
  if (!data.sentence) {
    return res.status(400).json({ error: "sentence required" });
  }

  const prompt = `Identify grammatical mistakes in the given sentence. Extract only words that are incorrect or contribute to grammatical errors based on their context. 

  - Do NOT flag words that are correctly used or valid within the sentence structure.
  - Exclude proper nouns (e.g., names, places) entirely, regardless of usage.
  - Do NOT flag singular or plural nouns unless they are used incorrectly in context.
  - Do NOT flag auxiliary or linking verbs (e.g., "is", "are", "was", "were") when correctly used.
  - Focus on incorrect verb forms, preposition misuse, subject-verb agreement, and improper word choice.
  - Return solely an array of incorrect words, formatted as follows: ["word1", "word2", "word3"]. 

  Sentence: "${data.sentence}"`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 2,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  const incorrectWords = response.data.choices[0].message.content.trim();
  res.json({ incorrectWords: JSON.parse(incorrectWords) });
};

export { login, grammarCheck };
