import { Button, down, left, mouse, Point, right, up } from '@nut-tree/nut-js';
import { ControllerParams, IController } from '../IController';

enum Figures {
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  SQUARE = 'square',
}

export class DrawController implements IController {
  private handlers = new Map<Figures, (width: number, height?: number) => Promise<void>>([
    [Figures.CIRCLE, (radius: number) => this.drawCircle(radius)],
    [Figures.RECTANGLE, (width: number, height: number) => this.drawRectangle(width, height)],
    [Figures.SQUARE, (width: number) => this.drawSquare(width)],
  ]);

  public async handle(params: ControllerParams): Promise<string> {
    const figure = params.command.split('_')?.[1]?.trim() as Figures;
    const handler = this.handlers.get(figure);

    if (!handler) {
      throw new Error('Unknown draw command');
    }

    await handler(params.width, params.height);

    return params.command;
  }

  private async drawCircle(radius: number): Promise<void> {
    const position = await mouse.getPosition();
    const x = position.x + radius * Math.cos(0);
    const y = position.y + radius * Math.sin(0);
    const points = this.getPointsForCircle(radius, position.x, position.y);

    await mouse.move([new Point(x, y)]);
    await mouse.drag(points);
  }

  private getPointsForCircle(radius: number, x0: number, y0: number): Point[] {
    let x = x0;
    let y = y0;

    const points = [];

    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      x = x0 + radius * Math.cos(i);
      y = y0 + radius * Math.sin(i);

      points.push(new Point(x, y));
    }

    return points;
  }

  private async drawRectangle(width: number, height: number): Promise<void> {
    const newHeight = height === undefined ? width : height;
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(width));
    await mouse.move(down(newHeight));
    await mouse.move(left(width));
    await mouse.move(up(newHeight));
    await mouse.releaseButton(Button.LEFT);
  }

  private async drawSquare(width: number): Promise<void> {
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(width));
    await mouse.move(down(width));
    await mouse.move(left(width));
    await mouse.move(up(width));
    await mouse.releaseButton(Button.LEFT);
  }
}
