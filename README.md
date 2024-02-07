# Linting OpenAPI documents

This instructor-led lab will take you from zero to automatically analyzing OpenAPI documents and integrating into your CI/CD pipelines. You can read more about the latest OpenAPI specification at https://swagger.io/specification/. 


## Before we start

You have cloned this repo and have checked that the `spectral` and `oasdiff` binaries are available on your laptop:

1. `git clone https://github.com/ObjectIsAdvantag/DEVWKS-2525`
1. `spectral --version` should return 6.11.0 or beyond. 
1. `oasdiff --version` should return 1.10.5 or later. 

### Installing the CLIs

If some of the binaries are not yet installed, please proceed as describe below:

- [Spectral CLI](https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation): `sudo npm install -g @stoplight/spectral-cli` [Install instructions are also in their documentation](https://docs.spectralops.io/).
 - [oasdiff CLI](https://github.com/Tufin/oasdiff/releases/): select the binary for your laptop and drop the binary on your path, such as: [oasdiff_1.10.6_linux_amd64.tar.gz](https://github.com/Tufin/oasdiff/releases/download/v1.10.6/oasdiff_1.10.6_linux_amd64.tar.gz) getting copied to `~/.local/bin`. [Install instructions are also in their documentation](https://tufin.github.io/oasdiff/#install-on-macos-windows-and-linux).

## Step 1

Let's discover the OpenAPI document that we will use for automated checks along this lab.

Please open Visual Studio Code. 

1. Change directory to the newly-cloned repository directory: `cd DEVWKS-2525`
1. Open the directory in Visual Studio Code with: `code .`
1. Open the file named `step1.yaml` from the repository and copy the entire contents. 
1. Now, open https://editor.swagger.io/ in a Web browser and paste the `step1.yaml` contents into the online editor.

> Note that there are many other OpenAPI renderer options available to you when ready to go, such as this vendor: [StopLight Elements](https://elements-demo.stoplight.io/?spec=https://raw.githubusercontent.com/ObjectIsAdvantag/DEVWKS-2525/main/step1.yaml#/operations/getOrganization)

Looks great... but this requires manual scanning and comparing of the `yaml` _and_ rendered documentation to identify if the OpenAPI document is complete and accurate.

In the rest of this lab, we will look into automation opportunities...


## Step 2

We first want to check the syntax of the document is valid. You can use either a separate terminal window or the Terminal in Visual Studio Code for this step.
Please run the command below so that you can lint the file, `step2.yaml`:

```shell
spectral lint step2.yaml --verbose --ruleset rulesets/spectral.yaml 
```

![spectral command output](/img/step2_command.png)

You see 4 warnings with the corresponding lines in the document.

> Note that Spectral lints the OpenAPI document using a default 'oas' ruleset that includes 52 checks.

Let's look at the rule that is failing: ['operation-tag-defined'](
https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules#operation-tag-defined)

Scroll down at the bottom of the `step2.yaml` file and note that the declaration of the tags have been commented starting with line 228. 

![OpenAPI document commented](/img/step2_openapi.png)


## Step 3

Next, let's run the command again against the `step3.yaml` file where the tags have been globally declared. You can search for `tags` in the Visual Studio Code editor to see where these tags are placed and defined.

Please run the command:

```shell
spectral lint step3.yaml --verbose --ruleset rulesets/spectral.yaml 
```

![spectral command output](/img/step3_command.png)

There are no more errors found by `spectral`.

Cool! The OpenAPI document is valid against the [OpenAPI specification](https://swagger.io/specification/).

We will now add custom rules to automatically check that the OpenAPI document meets our own internal standards.


## Step 4

As an example, at Cisco we are using [semantic versioning](https://semver.org/) to track the lifecycle of OpenAPI documents.

Let's now add a rule to check that the OpenAPI document does apply [semantic versioning](https://semver.org/).

Please run the command:

```shell
spectral lint step4.yaml --verbose --ruleset rulesets/semver.yaml 
```

![spectral command output](/img/step4_command.png)

A warning informs us that the version does not adhere to semver, which is short for semantic version.
<!--I think there should be a new Step heading here, but only if it matches the deck.-->
Let's check how we can create custom rules.

Please open the file `rulesets/semver.yaml`.

Note that the rule has a severity of `warning` in line 7.

![semver rule](/img/step4_semver_rule.png)

Let's check if the command execution got an exit status of 'error' so that we could automatically detect this with our CI/CD pipeline?

Run this command in the Visual Studio Code Terminal: 
```shell
echo "exit status:" $?
```

We are getting an exit status of '0', so success.

The command did NOT fail because the 'semver' rule has a severity of 'warning' and not 'error'.

We have 2 options at this stage:

### Fail on warnings

```shell
spectral lint step4.yaml --verbose --ruleset rulesets/semver.yaml --fail-severity warn; echo "exit status:" $?
```

### Change the rule severity to 'error'

```shell
spectral lint step4.yaml --verbose --ruleset rulesets/semver-error.yaml; echo "exit status: "$?
```

Congrats, we are now getting an exit status of '1' so that we can automatically reject non-compliant OpenAPI documents with our CI/CD pipelines.


## Step 5

Let's now fix the semantic version and see that a valid document would not be rejected.

We have updated the version number to '1.22.0-4521' as shown with `diff step4.yaml step5.yaml`.

Please run the command:

```shell
spectral lint step5.yaml --verbose --ruleset rulesets/semver-error.yaml; echo "exit status:" $? 
```
In return:
```shell
Found 53 rules (42 enabled)
Linting /Users/agentle/src/DEVWKS-2525/step5.yaml
No results with a severity of 'error' found!
exit status: 0
```

Perfect, the issue is now fixed!

> Note that there are now 53 rules being considered and 42 are applicable for our OpenAPI document in version 3.0 of the OpenAPI specification.


## Step 6

Let's now evaluate the quality of the API contract: 
- incomplete definitions for request or responses payloads
- errors not documented
- missing identifier for some operations

Please type the command:

```shell
spectral lint step6.yaml --verbose --ruleset rulesets/contract.yaml --format pretty
```

![spectral command output](/img/step6_command.png)

There is 1 error identified and a warning with 4 occurences.

Let's look at these findings in details:
- [line 119](step6.yaml#L119): the response is not described
- [line 114](step6.yaml#L114) and 3 others: there is no error defined


## Step 7

We ask the team to make the necessary changes by properly defining the response schema and by adding error status code information. See the differences with this command: `diff step6.yaml step7.yaml`

Let's now evaluate the contract after these changes have been reflected:

```shell
spectral lint step7.yaml --verbose --ruleset rulesets/contract.yaml --format pretty
```

> Note that the contract ruleset needs to go beyond the provided spectral function. <!--Why-->

In Visual Studio Code, open the [contract.yaml](rulesets/contract.yaml) and observe the functions that have been declared at the top. The functions are defined in the `/functions` folder.

Let's now look into a real life example of an API lifecycle.


## Step 8

A few weeks have passed and your own internal engineering or a vendor has delivered a new version of an API. 

You receive a new OpenAPI document from them.

First thing you want to do is to verify the quality of the document using your own toolchain that you have packaged into the ruleset `cicd.yaml`; it includes semantic versioning and contract completeness.

Run the following command:

```shell
spectral lint step8.yaml --verbose --ruleset rulesets/cicd.yaml --format pretty
```

![spectral command output](/img/step8_command.png)

Spotted! 2 findings here:
1. They did not correcctly apply the semantic versioning in the `step8.yaml` file.
1. They made a new 'PUT' operation, but did not include the errors for the new operation.

Engineering is asked to provide a new OpenAPI document which will reflect the changes.


## Step 9

The file comes back.

Run the following command to check it meets internal standards:

```shell
spectral lint step9.yaml --verbose --ruleset rulesets/cicd.yaml --format pretty
```
In return:

```shell
Found 58 rules (9 enabled)
Linting /Users/agentle/src/DEVWKS-2525/step9.yaml

0 Unique Issue(s)
✖
No results with a severity of 'error' found!
```

Looks good!

Now you're asking yourself what has changed through all of these iterations of the spec file. Let's move beyond a simple text diff next.


## Step 10

To evaluate API changes, we can use an OpenAPI diff tool such as `oasdiff`.

Run the following command:

```shell
oasdiff changelog step7.yaml step10.yaml --format text
```

The output shows you the updates and spots a breaking change.

![oasdiff command output](/img/step10_command.png)

In total, `oasdiff` is executing more than 250 checks: `oasdiff checks | wc -l`,
as documented here: https://github.com/Tufin/oasdiff/blob/main/BREAKING-CHANGES-EXAMPLES.md

The exact breaking change is that a required property was added for the POST request: 
 [StopLight Elements](https://elements-demo.stoplight.io/?spec=https://raw.githubusercontent.com/ObjectIsAdvantag/DEVWKS-2525/main/step10.yaml#/operations/createOrganization)

Now what if you wanted to interrupt the CI/CD pipeline as soon as a breaking change is detected?

Please type the command below:

```shell
oasdiff breaking step7.yaml step10.yaml --fail-on ERR; echo "exit status:" $?
```

Congrats, you've successfully learned to
- lint an OpenAPI document, 
- customize an existing ruleset and create your own rules,
- generate API changelogs,
- and detect breaking changes.


## Next Steps

Setting up the tools in your CI/CD pipelines
- `spectral`: https://blog.stoplight.io/style-guides-rulebook-series-automated-api-design-checks-in-ci
- `oasdiff`: use a GitHub action to check for breaking changes in the CI pipeline: https://www.oasdiff.com/github-action


## Other Resources

- OpenAPI utilities and demos: https://github.com/CiscoDevNet/OpenAPI_Demo
