# Pipeline tarvitsee API-avaimen deployta varten. Missä avain säilytetään turvallisesti?

## Tilanne

Jenkinsfile:

```groovy
environment {
    API_KEY = 'sk-live-xxxxx'  // VÄÄRIN — repo historiassa ikuisesti
}
```

Secret repossa → GitHub leak, fork näkee, historia säilyttää vaikka poistaisit. Compliance rikkoo.

## Ratkaisu

**CI secrets / credentials store**:

```yaml
# GitHub Actions
env:
  API_KEY: ${{ secrets.DEPLOY_API_KEY }}
```

Jenkins: Credentials Binding Plugin → `withCredentials`. Secret **ei** logeissa — maskattu. Rotaatio: uusi secret, vanha revoke, päivitä CI.

## Käytännössä

Least privilege — deploy-key vain tarvittavaan. Älä print `$API_KEY`. OIDC cloud-deploy (AWS/GCP) vähentää long-lived keytä. Audit: kuka pääsi secretiin.

[Lue lisää](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
