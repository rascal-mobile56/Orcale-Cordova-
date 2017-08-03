
Date.prototype.getDaysUntil = function(futureDay) {
    var future = new Date(futureDay.getFullYear(), futureDay.getMonth(), futureDay.getDate());
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    return (future - today) / (24 * 3600000);
};

Date.prototype.toShortDateString = function() {
    return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate();
};