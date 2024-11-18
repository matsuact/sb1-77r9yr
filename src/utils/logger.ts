// src/utils/logger.ts
const logs: string[] = [];

export const log = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}`;
  console.log(logMessage);
  logs.push(logMessage);
  if (logs.length > 100) {
    logs.shift();
  }
};

export const getLogs = () => logs;