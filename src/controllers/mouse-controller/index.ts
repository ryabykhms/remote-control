import { down, left, mouse, Point, right, up } from '@nut-tree/nut-js';
import { ControllerParams, IController } from '../IController';

enum Directions {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export class MouseController implements IController {
  private handlers = new Map<Directions, (y: number) => Promise<Point[]>>([
    [Directions.UP, (y: number) => up(y)],
    [Directions.DOWN, (y: number) => down(y)],
    [Directions.LEFT, (x: number) => left(x)],
    [Directions.RIGHT, (x: number) => right(x)],
  ]);

  public async handle(params: ControllerParams): Promise<string> {
    const direction = params.command.split('_')?.[1]?.trim() as Directions;
    const handler = this.handlers.get(direction);

    if (!handler) {
      throw new Error('Unknown mouse command');
    }

    await mouse.move(handler(params.width));

    return params.command;
  }
}
