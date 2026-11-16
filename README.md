# resume-frontend

Static resume website for Jason Rieza, built for the Cloud Resume Challenge on AWS. It is plain HTML, CSS and vanilla JavaScript (no frameworks, no build step, no third-party code), intended to be hosted on S3 behind CloudFront.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content: header/nav, hero, about, skills, projects, certifications, education, contact, footer. |
| `style.css` | Mobile-first styles, light/dark themes, print stylesheet for a 1-2 page resume. |
| `script.js` | Theme toggle (saved in `localStorage`) and the visitor counter. Set `API_URL` at the top once the API exists (Week 3). |
| `favicon.svg` | "JR" monogram icon. |
| `deploy.ps1` | Syncs the site to S3 and optionally invalidates CloudFront. |
| `.gitignore` | Keeps `.aws`, `.env`, `*.zip`, `node_modules`, `.DS_Store` out of git. |

## Preview locally

Open `index.html` in a browser. No server needed. To check the print layout, use Print / Save as PDF.

## Deploy

Requires the AWS CLI and a configured profile named `dev`. Credentials are never stored in this repo.

```powershell
.\deploy.ps1 -Bucket <your-bucket-name>
.\deploy.ps1 -Bucket <your-bucket-name> -DistributionId <your-distribution-id>
```

The script excludes `.git`, `*.ps1`, `.gitignore` and `README.md` from the upload, and uses `--delete`, so files removed locally are removed from the bucket.

## TODO: placeholders to replace

- [ ] `index.html`: `og:url` meta tag (final site URL)
- [ ] `index.html`: Download PDF link (`resume.pdf`) and add the actual PDF file
- [ ] `index.html`: project repo URLs (2 of 3 are guessed names)
- [ ] `index.html`: Education: `[University name]` and `[expected graduation year]`
- [ ] `index.html`: Contact: email and LinkedIn URL (GitHub URL: confirm)
- [ ] `script.js`: `API_URL` once the Lambda / API Gateway endpoint exists
- [ ] Update project status badges and certifications as they change (do not mark anything earned until it is)

Search for `TODO` in `index.html` to find them all.
