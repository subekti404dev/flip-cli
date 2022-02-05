#!/usr/bin/env node
const { mainMenu } = require('./menu/main.menu');
const clear = require("clear");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { login, refreshToken } = require("./services/auth.service");
const { printTitle } = require("./helpers/title.helper");

const run = async () => {
   clear();
   printTitle();
   const configPath = path.join(os.homedir(), ".flip.json");
   if (!fs.existsSync(configPath)) {
      // do login
      try {
         await login();
      } catch (error) {
         process.exit(1);
      }
   } else {
      // do refresh token
      try {
         await refreshToken();
      } catch (error) {
         process.exit(1);
      }
   }
   mainMenu();
}

run();