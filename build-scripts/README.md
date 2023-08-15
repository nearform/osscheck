# Build Scripts
This script fetches data related to public projects from GitHub and Scorecard API and dumps multiple JSON files into a designated folder.

# Usage

```
    $ npx build-scripts --path ./some/dir --org myGitHubOrgName
```

We need to ensure the following env vars are defined:

- GH_PRIV_KEY  
- GH_APP_ID 
- GH_APP_INSTALL_ID

These keys are all related to a GitHub app that must be created and installed in the GitHub organisation we want to scan. For more information read [this article](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)
