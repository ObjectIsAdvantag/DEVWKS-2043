# Linting OpenAPI documents 

## Before we start

You have cloned this repo and checked the spectral and oasdiff binaries are installed on your laptop.

1. `git clone https://github.com/ObjectIsAdvantag/DEVWKS-2525`
1. `spectral --version` should return 6.11.0 or beyond.
1. `oasdiff --version` should return 1.10.5 or later.


### Installing the CLIs

The following tools are installed on your local machine

- [Spectral CLI](https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation): `npm install -g @stoplight/spectral-cli`
- [oasdiff CLI](https://github.com/Tufin/oasdiff?tab=readme-ov-file#install-on-macos-windows-and-linux): select the binary for your laptop and drop it on your path


## Step 1

Please open Visual Studio Code 

1. `cd DEVWKS-2525`
1. `code .`


Open https://editor.swagger.io/ in a Web browser

Paste the `step1.yaml` contents into the editor

Note that there are many OpenAPI renderer vendors available to you when ready to go, such as [StopLight Elements](https://elements-demo.stoplight.io/?spec=https://raw.githubusercontent.com/ObjectIsAdvantag/DEVWKS-2525/main/step1.yaml#/operations/getOrganization)

Looks great... but this is manual eye screening for now whether the OpebAPI document is correct or not. 

Let's now look into some automation opportunities...


## Step 2

**Run the command**

```shell
spectral lint step2.yaml --verbose --ruleset rulesets/spectral.yaml 
```

Spectral lints the OpenAPI document using its default ruleset consists which 52 rules documented at 
https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules

Let's look for the rule that is failing: `operation-tag-defined`
https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules#operation-tag-defined


## Step 3

Let's fix the warning that tags are not declared

**Remove the comments at the bottom of the openapi.yaml and save the file**

**And run the command again:**

```shell
spectral lint step3.yaml --verbose --ruleset rulesets/spectral.yaml 
```

There are no more errors found by spectral.


## Step 4

Let's now add a rule to check that the OpenAPI document does apply semantic versioning.

**Run the command:**

```shell
spectral lint step4.yaml --verbose --ruleset rulesets/semver.yaml 
```

Let's check what the rule consists.

**Open the file `rulesets/semver.yaml`**

Note that the rule has a severity of `warn`

Let's check if the command get an exit status of error.

```shell
echo $? 
```

The command did not fail because no issue with severity level of error was found.

**Change the rule severity to `error`**

**Run the commands**

```shell
spectral lint step4.yaml --verbose --ruleset rulesets/semver-error.yaml; echo "exit status:" $?
```

Now we are getting an exit status of 1


## Step 5

Let's fix the semantic version

**Go to line 3 of the OpenAPI document and change the version number to `1.22.0-4521`**

**And run the command again:**

```shell
spectral lint step5.yaml --verbose --ruleset rulesets/semver-error.yaml; echo "exit status:" $? 
```

The issue is now fixed!

Note that there are now 53 rules being considered and 42 were applicable.


## Step 6

Let's now evaluate the quality of the API contract: incomplete definitions of responses contents, absence of error codes...

**Type the commande below:**

```shell
spectral lint step6.yaml --verbose --ruleset rulesets/contract.yaml --format pretty
```

There is 1 error identified and a warning showing 4 times.
Let's look at these findings in details...


## Step 7

Let's now evaluate the contract once we have made the fixes.

```shell
spectral lint step7.yaml --verbose --ruleset rulesets/contract.yaml --format pretty
```

The document is more verbose.


## Step 8

Let's now look into the API lifecycle.

A few weeks have passed and your own internal engineering or a vendor has delivered a new version of an API

A new OpenAPI document is passed your way.

First thing you want to do is to verify the quality of the document using your own toolchain

**Run the following command:**

```shell
spectral lint step8.yaml --verbose --ruleset rulesets/contract.yaml --format pretty
```

Now you're asking yourself what has changed.
You can either open the file and compare, use a diff tool and compare OR use an OpenAPI diff tool which will offer other benefits.

**Run the following command:**

```shell
oasdiff changelog step7.yaml step8.yaml --format html > changelog.html
```
 
The output shows you the updates and spots a breaking change.

In total it's more than 250 checks that are executed: `oasdiff checks | wc -l`
as documented here: https://github.com/Tufin/oasdiff/blob/main/BREAKING-CHANGES-EXAMPLES.md

Now what if you want to interrupt my CI/CD pipeline as soon as I detect a breaking change

```shell
oasdiff breaking step7.yaml step8.yaml --fail-on ERR; echo "exit status:" $?
```

Congrats, you've successfully learnt to lint an OpenAPI document, customize an existing ruleset, create your own rule.
You also learnt to generate changelogs and detect


## Next Steps

Setting up Spectral in your CI pipeline: https://blog.stoplight.io/style-guides-rulebook-series-automated-api-design-checks-in-ci

oasdiff: use a GitHub action to check for breaking changes in the CI pipeline: https://www.oasdiff.com/github-action


## Other Resources

- OpenAPI utilities and demos: https://github.com/CiscoDevNet/OpenAPI_Demo