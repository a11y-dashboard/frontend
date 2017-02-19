# Accessibility Dashboard Frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/joscha/a11y-dashboard.svg)](https://greenkeeper.io/)

This project is the front end part of the Accessibility Dashboard. It allows a visitor to see an aggregated overview of accessibility issues and has features that allows to drill into this aggregated data and view issues per URL and filter them by standards.

Landing page:

![a11y-dashboard-landing.png](https://bitbucket.org/repo/74nR9n/images/274504664-a11y-dashboard-landing.png)

Detail view:

![a11y-dashboard-details.png](https://bitbucket.org/repo/74nR9n/images/654127562-a11y-dashboard-details.png)

It needs backing by the [Accessibility Dashboard Webservice](https://bitbucket.org/atlassian/a11y-dashboard-webservice/).

## Project Features
* Overview charts for data in an instance of the [Accessibility Dashboard Webservice](https://bitbucket.org/atlassian/a11y-dashboard-webservice/).
* Drilling down into a project and showing per-URL errors.
* Filtering by URL, error level and tag (standard)


***
## Getting started

You should download and spin up an instance of the [Accessibility Dashboard Webservice](https://bitbucket.org/atlassian/a11y-dashboard-webservice/) first and then use the `WEBSERVICE_URL` environment variable to point the Dashboard against it. For an example you can have a look at the dotfiles in `/test` and the according command in `package.json`.

***
## How to contribute
PRs are welcome!

You can spin up a dev instance via running `npm run dev:local:local` - it is also possible to point the dashboard frontend to an existing docker instance running the backend. Have a look at `package.json` for some examples.

Make sure your code lints (`npm run lint`) and the tests are green (`npm test`).

Please sign the according Atlassian CLA before making any contributions:

* [Corporate CLA](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=e1c17c66-ca4d-4aab-a953-2c231af4a20b)
* [Individual CLA](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=3f94fbdc-2fbe-46ac-b14c-5d152700ae5d)

***
## Get support
Please use our [issue tracker](https://bitbucket.org/atlassian/a11y-dashboard/issues?status=new&status=open).
