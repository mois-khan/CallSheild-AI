const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- 1. INITIATE CALL (Triggered by App or Postman) ---
exports.initiateCall = async (req, res) => {
    try {
        const { customerNumber } = req.body;

        // Validate customer number
        if (!customerNumber || customerNumber.trim().length === 0) {
            console.error("❌ [CallController] Missing customerNumber in request body!");
            return res.status(400).json({ error: "customerNumber is required in the request body." });
        }

        // Agent number is hardcoded — this is YOUR phone that rings first
        const agentNumber = "+918184881001";

        // 🔊 PROMINENT LOG — this is what you look for in Render dashboard
        console.log(`\n===================================================`);
        console.log(`📞 [CallController] NEW CALL REQUEST RECEIVED`);
        console.log(`   Agent  (rings first): ${agentNumber}`);
        console.log(`   Customer (dials after): ${customerNumber}`);
        console.log(`   Timestamp: ${new Date().toISOString()}`);
        console.log(`===================================================\n`);

        const ngrokUrl = "https://callshield-ai-backend.onrender.com"; 
        const callbackUrl = `${ngrokUrl}/api/twiml?customerNumber=${encodeURIComponent(customerNumber)}`;

        console.log(`[CallController] Callback URL: ${callbackUrl}`);

        const call = await client.calls.create({
            to: agentNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
            url: callbackUrl,
        });

        console.log(`✅ [CallController] Twilio Call SID: ${call.sid}`);
        return res.status(200).json({ callSid: call.sid });

    } catch (error) {
        console.error("❌ [CallController] Error starting call:", error);
        return res.status(500).json({ error: error.message });
    }
};

// --- 2. GENERATE TWIML (Triggered by Twilio) ---
exports.generateTwiml = (req, res) => {
    // Note: This function must be synchronous (no 'async') usually, 
    // unless you are looking up data.
    console.log("[CallController] Twilio has hit /api/twiml endpoint!");

    const customerNumber = req.query.customerNumber;
    
    // Hardcode here too just to be safe for now
    const ngrokUrl = "https://callshield-ai-backend.onrender.com"; 
    
    // Prepare the WebSocket URL (wss://)
    // We replace 'https' with 'wss'
    const wsUrl = ngrokUrl.replace("https://", "wss://") + "/stream";

    console.log(`[CallController] Connecting to Stream: ${wsUrl}`);
    console.log(`[CallController] Dialing Customer: ${customerNumber}`);

    const response = new VoiceResponse();

    // 1. Start Streaming
    const start = response.start();
    start.stream({
        url: wsUrl,
        track: 'both_tracks'
    });

    // 2. Dial the Customer
    const dial = response.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER, 
    });
    dial.number(customerNumber);

    // 3. Send XML back to Twilio
    res.type('text/xml');
    res.send(response.toString());
};