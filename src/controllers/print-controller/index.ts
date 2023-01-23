import { mouse, Region, screen } from '@nut-tree/nut-js';
import Jimp from 'jimp';
import { ControllerParams, IController } from '../IController';

export class PrintController implements IController {
  public async handle(params: ControllerParams): Promise<string> {
    const width = 200;
    const height = 200;
    const x0 = width / 2;
    const y0 = height / 2;
    const position = await mouse.getPosition();
    const image = await screen.grabRegion(new Region(position.x - x0, position.y - y0, width, height));
    const rgbImage = await image.toRGB();

    const bufferedImage = new Promise((res) => {
      new Jimp({ data: rgbImage.data, width, height }, (err: Error, image: Jimp) => {
        image.getBuffer(Jimp.MIME_PNG, (err: Error, buffer: Buffer) => {
          res(buffer.toString('base64'));
        });
      });
    });

    const content = await bufferedImage;

    return `${params.command} ${content}`;
  }
}
