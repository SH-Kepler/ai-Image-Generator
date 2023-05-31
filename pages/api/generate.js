import { Configuration, OpenAIApi } from "openai";

export default async function (req, res) {
  const configuration = new Configuration({
    apiKey: req.body.apiKey || '',
  });
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const text = req.body.text || '';
  const quantity = req.body.quantity || 1;
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      }
    });
    return;
  }

  if (quantity < 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid quantity",
      }
    });
    return;
  }

  try {
    const response = await openai.createImage({
      prompt: text,
      n: quantity,
      size: "1024x1024"
    });
    res.status(200).json({ result: response.data.data.map((e) => e.url) });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
