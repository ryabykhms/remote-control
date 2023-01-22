export type ControllerParams = {
  command: string;
  width?: number;
  height?: number;
};

export interface IController {
  handle(params: ControllerParams): Promise<string>;
}
