const { createHTTP } = require('../helpers/http.helper');
const chalk = require("chalk");
const os = require("os");
const path = require("path");
const configPath = path.join(os.homedir(), ".flip.json");

const getUser = async () => {
   try {
      const cfg = require(configPath);
      const http = createHTTP(cfg.token);
      const { data } = await http.get('/v2/e-money/me');
      return data
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

module.exports = { getUser };