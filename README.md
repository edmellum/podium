# Podium

A simple, contained PaaS solution for Node.js applications.

## Installing
Clone repo or download files.

```bash
$ npm install
$ node index.js
```

## Deploying an app

The deploy process isn't streamlined at the moment. Later it should
have a CLI and/or git hook support.

```bash
$ tar -cz . | curl -XPOST -sSNT- localhost:9000/deploy/edmellum/myapp
```

## Todo
* Tests
* CLI module
* Git hook support
* Clustering
* Cluster load balancing
