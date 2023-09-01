import openai
import streamlit as st
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI

st.title("FCCU ChatBot")

openai.api_key = st.secrets["OPENAI_API_KEY"]

if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-3.5-turbo"

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


loader = PyPDFLoader("docs/BACCA-CATALOG-22-ED.pdf")
pages = loader.load_and_split()
chunks = pages[68:81]
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(chunks, embeddings)
chain = load_qa_chain(OpenAI(temperature=0), chain_type="stuff")


if prompt := st.chat_input("What is up?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    docs = db.similarity_search(prompt)
    chain = load_qa_chain(OpenAI(temperature=0), chain_type="stuff")
    response_ans = chain.run(input_documents=docs, question=prompt)

    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""

        for response in response_ans:
            full_response += response
            message_placeholder.markdown(full_response + "▌")

        message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})
