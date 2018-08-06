module.exports = {
    user: process.env.NODE_ORACLEDB_USER || 'MDS_DEV4',
    password: process.env.NODE_ORACLEDB_PASSWORD || 'Pa55word',
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || '192.168.56.101/CALDB',
}