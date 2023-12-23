import Pino from "pino";
import PinoPretty from "pino-pretty";
import _CONFIG from "../../../config";
export type PinoLoggerOptions = Pino.LoggerOptions;
export type PinoDestinationStream = Pino.StreamEntry | PinoPretty.PrettyStream;
export type LoggerLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace";
export type LoggerLevelWithSilent = LoggerLevel | "silent";

const getLoggerInstance = (
  options: PinoLoggerOptions,
  streams?: PinoDestinationStream[]
) => {
  if (options && streams) return Pino(options, Pino.multistream(streams));
  return Pino(options);
};

const logger = getLoggerInstance(
  _CONFIG.app.logger.options,
  _CONFIG.app.logger.streams
);

export default logger;
