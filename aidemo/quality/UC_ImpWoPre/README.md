# UC_ImpWoPre: Improving the quality of an OpenAPI document without preliminary instructions

Note: this demo was using OpenAPI 's GPT-4o on June 2nd 2024

```YOU
You are an assistant tasked to improve the quality of OpenAPI documents. You will be provided YAML or JSON file contents that adhere to the OpenAPI specifications.
```

```GPT
Great! Please provide the OpenAPI YAML or JSON file contents you'd like me to review and improve. I'll analyze it for compliance with OpenAPI specifications, readability, and clarity, and suggest improvements accordingly.
```

## Identifying and Improving OpenAPI documents

Copy pasting the contents of step1.yaml

Here is the response of the assistant:

```GPT
Your OpenAPI document looks well-structured and adheres to the OpenAPI specifications. However, there are a few improvements that can be made to enhance readability, consistency, and clarity. Here's a revised version with suggestions incorporated:

...
see genai_openapi_A.yaml
...

Changes and Improvements:
- Reordered elements: Consistently placed summary before description.
- Clarified descriptions: Made descriptions more precise and concise.
- Consistent indentation: Ensured consistent indentation for better readability.
- Enhanced response schemas: Provided a more consistent structure for response examples.
- Added properties: Added missing properties in the 201 response schema for the POST /organizations operation.
- Tags: Ensured each operation has tags for better organization and filtering.

Feel free to ask if you need further customization or additional sections reviewed!
```

Let's run our spectral rulesets to see how the generated document performs.

`spectral lint genai_openapi_A.yaml --verbose --ruleset ../../rulesets/spectral.yaml`

```text
Found 52 rules (41 enabled)
Linting /home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_A.yaml

/home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_A.yaml
  36:11  warning  operation-tag-defined  Operation tags must be defined in global tags.  paths./organizations.get.tags[0]
 107:11  warning  operation-tag-defined  Operation tags must be defined in global tags.  paths./organizations.post.tags[0]
 182:11  warning  operation-tag-defined  Operation tags must be defined in global tags.  paths./organizations/{organizationId}.get.tags[0]
 253:11  warning  operation-tag-defined  Operation tags must be defined in global tags.  paths./organizations/{organizationId}.delete.tags[0]

✖ 4 problems (0 errors, 4 warnings, 0 infos, 0 hints)
```

Unfortunately, the global tags are still not defined.

Let's see if the LLM could fix this.

```YOU
I noticed the operation tags are not defined in global tags, which is required by the OpenAPI specifications version 3.0.0 if I am correct. Can you confirm and if so, provide a new yaml that fully conforms to the OpenAPI specifications version 3.0.0
```

```GPT
You're correct that in OpenAPI 3.0.0, while it's not strictly required to define global tags, it's considered good practice to define them in the tags section to provide additional metadata about the tags used in the API. This helps in organizing and documenting the API better. Let's add the global tags section and ensure full conformance with the OpenAPI specifications.

Here's the revised OpenAPI YAML with global tags defined:
...
see genai_openapi_B.yaml
...

Changes:
1. Added global tags: Defined the read and configure tags with descriptions.
2. Consistent formatting: Ensured all elements are consistently formatted.

This YAML now fully conforms to the OpenAPI specifications and includes the recommended global tags section.
```

Let's run our spectral rulesets to see how the generated document performs.

`spectral lint genai_openapi_B.yaml --verbose --ruleset ../../rulesets/spectral.yaml`

```text
Found 52 rules (41 enabled)
Linting /home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_B.yaml
No results with a severity of 'error' found!
```

Let's now run the other ruleset we have defined along the workshop

`spectral lint genai_openapi_B.yaml --verbose --ruleset ../../rulesets/semver-error.yaml`

```text
Found 53 rules (42 enabled)
Linting /home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_B.yaml

/home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_B.yaml
 3:12  error  semver  OpenAPI document does not follow semantic versioning: v1.22 is not a valid version.  info.version

✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

`spectral lint genai_openapi_B.yaml --verbose --ruleset ../../rulesets/contract.yaml`

```text
Found 57 rules (8 enabled)
Linting /home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_B.yaml

/home/devnet/DEVWKS-2043/aidemo/quality/genai_openapi_B.yaml
  43:17  warning  error-status-code  There should be at least one error status code either 4xx or 5xx.; none of /^4\d{2}$/,/^5\d{2}$/,/^default$/ are matched  paths./organizations.get.responses
 126:17  warning  error-status-code  There should be at least one error status code either 4xx or 5xx.; none of /^4\d{2}$/,/^5\d{2}$/,/^default$/ are matched  paths./organizations.post.responses
 195:17  warning  error-status-code  There should be at least one error status code either 4xx or 5xx.; none of /^4\d{2}$/,/^5\d{2}$/,/^default$/ are matched  paths./organizations/{organizationId}.get.responses
 266:17  warning  error-status-code  There should be at least one error status code either 4xx or 5xx.; none of /^4\d{2}$/,/^5\d{2}$/,/^default$/ are matched  paths./organizations/{organizationId}.delete.responses

✖ 4 problems (0 errors, 4 warnings, 0 infos, 0 hints)
```

No surprise, these rules are corporate rules and have not been specified on the prompt.

Let's extend the prompt later.

## Generating Overlays

We'll now look into overlays.

```YOU
Are you familiar with overlays?
```

```GPT
Yes, I'm familiar with overlays in the context of OpenAPI. Overlays are used to extend, modify, or override parts of an existing OpenAPI document without altering the original file. This allows for a modular approach to API documentation, making it easier to maintain and update.

Overlays are typically defined in a separate file and can include additions, deletions, or modifications to paths, parameters, responses, and other elements of the OpenAPI document. They are especially useful in scenarios where you need to customize the API specification for different environments, versions, or clients.

Here is an example of how an overlay might look:

Original OpenAPI Document (openapi.yaml)

openapi: 3.0.0
info:
  version: v1.0
  title: Sample API
paths:
  /example:
    get:
      summary: Example endpoint
      responses:
        '200':
          description: Successful response

Overlay Document (overlay.yaml)

overlay:
  info:
    version: v1.1
  paths:
    /example:
      get:
        summary: Updated example endpoint
        responses:
          '200':
            description: Updated successful response

Merged Result

When you apply the overlay, the resulting OpenAPI document will be:

openapi: 3.0.0
info:
  version: v1.1
  title: Sample API
paths:
  /example:
    get:
      summary: Updated example endpoint
      responses:
        '200':
          description: Updated successful response

If you have a specific use case or need help creating an overlay, feel free to provide more details, and I can assist you further.
```

Let's now have GenAI generate an overlay

```YOU
Could you generate an overlay that would take the original yaml I provided when we started this chat session, and that would generate when applied the fully consistent yaml you have provided and that I scored as perfect.
```


```GPT
Sure! Let's create an overlay that modifies the original OpenAPI YAML document you provided to produce the final, fully consistent YAML document.

...
see genai_overlay_AtoB.yaml
...

This overlay document defines the changes needed to transform the original OpenAPI YAML to the final, consistent version. The overlay includes updates to descriptions, summaries, and other details to ensure the final output matches the specifications.
```

Now let's look at how to apply the overlay

```YOU
do you know of any command line utility that could apply this overlay to generate the final document
```

```GPT
Yes, there is a command line utility called oas-kit that can apply overlays to OpenAPI documents. Specifically, oas-tools provides the functionality needed to merge overlays.

First, you need to install oas-kit which includes oas-tools:

npm install -g oas-kit

Once installed, you can use the oas-resolve command to apply the overlay to your OpenAPI document. Here is an example command to merge your base OpenAPI document with the overlay:

oas-resolve --overlay overlay.yaml openapi.yaml > final-openapi.yaml

In this command:

overlay.yaml is your overlay file.
openapi.yaml is your base OpenAPI document.
final-openapi.yaml is the output file that will contain the merged result.
This will apply the overlay and generate the final OpenAPI document as per the changes defined in the overlay.

Example Files:
openapi.yaml

In this command:

overlay.yaml is your overlay file.
openapi.yaml is your base OpenAPI document.
final-openapi.yaml is the output file that will contain the merged result.
This will apply the overlay and generate the final OpenAPI document as per the changes defined in the overlay.

NOTE: You’ve reached your GPT-4o limit.
Responses will use GPT-3.5 until your limit resets after 5:19 PM
```


## Enriched prompt with corporate rules

IN PROGRESS (hit free quota limit)

Let's now come back to compliance.
In a new chat session...

TODO: provide a few rules for:
- consistency in descriptions
- proposing summaries
...

```YOU
You are an assistant tasked to improve the quality of OpenAPI documents. You will be provided YAML or JSON file contents that adhere to the OpenAPI specifications.
```






