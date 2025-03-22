from flask import Flask, request, Response
from flask_cors import CORS
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
import uuid
from LLM.Nilai import NillionLLM
from helpers import get_mixed_prompt

app = Flask(__name__)
CORS(app)

conversation_history = {}

llm = NillionLLM(
        model="meta-llama/Llama-3.1-8B-Instruct",
        temperature=0.2,
        top_p=0.95,
        max_tokens=2048
    )

@app.route('/chat', methods=['GET'])
def chat():
    query = request.args.get('query')
    print(query)
    conversation_id = request.args.get('conversation_id')
    character = request.args.get('character', 'assistant')

    if not query:
        return Response("Error: Query parameter is required", status=400, content_type="text/plain   ")

    if not conversation_id:
        conversation_id = str(uuid.uuid4())

    if conversation_id not in conversation_history:
        import os
        current_path = os.path.dirname(os.path.abspath(__file__))
        prompt_path = os.path.join(current_path, "web3_prompt.txt")
        with open(prompt_path, "r") as file:
            web3_prompt = file.read()
            
        web3_prompt = get_mixed_prompt(character)
        web3_prompt = web3_prompt + '''
        Important:
             - make the ui more good. you are generateing the html for the chat response of user quesry it's actually bubble of response
             - add the style all of the tages for handling to avoid unwantent spaces and unwanted overlapping
             - dont use any unwanted line and line height spaces
             - Generate HTML for a clean, visually appealing chat bubble UI response. The response should be styled using Tailwind CSS. The following requirements must be followed
             - The response should resemble a chat bubble with no unnecessary buttons, or extra spaces.
             - Ensure the text is easy to read and visually engaging. Do not use white color for the text.
             - Include appropriate emojis to enhance the chat experience, but avoid using icons add the link emoji for each of the link if it contain in the ui.
             - If any URLs are present, make them clickable and styled properly (without showing the raw URL).
             - The UI should be responsive and look good on both desktop and mobile devices.
             - Avoid adding any unnecessary line spaces or elements outside of the chat bubble format.
             - dont add any line spaces in first line of the response and all of the lines.
             - dont any \n in the text. you must use the space between the words.
             - dont add padding in the text. dont use unwantend paddding for the tags.
             - dont add 'glass-box' in the text.
             - if you are using the link emoji make sure the link is clickable and the link is not the raw url make the different color for the link also add the 🔗 emoji before the link if it comes in list.
        '''
        # web3_prompt = web3_prompt + '''
        # The output should be in the following format:
        # ---------------------------------------------
        # {  
        #     "html_response": "<html response>",
        #     "messages": [
        #         {
        #             "text": "<text>",
        #             "facialExpression": "<facialExpression>",
        #             "animation": "<animation>"
        #         },
        #         {
        #             "text": "<text>",
        #             "facialExpression": "<facialExpression>",
        #             "animation": "<animation>"
        #         },
        #         {
        #             "text": "<text>",
        #             "facialExpression": "<facialExpression>",
        #             "animation": "<animation>"
        #         }
        #     ]
        # }
        # '''
        
        print(web3_prompt)
        conversation_history[conversation_id] = [
            SystemMessage(content=web3_prompt)
        ]

    conversation_history[conversation_id].append(HumanMessage(content=query))

    def generate_response():
        output_str = ""
        result = llm.stream(conversation_history[conversation_id])

        for chunk in result:
            # If chunk is a string, we can directly append it to output_str
            if isinstance(chunk, str):
                output_str += chunk
                yield chunk
            else:
                # If chunk is an object (in case the stream API returns objects), access its content
                chunk_text = getattr(chunk, 'content', '')  # Fallback to empty string if 'content' is missing
                output_str += chunk_text
                yield chunk_text
        print(output_str)

        conversation_history[conversation_id].append(AIMessage(content=output_str))

    return Response(generate_response(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
