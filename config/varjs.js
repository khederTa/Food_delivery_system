module.exports = {
    admin: 'no',
    loggedin: 'no',

    setAdminYes: ()=>{
        this.admin = 'yes'
    },

    setAdminNo: ()=>{
        this.admin = 'no'
    },

    setLoggedinYes: ()=>{
        this.loggedin = 'yes'
    },

    setLoggedinNo: ()=>{
        this.loggedin = 'no'
    },
    getLoggedin: ()=>{
        return this.loggedin
    },
    getAdmin: ()=>{
        return this.admin
    }
}