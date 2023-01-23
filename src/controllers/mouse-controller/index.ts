import { down, left, mouse, Point, right, up } from '@nut-tree/nut-js';
import { ControllerParams, IController } from '../IController';

enum Directions {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

enum OtherCommands {
  POSITION = 'position',
}

export class MouseController implements IController {
  private directionHandlers = new Map<Directions, (y: number) => Promise<Point[]>>([
    [Directions.UP, (y: number) => up(y)],
    [Directions.DOWN, (y: number) => down(y)],
    [Directions.LEFT, (x: number) => left(x)],
    [Directions.RIGHT, (x: number) => right(x)],
  ]);

  private commandHandlers = new Map<OtherCommands, () => Promise<string>>([
    [OtherCommands.POSITION, () => this.getMousePosition()],
  ]);

  public async handle(params: ControllerParams): Promise<string> {
    const commandPart = params.command.split('_')?.[1]?.trim();
    const directionHandler = this.directionHandlers.get(commandPart as Directions);
    const commandHandler = this.commandHandlers.get(commandPart as OtherCommands);

    if (!directionHandler && !commandHandler) {
      throw new Error('Unknown mouse command');
    }

    directionHandler && (await mouse.move(directionHandler(params.width)));
    const result = await commandHandler?.();

    return result ? `${params.command} ${result}` : params.command;
  }

  private async getMousePosition(): Promise<string> {
    const position = await mouse.getPosition();
    return `${position.x},${position.y}`;
  }
}
