from typing import List
from promptflow.core import tool

@tool
def generate_prompt_context_from_search_result(search_results: List[dict]) -> str:
    def format_doc(doc: dict):
        return f"Content: {doc['Content']}\nSource: {doc['Source']}"
    
    retrieved_docs = []

    for result in search_results:
        retrieved_docs.append({"Content": result["chunk"], "Source": result["title"]})


    doc_string = "\n\n".join([format_doc(doc) for doc in retrieved_docs])
    return doc_string