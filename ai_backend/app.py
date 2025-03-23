from flask import Flask, request, Response
from flask_cors import CORS
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import random
import string
from LLM.Nilai import NillionLLM, OGLLM
from helpers import get_web3_prompt
from api_handler import create_coin, buy_coin

app = Flask(__name__)
CORS(app)

conversation_history = {}

# Function to generate a random ID string
def generate_random_id(length=20):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

@app.route('/chat', methods=['GET'])
def chat():
    query = request.args.get('query')
    llm = request.args.get('llm')

    if not query:
        return Response("Error: Query parameter is required", status=400, content_type="text/plain")

    # Determine which LLM to use based on the 'llm' parameter
    if llm == "0g":
        llm = OGLLM(
            model="og-basic",
            fallbackFee=0.000000000000000080000000000000005723
        )
    else:
        llm = NillionLLM(
            model="meta-llama/Llama-3.1-8B-Instruct",
            temperature=0.2,
            top_p=0.95,
            max_tokens=2048
        )

    conversation_id = request.args.get('conversation_id')
    if not conversation_id:
        conversation_id = generate_random_id()

    # Handle conversation history
    if conversation_id not in conversation_history:
        # Use the Web3 prompt generator
        web3_prompt = get_web3_prompt(request.args.get('character', 'blockchain-advisor'))

        # Add detailed UI formatting instructions
        web3_prompt += '''
        Important UI formatting instructions:
             - Don't use white color for the text. Use black color for the text.
             - Generate clean, visually appealing HTML for a chat bubble UI response using Tailwind CSS.
             - The response should resemble a chat bubble with no unnecessary buttons or extra spaces.
             - Ensure the text is easy to read and visually engaging.
             - Include appropriate blockchain/crypto-related emojis to enhance the chat experience.
             - If any URLs are present, make them clickable and styled properly (without showing the raw URL).
             - Use blockchain-appropriate styling #ffae5c for bg of bubble of the chat.
             - The UI should be responsive and look good on both desktop and mobile devices.
             - Avoid adding any unnecessary line spaces or elements outside of the chat bubble format.
             - Don't add any line spaces in the first line of the response and all of the lines.
             - Don't add padding in the text. Don't use unwanted padding for the tags.
             - If you are using the link emoji, make sure the link is clickable and the link is not the raw URL.
             - Add a 🔗 emoji before links in lists, and style links in a contrasting color.
             - Format code examples with appropriate syntax highlighting when relevant.
        '''

        web3_prompt += """
        Very important agent actions:

        Token creation or coin creation or token launch:
         - If the user asks to create a meme coin, then ask for the name of the coin, the symbol of the coin, and the initialSupply of the coin.
         - If the user provides the details of the coins, then add the keyword in your response: ~newcoincreaterequest#value1#value2#value3~.
        
        If the user asks for a meme coin to buy, list the following coins and ask the user to select one:
        - Dogecoin
        - Shiba Inu
        - Pepe
        - Banana
        - Cat

        Once the user selects, show a message that the coin has been added to their account.

        If the user asks to sell a coin, list the same coins and ask for a selection.
        Once the user selects a coin, show a message that the sell request has been sent successfully.
        """
        
        conversation_history[conversation_id] = [SystemMessage(content=web3_prompt)]

    # Add the user's message to conversation history
    conversation_history[conversation_id].append(HumanMessage(content=query))

    # Get the response from the LLM
    if llm == "0g":
        response = llm(query)
    else:
        response = llm.invoke(conversation_history[conversation_id])

    # Extract the content of the response if it's an object
    response_text = response.content if hasattr(response, 'content') else str(response)

    # Handle new coin creation request
    if "newcoincreaterequest" in response_text:
        coin_name = response_text.split("#")[2]
        coin_symbol = response_text.split("#")[3]
        coin_initial_supply = response_text.split("#")[4].split("~")[0]

        # Create the coin and send a confirmation message to the user
        out = create_coin(coin_name, coin_symbol, coin_initial_supply)
        response_text = llm.invoke(f"{str(out)} coin created successfully, so acknowledge the user about it.")

    # Add the AI response to conversation history
    conversation_history[conversation_id].append(AIMessage(content=response_text))

    # Return the response as a plain text
    return Response(response_text, content_type="text/plain")

@app.route('/health', methods=['GET'])
def health_check():
    """ Health check endpoint to verify the service is up and running. """
    return Response("OK", status=200, content_type="text/plain")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
