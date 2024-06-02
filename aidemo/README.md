# Generative AI Demo

Getting a solid and robust API Contract opens a multitude of opportunities with GenAI.
Let's explore a few...

Note: the demo below was assembled using OpenAPI's ChatGPT and the YAML file defined in step 1.


## Prompts to generate an HMTL client

Open your favorite LLM chating interface.

```You
You are a coding assistant.
Provided an OpenAPI document for an API, you can answer questions and generate code.
```

```GPT
Great! Please provide the OpenAPI document for the API, and let me know what specific questions or tasks you have in mind. If you need help with generating code, specifying the programming language and the kind of operations you want to perform (e.g., sending requests, handling responses, etc.) would be helpful.
```

then drop the OpenAPI document of step7 for a complete demo.

```GPT
Great, you provided the OpenAPI document for the MiniDashboard API. Here are some questions and tasks I can assist with:

Questions:

What are the available endpoints?
What is the structure of the response for a specific endpoint?
What security scheme does the API use?
Tasks:

Generate code to make a GET request to list organizations.
Generate code to create a new organization using a POST request.
Generate code to retrieve details of a specific organization by its ID.
Generate code to delete an organization by its ID.
Please let me know which specific question or task you need help with, and if you have a preferred programming language (e.g., Python, JavaScript, etc.)
```

Let's now request the creation of an HTML client

```
given that API, could you create a Web page that lets me select an organization among a picklist and when selected show me the details for that organization.
```

```GPT
Sure, I'll provide you with an example using HTML, JavaScript (with Fetch API), and a bit of CSS for styling. This web page will allow you to select an organization from a dropdown list, and upon selection, it will fetch and display the details of the selected organization.

Here's the code for the web page:

## Prompts to generate an HMTL client
...
```

### Prompts to create a server API

```You
perfect, could you create for that same api the server implementation in node.js
```

When running the code, with the HMTL page, I encountered a CORS issue, 
let's fix this.

```You
when running the code I am encountering an issue with CORS, could you add code to the API server so that it returns the HTML page, I guess this will solve my issue.
```




