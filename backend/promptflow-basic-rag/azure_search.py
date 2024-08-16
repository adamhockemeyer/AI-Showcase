import requests
import json
import logging
from promptflow.core import tool
from promptflow.connections import CognitiveSearchConnection

# Configure logging
logging.basicConfig(level=logging.INFO)

@tool
def get_search_results(connection: CognitiveSearchConnection,index_name: str, vectorQuery: list, maxResults: int = 5) -> dict:
    # Perform search request
    headers = {
        "Content-Type": "application/json",
        "api-key": connection.api_key
    }



    # Search index and query
    query = {
        "count": True,
        "select": "title, chunk, metadata_storage_path",
        "vectorQueries": [
            {
                "kind": "vector",
                "vector": vectorQuery,
                "exhaustive": True,
                "fields": "text_vector",
                "k": maxResults
            }
        ]
    }


    url = f"{connection.api_base}/indexes/{index_name}/docs/search?api-version={connection.api_version}"
    response = requests.post(url, headers=headers, json=query)
    results = response.json()

    # Log the count of results
    logging.info(f"Number of results: {results.get('count', 0)}")

    return results

