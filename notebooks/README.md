
# Sample Jupyter Notebooks


## `openapi-function-calling-apim.ipynb`

This notebook demonstrates how to parse OpenAPI specifications and generate dynamic API function calls. It includes key functionalities for interacting with APIs based on their OpenAPI definitions without hardcoding URLs or parameters.

_| Example calls Azure Maps Weather Service, Logic Apps Exposing CosmosDB data, and Logic App to Send Emails._

![Example process flow: API's --> OpenAPI Spec --> Convert to Function Call](/notebooks/files/openapi-function-calling-apim-5.png)

![OpenAPI Spec Function Calling](/notebooks/files/openapi-function-calling-apim-1.png)

### Key Features

- **Parsing OpenAPI Specifications**: Reads OpenAPI YAML or JSON files to extract API endpoint information, including paths, methods, parameters, and server URLs.

- **Function Mapping**: Creates mappings between function names and their corresponding API details, such as HTTP methods, request paths, parameters, and request bodies.

- **Dynamic API Requests**: Implements `execute_function_call` to construct and execute HTTP requests using the server URL from the OpenAPI spec, ensuring that hardcoded URLs are not used.

- **Handling Request Bodies**: Processes parameters defined in the `requestBody` section of the OpenAPI spec, allowing for proper inclusion of body parameters in API requests.

- **Dependency Management**: Updates the logic to handle multiple function calls with potential dependencies, ensuring that if one function call depends on the output of another, the dependencies are resolved in order.

- **Azure OpenAI Integration**: Integrates with Azure OpenAI services to generate responses based on user queries, utilizing function calling capabilities to interact with APIs.

### How to Use

1. **Setup Azure Credentials**:
   - Review the `.env.sample`, and create your own `.env.local` file with the appropriate values.


2. **Provide OpenAPI Specifications**:
   - Place your OpenAPI YAML or JSON files in the appropriate directory or provide URLs to access them.
   - The notebook uses these specifications to understand the available API endpoints and parameters.

3. **Run the Notebook**:
   - Execute the cells in order to parse the OpenAPI specifications and set up the function mappings.
   - Use the provided functions to make API calls based on user queries.

4. **Execute Function Calls**:
   - The `execute_function_call` function uses the base URL from the OpenAPI spec along with the path and parameters to make API requests.
   - It handles both query parameters and request body parameters as defined in the OpenAPI spec.

5. **Handle Multiple Function Calls with Dependencies**:
   - The logic in `call_azure_openai` has been updated to allow for multiple function calls.
   - If a function call depends on the output of a previous call, the notebook ensures that dependencies are handled correctly.

### Important Functions

- **`parse_openapi_spec(openapi_spec)`**: Parses the OpenAPI specification and extracts API details, including server URLs, paths, methods, parameters, and request bodies.

- **`execute_function_call(function_name, arguments, function_api_map)`**: Constructs and executes API requests dynamically using the extracted API details.

- **`call_azure_openai(query, tool_calls, function_api_map)`**: Communicates with Azure OpenAI to process user queries, handle function calls, and manage dependencies between multiple function calls.

### Notes

- **This is Sample Code**: Use at your own risk. This was created to validate a theory, but will not be the proper approach for every use case. Proceed with caution.

- **Error Handling**: Ensures proper error handling is in place for API requests and function executions.


### Getting Started


1. **Configure Azure Services**:
   - Set up Azure OpenAI and obtain the necessary API keys and endpoints.
     - I used gpt-4o
   - Setup Azure API Management
     - Create a 'product' (_i.e. AI-agent-1_) to group the API's you want to be able to call
     - Import or add API's to APIM (ensure the API's/operations/properties etc. have a description, the properties and descriptions are critical for the OpenAI model to know what they do, and try to understand when to call them.)
     - Add the API's to your product

3. **Run the Notebook**:
   - Open the notebook in Jupyter or any compatible environment.
   - Follow the instructions and execute the cells to perform API interactions.
   - Update the `prompt` and `query` as appropriate for the API's you are enabling and want to be able to call. Utilize the prompt to help guide the model based on the API's/function calls available to it.

4. **Example screenhots**

   - _Full notebook example, APIM is called to fetcg OpenAPI specs, these are mapped to OpenAI tool calls, and called dynamically if needed to answer a users question._
   - ![OpenAPI Spec Function Calling](/notebooks/files/openapi-function-calling-apim-1.png)
   - _APIM Products are used to group a set of API's that we want to make available to our agent._
   - ![APIM Product APIS to enable as tool calls](/notebooks/files/openapi-function-calling-apim-2.png)
   - _Example of data in CosmosDB, which we are exposing through a Logic App into APIM_
   - ![Cosmos DB Data](/notebooks/files/openapi-function-calling-apim-3.png)
   - _As instructed, OpenAI made 3 tool calls, the first two were to gather the weather information and products availabile, and finally it sent an email as instructed._
   - ![Email sent as tool call, summarizing information](/notebooks/files/openapi-function-calling-apim-4.png)


---

For detailed code and explanations, please refer to the `openapi-function-calling-apim.ipynb` notebook.



## Disclaimer

This code is provided for **sample purposes only** and is intended to illustrate a concept. Users are responsible for reviewing and testing the code thoroughly before using it in any environment. The author and contributors accept no responsibility or liability for any errors or issues that may arise from using this code.
