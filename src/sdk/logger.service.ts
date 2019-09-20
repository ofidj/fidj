import {
    LoggerInterface, LoggerLevelEnum
} from './interfaces';

export class LoggerService implements LoggerInterface {

    constructor(private level?: LoggerLevelEnum) {
        if (!level) {
            this.level = LoggerLevelEnum.ERROR;
        }

        if (!window || !window.console) {
            this.level = LoggerLevelEnum.NONE;
        }
    }

    log(message: string, args: [any]) {
        if (this.level === LoggerLevelEnum.LOG) {
            console.log(message, args);
        }
    }

    warn(message: string, args: [any]) {
        if (this.level === LoggerLevelEnum.LOG || this.level === LoggerLevelEnum.WARN) {
            console.warn(message, args);
        }
    }

    error(message: string, args: [any]) {
        if (this.level === LoggerLevelEnum.LOG || this.level === LoggerLevelEnum.WARN || this.level === LoggerLevelEnum.ERROR) {
            console.error(message, args);
        }
    }

    setLevel(level: LoggerLevelEnum) {
        this.level = level;
    }
}

