const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const { code, language } = req.body;

    if (!code) {
        return res.status(400).send("Prompt is required");
    }

    try {
        const response = await aiService(code, language);
        res.send(response);
    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(error.status || 500).send(error.message || "An error occurred while generating the code review.");
    }
}