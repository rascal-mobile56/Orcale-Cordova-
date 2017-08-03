
var DbService = function () {
    this.initialized = false;
    this.db = null;
};

DbService.prototype.init = function (callback) {
    if (!this.initialized) {
        this.initialized = true;
        this.db = new CardDbContext();
        try {
            this.db.init(callback);
        }
        catch (ex) {
            alert('base DB init error: ' + ex);
        }
    }
    else {
        callback();
    }
};

DbService.prototype.addPlay = function (play, callback) {
    this.db.plays.add(play);
    this.db.saveChanges(function () {
        if (callback != undefined) {
            callback();
        }
    }, function (er) {
        alert('error:' + er);
    });
};

DbService.prototype.getPlay = function(id, callback) {
    this.db.plays.where("id=" + id).toArray(function (items) {
        callback(items.firstOrDefault());
    });
};

DbService.prototype.getAllPlays= function(callback){
	this.db.plays.toArray(function (items) {
	    callback(items);
    });
};

// system extensions ----------------------------------------------------
Date.prototype.toStr = function () {
    var month = this.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var date = this.getDate();
    date = date < 10 ? "0" + date : date;
    var year = this.getFullYear() + "";
    year = year.substring(2, 4);
    return month + '-' + date + '-' + year;
};
