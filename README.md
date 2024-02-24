This is the bloglist app with CI/CD pipeline.

graph TD;
A[GitHub Repo] -->|Build triggered by pull request/push event, pull requests must be reviewed| B[GitHub Actions];
B -->|Build and Deploy after approved pull request| C[Fly.io];
