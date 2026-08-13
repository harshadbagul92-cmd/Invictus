import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Invictus API Server', timestamp: new Date().toISOString() });
});

// AI Mentor Chat Proxy Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, problemContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (openAiApiKey) {
      try {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are the Invictus AI Coding & System Architecture Mentor. You guide university students working on real-world government & corporate problem statements (Context: "${problemContext || 'General Hackathon Prototype'}"). Provide encouraging, technical, actionable, and structured guidance in 3-4 sentences max.`
              },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 250
          })
        });

        if (aiResponse.ok) {
          const data = await aiResponse.json();
          const replyText = data.choices[0]?.message?.content;
          return res.json({ reply: replyText, source: 'openai' });
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to local AI engine:', err.message);
      }
    }

    // Smart Canned Fallback Response Engine
    const lowerMessage = message.toLowerCase();
    let reply = `Great question regarding your project "${problemContext || 'Invictus Challenge'}". For this phase, make sure your data models enforce proper validation and edge-case handling before mentor review.`;

    if (lowerMessage.includes('database') || lowerMessage.includes('schema') || lowerMessage.includes('sql')) {
      reply = `For "${problemContext}", I recommend using PostgreSQL for core data and Redis for fast caching. Be sure to index foreign keys to keep latency low!`;
    } else if (lowerMessage.includes('metric') || lowerMessage.includes('accuracy') || lowerMessage.includes('model')) {
      reply = `Focus on Precision, Recall, and F1-Score rather than pure accuracy. Prepare a confusion matrix visualization to present to your mentor!`;
    } else if (lowerMessage.includes('pitch') || lowerMessage.includes('presentation') || lowerMessage.includes('internship')) {
      reply = `Your pitch deck should highlight: 1) The Real-World Problem, 2) Architecture & Stack, 3) Verified Benchmark Results, and 4) Scalability Potential.`;
    }

    return res.json({ reply, source: 'canned_knowledge_base' });

  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Invictus Express API Server running on port http://localhost:${PORT}`);
});
