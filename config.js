module.exports = {
    'db': {
        host: '127.0.0.1',
        port: 27017,
        db: 'pwmgr'
    },
    'params': {
        'uid': {
            max: 300,
            min: 5,
            rules:['isEmail']
        },
        'uid2': {
            max: 300,
            min: 5,
            rules:['isEmail']
        }
    }
}
