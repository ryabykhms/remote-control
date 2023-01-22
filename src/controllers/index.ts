import { DrawController } from './draw-controller';
import { ControllerParams, IController } from './IController';
import { MouseController } from './mouse-controller';

enum ControllerTypes {
  MOUSE = 'mouse',
  DRAW = 'draw',
  PRINT = 'print',
}

export class MessageController {
  private controllers = new Map<ControllerTypes, () => IController>([
    [ControllerTypes.MOUSE, () => new MouseController()],
    [ControllerTypes.DRAW, () => new DrawController()],
  ]);

  public handleMessage(...args: string[]): Promise<string> {
    try {
      const params = this.parseArgs(...args);
      const controller = this.getController(params.command);

      if (!controller) {
        throw new Error('Unsupported command');
      }

      return controller.handle(params);
    } catch (e) {
      console.error(e);
    }
  }

  private parseArgs(...args: string[]): ControllerParams {
    if (!args.length) {
      return;
    }

    const [command, width, height] = args;

    return {
      command,
      width: this.parseInt(width),
      height: this.parseInt(height),
    };
  }

  private getController(command: string): IController {
    const type = Object.values(ControllerTypes).find((type) => command.startsWith(type));

    return this.controllers.get(type)?.();
  }

  private parseInt(value: string): number {
    if (!value) {
      return;
    }

    return Number.parseInt(value, 10);
  }
}
