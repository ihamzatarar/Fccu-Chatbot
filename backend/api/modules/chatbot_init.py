# import google.generativeai as genai

# from .indexing import extract_all_pdf_pages

# import os
# def init_chatbot():
#     genai.configure(api_key="AIzaSyCimiTOkBYVt5c6yQ_usYKFKou1bInsVsk")

#     # Set up the model
#     generation_config = {
#         "temperature": 1,
#         "top_p": 0.95,
#         "top_k": 0,
#         "max_output_tokens": 8192,
#     }

#     safety_settings = [
#         {
#             "category": "HARM_CATEGORY_HARASSMENT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#         },
#         {
#             "category": "HARM_CATEGORY_HATE_SPEECH",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#         },
#         {
#             "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#         },
#         {
#             "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#         },
#     ]

#     model = genai.GenerativeModel(model_name="gemini-1.5-flash-latest",
#                                   generation_config=generation_config,
#                                   safety_settings=safety_settings)

#     history = [
#         {
#             "role": "user",
#             "parts": [
#                 "You are a chatbot for FCCU to assist students by navigating the comprehensive university catalog. The chatbot should understand and provide detailed information on various sections such as the Message from the Rector, campus facilities, academic policies, financial aid, merit scholarships, departmental offerings across multiple disciplines (like Computer Science, Economics, English, etc.), and student life. It should accurately guide users to appropriate sections based on queries, understand context about different academic programs, and support students in finding information about fees, scholarships, academic support, and career opportunities. Prioritize clear, concise, and informative responses to enhance the academic experience"]
#         },
#         {
#             "role": "user",
#             "parts": [
#                 "Now i'm giving you catalog as text , use this as refernnce"]
#         },

#     ]
#     print("Current working directory:", os.getcwd())
#     docs_path = os.path.join(os.path.dirname(__file__), 'docs')
#     print("Docs path:", docs_path)
#     pages = extract_all_pdf_pages(docs_path)
#     for i in pages:
#         history.append({
#             "role": "user",
#             "parts": pages[i]
#         })

#     return model.start_chat(history=history)


# # This will create a global chatbot instance
# chatbot_instance = init_chatbot()

# # According to the catalog you provided
# # , as per the provided catalog:
