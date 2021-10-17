import { FactorMaker } from './factors-resource.ts';


FactorMaker.setProperties({
  user: {
    type: 'string',
    ref: 'User',
    required: true,
    title: 'کاربر',
    titleable: true
  },
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  amount: {
    type: 'number',
    required: true,
    title: 'مقدار'
  },
  payed: {
    type: 'boolean',
    title: 'پرداخت شده'
  },
  payedAt: {
    type: 'number',
    title: 'زمان پرداخت'
  },
  payticket: {
    type: 'string',
    ref: 'Payticket',
    title: 'بلیط پرداخت'
  },
  meta: {
    type: 'object',
    hidden: true
  }
});


FactorMaker.makeModel();
