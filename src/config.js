
module.exports = {
  GA_key:
  'ya29.Gl1oBt7e1G5pSWEs3YqewU7JrkV3tG4Q9gxbc2wGzEFPeXMCS11CnypzyOxETxKmSWQkFE7VQMMDPmJAtY8J_p2z1cA_hgn9D7XSh1Aq1QZh6QVtQf_cHPgC8A5AGZM',
  parsing_data: {
    parsing_data_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoarpsing/parsing_data/',
    EGP_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoarpsing/edinburgh-geoparser-docker/geoparser',
    EGP_script: (input, script, type, gaz) => {
      return `cat ${input} | ${script} -t ${type} -g ${gaz}`
    }
  }
}