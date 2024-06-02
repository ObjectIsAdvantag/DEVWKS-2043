# Building a basic HMTL client and API server implementation using GenAI

Note: this demo was created using OpenAPI 's GPT-4o on June 2nd 2024
## Prompts to generate an HMTL client

Open your favorite LLM chating interface.

**HUMAN**
You are a coding assistant.
Provided an OpenAPI document for an API, you can answer questions and generate code.

**GPT**
Great! Please provide the OpenAPI document for the API, and let me know what specific questions or tasks you have in mind. If you need help with generating code, specifying the programming language and the kind of operations you want to perform (e.g., sending requests, handling responses, etc.) would be helpful.

**HUMAN**

> Now drop the OpenAPI document of step7 for a complete demo.
> Note that this demo was created using the YAML file defined in step 1: step1.yaml.

**GPT**
Great, you provided the OpenAPI document for the MiniDashboard API. Here are some questions and tasks I can assist with:

Questions:
- What are the available endpoints?
- What is the structure of the response for a specific endpoint?
- What security scheme does the API use?

Tasks:
- Generate code to make a GET request to list organizations.
- Generate code to create a new organization using a POST request.
- Generate code to retrieve details of a specific organization by its ID.
- Generate code to delete an organization by its ID.

Please let me know which specific question or task you need help with, and if you have a preferred programming language (e.g., Python, JavaScript, etc.)

**HUMAN**

> Let's now request the creation of an HTML client

Given that API, could you create a Web page that lets me select an organization among a picklist and when selected show me the details for that organization.

**GPT**
Sure, I'll provide you with an example using HTML, JavaScript (with Fetch API), and a bit of CSS for styling. This web page will allow you to select an organization from a dropdown list, and upon selection, it will fetch and display the details of the selected organization.

Here's the code for the web page:
...


## Prompts to create a server API

**HUMAN**
perfect, could you create for that same api the server implementation in node.js

**GPT**
...

> When running the code, with the HMTL page, I encountered a CORS issue, 
let's fix this.

**HUMAN**
when running the code I am encountering an issue with CORS, could you add code to the API server so that it returns the HTML page, I guess this will solve my issue.

**GPT**
...

> I am still encountering an issue with implementation 2, asking for a fix

**HUMAN**
I am still getting a CORS error. Here is the exact error: "403 Forbidden', strict-origin-when-cross-origin
Could you troubleshoot why given that I followed the instructions you proposed.

**GPT**
...

> Still encountering a CORS issue :-(
> Asking for yet another fix.

**GPT**
...

**HUMAN**
The CORS error is still present. I believe it's because access to the root path '/' is protected. The middleware that sets the API key should instead be protecting access to '/api' and below. Could you confirm and provide an update for the server code.

**GPT**
...

> Made it ;-)