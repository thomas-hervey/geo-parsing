const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  GA_key:
  'ya29.Gl1oBt7e1G5pSWEs3YqewU7JrkV3tG4Q9gxbc2wGzEFPeXMCS11CnypzyOxETxKmSWQkFE7VQMMDPmJAtY8J_p2z1cA_hgn9D7XSh1Aq1QZh6QVtQf_cHPgC8A5AGZM',

  options: {
    database: {
      columnName: 'dimension_searchKeyword',
      refinementColumnName: 'dimension_searchRefinement',
      where: {
        index_value: {
          [Op.and]: {
            [Op.gte]: 1 /* 1778 1773 1736 1689 1739 */ ,
            [Op.lte]: 15
          }
        }
      },
    },
    geoparsing: {
      parsing_data_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/parsing_data/temp.txt',
      EGP: {
        EGP_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/edinburgh-geoparser-docker/geoparser',
        EGP_run_script_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/edinburgh-geoparser-docker/geoparser/scripts/run',
        EGP_execute_script: (i, s, t, g, l) => {
          let buffer = 1 // add 1 deg to bbox
          let score = 0.5
          let script = `cat ${i} | ${s} -t ${t} -g ${g}`
          if (l && l !== null && l !== undefined) { script += ` -lb ${l.W + buffer} ${l.N + buffer} ${l.E + buffer} ${l.S + buffer} ${score}`}
          return script
        },
        type: 'plain',
        gaz: 'geonames-local'
      },
      mordecai: {
        mordecai_path: '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/utils/mordecai_exec.py'
      }
    }
  }
}