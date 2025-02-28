import dotenv from "dotenv"
dotenv.config();
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const Login = (req, res) => {
    const data = req.body;
    if (!data.username || !data.password) {
        return res.status(400).json({ "error": "username and password required" });
    }

    if (data.username !== 'testuser' || data.password !== 'testuser') {
        return res.status(401).json({ "error": "invalid credentials" });
    }

    return res.status(200).json({ "status": true });
};


const GrammarCheck = async(req,res)=>{
    console.log(OPENAI_API_KEY)
    const data = req.body;
    if (!data.sentence) {
        return res.status(400).json({ "error": "sentence required" });
    }

    const prompt = `
       Analyze the given sentence for grammatical mistakes. Identify only words that are grammatically incorrect or contribute to grammatical errors based on their context. 

        - Do **not** flag correctly used words.
        - Do **not** flag words that are valid in the sentence structure.
        - Do **not** flag proper nouns (e.g., names, places) unless misused.
        - Return **only** an array of incorrect words, without explanations.
        
        Sentence: "${data.sentence}"
        Response format: ["word1", "word2", "word3"]
    `;

    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0,
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
}

export { Login,GrammarCheck}
