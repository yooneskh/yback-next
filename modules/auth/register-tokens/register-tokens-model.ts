import { RegisterTokenMaker } from './register-tokens-resource.ts';


RegisterTokenMaker.setProperties({
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  phoneNumber: {
    type: 'string',
    required: true,
    title: 'شماره تلفن',
    titleable: true
  },
  used: {
    type: 'boolean',
    title: 'استفاده شده'
  },
  usedAt: {
    type: 'number',
    title: 'زمان استفاده'
  }
});


RegisterTokenMaker.makeModel();
