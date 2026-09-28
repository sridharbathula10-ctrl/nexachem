# Deploy the NexaChem mail API on Netlify

The Netlify Free plan permits commercial projects, subject to its monthly usage limits. This folder contains a Netlify Function for the mail API. The separate `server.mjs` is for a regular Node.js host and is not the Netlify entry point.

## Deploy from GitHub

1. Push this repository to GitHub, including the `mail-service` folder.
2. In Netlify, choose **Add new project → Import an existing project** and select the repository.
3. Set the **Base directory** to `mail-service`. Leave the build command empty. The included `netlify.toml` configures the `public` publish directory and `netlify/functions` function directory.
4. Deploy. Netlify installs Nodemailer from `package.json` and publishes the function at `/.netlify/functions/contact`, with `/api/contact` configured as an alias.
5. In the Netlify project settings, add these environment variables, then redeploy:

   - `SMTP_HOST` = `smtp.hostinger.com`
   - `SMTP_PORT` = `465`
   - `SMTP_USER` = `info@nexachemco.com`
   - `SMTP_PASSWORD` = your rotated mailbox password
   - `MAIL_TO` = `info@nexachemco.com`
   - `ALLOWED_ORIGINS` = `https://nexachemco.com,https://www.nexachemco.com`

6. In Netlify **Domain management**, connect `api.nexachemco.com` to this project. Apply the DNS records Netlify displays. The existing Hostinger folder mapping for that subdomain does not deploy this function.
7. Keep the main static website on Hostinger. Its form is configured to post to `https://api.nexachemco.com/api/contact`.

If you use the temporary `*.netlify.app` URL instead of the custom subdomain, set `NEXT_PUBLIC_CONTACT_API_URL` to `https://YOUR-SITE.netlify.app/api/contact` when building the frontend, and rebuild/reupload the frontend `out` folder. Also add the frontend's actual origin to `ALLOWED_ORIGINS`.

Netlify documents Git-connected builds and deployment settings in its [project deployment guide](https://docs.netlify.com/manage/projects/add-new-project/) and [functions setup](https://docs.netlify.com/build/functions/get-started/).
