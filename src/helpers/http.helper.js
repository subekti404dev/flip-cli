const Axios = require('axios').default;
const { appConstant } = require('../constants/app.constant');

const createAxios = (cfg) => Axios.create({
   baseURL: appConstant.apiUrl,
   ...cfg
});


module.exports = {
   createHTTP: (token) => {
      const cfg = { headers: { 'api-key': appConstant.apiKey } };
      if (token) {
         cfg.headers = {
            ...cfg.headers,
            Authorization: `Bearer ${token}`,
         }
      }
      return createAxios(cfg);
   }
};
