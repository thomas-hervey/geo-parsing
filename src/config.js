
module.exports = {
  GA_key:
  'ya29.Gl1oBt7e1G5pSWEs3YqewU7JrkV3tG4Q9gxbc2wGzEFPeXMCS11CnypzyOxETxKmSWQkFE7VQMMDPmJAtY8J_p2z1cA_hgn9D7XSh1Aq1QZh6QVtQf_cHPgC8A5AGZM',

  options: {
    database: {
      columnName: 'dimension_searchKeyword',
      where: {},
    },
    geoparsing: {
      parsing_data_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/parsing_data/temp.txt',
      EGP: {
        EGP_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/edinburgh-geoparser-docker/geoparser',
        EGP_run_script_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/edinburgh-geoparser-docker/geoparser/scripts/run',
        EGP_execute_script: (i, s, t, g, l) => {
          let script = `cat ${i} | ${s} -t ${t} -g ${g}`
          if (l) { script += ` -l ${l}`}
          return script
        },
        type: 'plain',
        gaz: 'geonames-local'
      }
    }
  }
}