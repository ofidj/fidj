import { LoggerLevelEnum } from './interfaces';
export class LoggerService {
    constructor(level) {
        this.level = level;
        if (!level) {
            this.level = LoggerLevelEnum.ERROR;
        }
        if (typeof console === 'undefined') {
            this.level = LoggerLevelEnum.NONE;
        }
    }
    log(message, args) {
        if (this.level === LoggerLevelEnum.LOG) {
            console.log(message, args);
        }
    }
    warn(message, args) {
        if (this.level === LoggerLevelEnum.LOG || this.level === LoggerLevelEnum.WARN) {
            console.warn(message, args);
        }
    }
    error(message, args) {
        if (this.level === LoggerLevelEnum.LOG || this.level === LoggerLevelEnum.WARN || this.level === LoggerLevelEnum.ERROR) {
            console.error(message, args);
        }
    }
    setLevel(level) {
        this.level = level;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9maWRqLyIsInNvdXJjZXMiOlsic2RrL2xvZ2dlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDYyxlQUFlLEVBQ25DLE1BQU0sY0FBYyxDQUFDO0FBRXRCLE1BQU0sT0FBTyxhQUFhO0lBRXRCLFlBQW9CLEtBQXVCO1FBQXZCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7U0FDdEM7UUFFRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtZQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUM7U0FDckM7SUFDTCxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWUsRUFBRSxJQUFXO1FBQzVCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQUMsR0FBRyxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFlLEVBQUUsSUFBVztRQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLGVBQWUsQ0FBQyxJQUFJLEVBQUU7WUFDM0UsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0I7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQWUsRUFBRSxJQUFXO1FBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLGVBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDbkgsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQXNCO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLCBMb2dnZXJMZXZlbEVudW1cbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIExvZ2dlclNlcnZpY2UgaW1wbGVtZW50cyBMb2dnZXJJbnRlcmZhY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsZXZlbD86IExvZ2dlckxldmVsRW51bSkge1xuICAgICAgICBpZiAoIWxldmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxldmVsID0gTG9nZ2VyTGV2ZWxFbnVtLkVSUk9SO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5sZXZlbCA9IExvZ2dlckxldmVsRW51bS5OT05FO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9nKG1lc3NhZ2U6IHN0cmluZywgYXJnczogW2FueV0pIHtcbiAgICAgICAgaWYgKHRoaXMubGV2ZWwgPT09IExvZ2dlckxldmVsRW51bS5MT0cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2FybihtZXNzYWdlOiBzdHJpbmcsIGFyZ3M6IFthbnldKSB7XG4gICAgICAgIGlmICh0aGlzLmxldmVsID09PSBMb2dnZXJMZXZlbEVudW0uTE9HIHx8IHRoaXMubGV2ZWwgPT09IExvZ2dlckxldmVsRW51bS5XQVJOKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIGFyZ3M6IFthbnldKSB7XG4gICAgICAgIGlmICh0aGlzLmxldmVsID09PSBMb2dnZXJMZXZlbEVudW0uTE9HIHx8IHRoaXMubGV2ZWwgPT09IExvZ2dlckxldmVsRW51bS5XQVJOIHx8IHRoaXMubGV2ZWwgPT09IExvZ2dlckxldmVsRW51bS5FUlJPUikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExldmVsKGxldmVsOiBMb2dnZXJMZXZlbEVudW0pIHtcbiAgICAgICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIH1cbn1cblxuIl19