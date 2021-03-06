import { PayticketMaker } from './paytickets-resource.ts';
import { createPayticket } from './paytickets-controller.ts';
import './paytickets-controller.ts';
import { FactorController } from '../factors/factors-controller.ts';
import { EventEmitter } from '../../../services/event-emitter.ts';
import { makePaymentSuccessPage } from '../payment-results/payment-result-success.ts';
import { Config } from '../../../config.ts';
import { makePaymentErrorPage } from '../payment-results/payment-result-error.ts';
import { getGatewayHandler } from './payticket-gateways.ts';
import { BypassRouteError } from '../../../plugins/error/handleable-error.ts';


PayticketMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.payticket.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.payticket.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.payticket.retrieve'
  },
  'create': {
    signal: 'Route.Payticket.Create',
    method: 'post',
    path: '/',
    permission: 'admin.payticket.create',
    provider: async ({ payload }) => {

      const payticket = await createPayticket(payload.factor, payload.gateway, payload.returnUrl);
      payticket.meta = {};

      return payticket;

    }
  },
  'update': {
    template: 'update',
    permission: 'admin.payticket.update',
    stateValidators: [
      async ({ resourceId, controller }) => {
        const payticket = await controller.retrieve({ resourceId });
        if (payticket.resolved || payticket.payed || payticket.rejected) {
          throw new Error('this payticket is finalized');
        }
      }
    ]
  },
  'delete': {
    template: 'delete',
    permission: 'admin.payticket.delete',
    stateValidators: [
      async ({ resourceId, controller }) => {
        const payticket = await controller.retrieve({ resourceId });
        if (payticket.resolved || payticket.payed || payticket.rejected) {
          throw new Error('this payticket is finalized');
        }
      }
    ]
  },
  'verify': {
    signal: 'Route.Payticket.Verify',
    method: 'get',
    path: '/:resourceId/verify',
    stateValidators: [
      async ({ resourceId, controller, response }) => {
        try {

          const payticket = await controller.retrieve({ resourceId });
          if (payticket.resolved || payticket.payed || payticket.rejected) {
            throw new Error('this payticket is finalized');
          }

          const factor = await FactorController.retrieve({ resourceId: payticket.factor });
          if (factor.payed) {
            throw new Error('factor is already payed');
          }

        }
        catch (error: unknown) {

          response.send(
            makePaymentErrorPage({
              title: Config.payment.default.title,
              reason: (error as Record<string, unknown>).responseMessage as string || (error as Record<string, unknown>).message as string || 'An error occured',
              callback: Config.payment.default.callback,
              callbackSupport: Config.payment.default.supportCallback
            })
          );

          throw new BypassRouteError('payticket state invalid');

        }
      }
    ],
    handler: async ({ resourceId, controller, response }) => {

      const payticket = await controller.retrieve({ resourceId });

      try {

        const handler = getGatewayHandler(payticket.gateway);
        await handler.verify(payticket);

        const updatedPayticket = await controller.update({
          resourceId: payticket._id,
          payload: {
            resolved: true,
            resolvedAt: Date.now(),
            payed: true,
            payedAt: Date.now()
          }
        });

        const factor = await FactorController.update({
          resourceId: payticket.factor,
          payload: {
            payticket: String(payticket._id),
            payed: true,
            payedAt: Date.now()
          }
        });

        EventEmitter.emit('Resource.Payticket.Resolved', String(updatedPayticket._id), updatedPayticket);
        EventEmitter.emit('Resource.Payticket.Payed', String(updatedPayticket._id), updatedPayticket);
        EventEmitter.emit('Resource.Factor.Payed', String(factor._id), factor);

        response.send(
          makePaymentSuccessPage({
            title: Config.payment.default.title,
            heading: `${payticket.amount.toLocaleString()} ??????????`,
            reason: factor.name,
            callbackUrl: payticket.returnUrl || Config.payment.default.callback
          })
        );

      }
      catch (error: unknown) {

        const updatedPayticket = await controller.update({
          resourceId: payticket._id,
          payload: {
            resolved: true,
            resolvedAt: Date.now(),
            rejected: true,
            rejectedAt: Date.now(),
            rejectedFor: (error as Error).message
          }
        });

        EventEmitter.emit('Resource.Payticket.Resolved', String(updatedPayticket._id), updatedPayticket);
        EventEmitter.emit('Resource.Payticket.Rejected', String(updatedPayticket._id), updatedPayticket);

        response.send(
          makePaymentErrorPage({
            title: Config.payment.default.title,
            reason: (error as Record<string, unknown>).responseMessage as string || (error as Record<string, unknown>).message as string || 'An error occured',
            callback: Config.payment.default.callback,
            callbackSupport: Config.payment.default.supportCallback
          })
        );

      }

    }
  }
});


export const PayticketRouter = PayticketMaker.getRouter();
