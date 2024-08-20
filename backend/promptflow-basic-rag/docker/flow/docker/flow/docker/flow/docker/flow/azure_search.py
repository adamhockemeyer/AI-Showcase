import os
# set environment variables before importing any other code
from dotenv import load_dotenv
load_dotenv('.env.local')
load_dotenv()
import requests
import json
import logging
from typing import List
from azure.search.documents import SearchClient
from azure.search.documents.models import RawVectorQuery
from azure.identity import DefaultAzureCredential, AzureCliCredential, InteractiveBrowserCredential
from promptflow.core import tool
from promptflow.connections import CognitiveSearchConnection

# Configure logging
logging.basicConfig(level=logging.INFO)



@tool
def get_search_results(index_name: str, embedding: List[float], maxResults: int = 5) -> str:


    search_client = SearchClient(endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
                                index_name=index_name,
                                credential=DefaultAzureCredential())
    

    vector_query = RawVectorQuery(vector=embedding, k=maxResults, fields="text_vector")
    results = search_client.search(search_text="",
            vector_queries=[vector_query],
            select=["title", "chunk", "metadata_storage_path"])

    docs = [{"title": doc["title"],  "chunk": doc["chunk"], "metadata_storage_path": doc["metadata_storage_path"]}
          for doc in results]

    return docs