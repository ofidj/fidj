var Error = /** @class */ (function () {
    function Error(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    ;
    Error.prototype.equals = function (err) {
        return this.code === err.code && this.reason === err.reason;
    };
    Error.prototype.toString = function () {
        var msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    };
    return Error;
}());
export { Error };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9maWRqLyIsInNvdXJjZXMiOlsic2RrL2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBRUksZUFBbUIsSUFBWSxFQUFTLE1BQWM7UUFBbkMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDdEQsQ0FBQztJQUFBLENBQUM7SUFFRixzQkFBTSxHQUFOLFVBQU8sR0FBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNoRSxDQUFDO0lBRUQsd0JBQVEsR0FBUjtRQUNJLElBQU0sR0FBRyxHQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDeEMsQ0FBQztJQUVMLFlBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXJyb3JJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBFcnJvciBpbXBsZW1lbnRzIEVycm9ySW50ZXJmYWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2RlOiBudW1iZXIsIHB1YmxpYyByZWFzb246IHN0cmluZykge1xuICAgIH07XG5cbiAgICBlcXVhbHMoZXJyOiBFcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2RlID09PSBlcnIuY29kZSAmJiB0aGlzLnJlYXNvbiA9PT0gZXJyLnJlYXNvbjtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtc2c6IHN0cmluZyA9ICh0eXBlb2YgdGhpcy5yZWFzb24gPT09ICdzdHJpbmcnKSA/IHRoaXMucmVhc29uIDogSlNPTi5zdHJpbmdpZnkodGhpcy5yZWFzb24pO1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmNvZGUgKyAnIC0gJyArIG1zZztcbiAgICB9XG5cbn1cbiJdfQ==