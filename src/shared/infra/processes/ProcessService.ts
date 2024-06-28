import { exec } from 'child_process';

type Callback = () => void;

export class ProcessService {
  public static killProcessOnPort(port: number, cb: Callback) {
    const killCommand =
      process.platform === 'win32'
        ? `netstat -ano | findstr :${port} | findstr LISTENING`
        : `lsof -i:${port} -t`;

    exec(killCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to execute the command: ${error.message}`);
        return cb?.();
      }

      if (stderr) {
        console.error(`Command execution returned an error: ${stderr}`);
        return cb?.();
      }

      const processId = stdout.trim();
      if (processId) {
        const killProcessCommand =
          process.platform === 'win32' ? `taskkill /F /PID ${processId}` : `kill ${processId}`;

        exec(killProcessCommand, (error) => {
          if (error) {
            console.error(`Failed to kill the process: ${error.message}`);
            return cb?.();
          }
          console.log(`Process running on port ${port} has been killed.`);
          return cb?.();
        });
      } else {
        console.log(`No process found running on port ${port}.`);
        return cb?.();
      }
    });
  }
}
