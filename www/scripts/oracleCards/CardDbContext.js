
var CardDbContext = function () {
    nova.data.DbContext.call(this, "InnerOracleCardsDB", "1.04", "InnerOracleCardsDB", 500000);
    this.logSqls = true;
    this.alertErrors = true;
    this.plays = new nova.data.Repository(this, Play, "plays");
};

CardDbContext.prototype = new nova.data.DbContext();
CardDbContext.constructor = CardDbContext;

var Play = function() {
    nova.data.Entity.call(this);
    this.date = new Date();
    this.step1ItemIndex = 0;
    this.step2ItemIndex = 0;
    this.step3ItemIndex = 0;
    this.step4ItemIndex = 0;
};

Play.prototype = new nova.data.Entity();
Play.constructor = Play;
