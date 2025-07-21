export type IControllerRequest<TBody = Record<string, unknown>> = {
  body: TBody;
  userId?: string;
};

export type ControllerResponse = {
  statusCode: number;
  body?: Record<string, unknown>;
};

export interface IController {
  execute(params: IControllerRequest): Promise<ControllerResponse>;
}
